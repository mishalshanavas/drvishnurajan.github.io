const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const safeDivide = (num, den) => (den ? num / den : 0);

export const calculateCarbonIntensity = (totalEmissionsKg, totalEnergyKwh) => {
    return Number(safeDivide(totalEmissionsKg, totalEnergyKwh).toFixed(3));
};

export const calculateCircularityIndex = ({ recycledKg, compostedKg, totalWasteKg, reusedWaterKl, totalWaterKl }) => {
    const wasteCircularity = safeDivide((recycledKg + compostedKg) * 100, totalWasteKg);
    const waterCircularity = safeDivide(reusedWaterKl * 100, totalWaterKl);

    return clamp(wasteCircularity * 0.7 + waterCircularity * 0.3, 0, 100);
};

export const calculateEcoScore = ({ renewableShare, waterEfficiency, wasteDiversion, carbonIntensity, resilienceScore }) => {
    const renewableComponent = clamp(renewableShare, 0, 100);
    const waterComponent = clamp(waterEfficiency, 0, 100);
    const wasteComponent = clamp(wasteDiversion, 0, 100);
    const carbonComponent = clamp(100 - carbonIntensity * 170, 0, 100);
    const resilienceComponent = clamp(resilienceScore, 0, 100);

    const score =
        renewableComponent * 0.25 +
        waterComponent * 0.2 +
        wasteComponent * 0.2 +
        carbonComponent * 0.2 +
        resilienceComponent * 0.15;

    return Number(clamp(score, 0, 100).toFixed(1));
};

export const applySustainabilityScenario = (baseline, scenario, adoptionPct = 100) => {
    const adoptionFactor = clamp(adoptionPct, 0, 100) / 100;

    const adjustPercent = (value, pctDelta) => value * (1 + (pctDelta / 100) * adoptionFactor);

    const totalEmissionsKg = adjustPercent(baseline.totalEmissionsKg, scenario.emissionsDeltaPct || 0);
    const renewableShare = clamp(adjustPercent(baseline.renewableShare, scenario.renewableDeltaPct || 0), 0, 100);
    const waterEfficiency = clamp(adjustPercent(baseline.waterEfficiency, scenario.waterEfficiencyDeltaPct || 0), 0, 100);
    const wasteDiversion = clamp(adjustPercent(baseline.wasteDiversion, scenario.wasteDiversionDeltaPct || 0), 0, 100);
    const resilienceScore = clamp(adjustPercent(baseline.resilienceScore, scenario.resilienceDeltaPct || 0), 0, 100);

    const recycledKg = adjustPercent(baseline.recycledKg, scenario.wasteDiversionDeltaPct || 0);
    const compostedKg = adjustPercent(baseline.compostedKg, scenario.wasteDiversionDeltaPct || 0);
    const reusedWaterKl = adjustPercent(baseline.reusedWaterKl, scenario.waterEfficiencyDeltaPct || 0);

    const carbonIntensity = calculateCarbonIntensity(totalEmissionsKg, baseline.totalEnergyKwh);
    const circularityIndex = calculateCircularityIndex({
        recycledKg,
        compostedKg,
        totalWasteKg: baseline.totalWasteKg,
        reusedWaterKl,
        totalWaterKl: baseline.totalWaterKl
    });

    const ecoScore = calculateEcoScore({
        renewableShare,
        waterEfficiency,
        wasteDiversion,
        carbonIntensity,
        resilienceScore
    });

    return {
        totalEmissionsKg,
        renewableShare,
        waterEfficiency,
        wasteDiversion,
        resilienceScore,
        carbonIntensity,
        circularityIndex,
        ecoScore,
        recycledKg,
        compostedKg,
        reusedWaterKl
    };
};

export const buildScenarioAdjustedTrend = (trendSeries, scenario, adoptionPct = 100) => {
    const adoptionFactor = clamp(adoptionPct, 0, 100) / 100;

    return trendSeries.map((point) => {
        const emissionsLift = (scenario.emissionsDeltaPct || 0) * adoptionFactor;
        const renewableLift = (scenario.renewableDeltaPct || 0) * adoptionFactor;
        const waterLift = (scenario.waterEfficiencyDeltaPct || 0) * adoptionFactor;
        const wasteLift = (scenario.wasteDiversionDeltaPct || 0) * adoptionFactor;

        return {
            ...point,
            carbonIntensity: Number((point.carbonIntensity * (1 + emissionsLift / 100)).toFixed(3)),
            renewableShare: clamp(Number((point.renewableShare * (1 + renewableLift / 100)).toFixed(1)), 0, 100),
            waterEfficiency: clamp(Number((point.waterEfficiency * (1 + waterLift / 100)).toFixed(1)), 0, 100),
            circularity: clamp(Number((point.circularity * (1 + wasteLift / 100)).toFixed(1)), 0, 100),
            ecoScore: clamp(Number((point.ecoScore + renewableLift * 0.2 + waterLift * 0.15 + wasteLift * 0.2 - emissionsLift * 0.2).toFixed(1)), 0, 100)
        };
    });
};

export const summarizeTargetProgress = (metrics, targets) => {
    return targets.map((target) => {
        let current = 0;

        if (target.metric === 'Eco Score') current = metrics.ecoScore;
        if (target.metric === 'Carbon Intensity') current = metrics.carbonIntensity;
        if (target.metric === 'Renewable Share') current = metrics.renewableShare;
        if (target.metric === 'Water Efficiency') current = metrics.waterEfficiency;
        if (target.metric === 'Circularity Index') current = metrics.circularityIndex;

        const progress = target.lowerIsBetter
            ? clamp((target.target / Math.max(current, 0.001)) * 100, 0, 120)
            : clamp((current / Math.max(target.target, 0.001)) * 100, 0, 120);

        const gap = target.lowerIsBetter ? current - target.target : target.target - current;
        const status = progress >= 100 ? 'on-track' : progress >= 85 ? 'watch' : 'off-track';

        return {
            ...target,
            current,
            progress,
            gap,
            status
        };
    });
};