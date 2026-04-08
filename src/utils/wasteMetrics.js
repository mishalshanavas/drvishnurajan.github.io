const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const safeDivide = (num, den) => (den ? num / den : 0);

const WASTE_TYPE_CARBON_FACTORS = {
    organic: 0.58,
    recyclable: 0.34,
    hazardous: 1.92,
    'e-waste': 1.12,
    mixed: 1.45
};

export const calculateDiversionRate = (compositionPoint) => {
    if (!compositionPoint) return 0;

    const diverted = (compositionPoint.organic || 0) + (compositionPoint.recyclable || 0) + (compositionPoint.eWaste || 0);
    const total = diverted + (compositionPoint.hazardous || 0) + (compositionPoint.residual || 0);

    return clamp(safeDivide(diverted * 100, total), 0, 100);
};

export const calculateSegregationCompliance = (bins) => {
    if (!bins?.length) return 0;

    const score = bins.reduce((sum, bin) => {
        const normalized = clamp((bin.segregationScore || 0) - (bin.contaminationPct || 0) * 0.45, 0, 100);
        return sum + normalized;
    }, 0);

    return safeDivide(score, bins.length);
};

export const estimateOverflowEtaHours = (bin) => {
    if (!bin) return 0;
    if ((bin.fillPct || 0) >= 100) return 0;

    const remainingKg = Math.max((bin.capacityKg || 0) - (bin.currentLoadKg || 0), 0);
    const hourlyGrowth = Math.max((bin.dailyGenerationKg || 0) / 24, 0.05);

    return safeDivide(remainingKg, hourlyGrowth);
};

export const calculateOverflowRisk = (bin, thresholdPct = 80) => {
    if (!bin) return 0;

    const fillScore = clamp((bin.fillPct || 0) * 0.58, 0, 58);
    const methaneScore = clamp((bin.methanePpm || 0) / 2.8, 0, 22);
    const odorScore = clamp((bin.odorIndex || 0) * 2.2, 0, 14);
    const uptimePenalty = bin.connectivity === 'offline' ? 8 : 0;
    const thresholdPenalty = (bin.fillPct || 0) >= thresholdPct ? 6 : 0;

    return clamp(fillScore + methaneScore + odorScore + uptimePenalty + thresholdPenalty, 0, 100);
};

export const estimateCarbonFromWasteStream = (bins) => {
    if (!bins?.length) return 0;

    return bins.reduce((sum, bin) => {
        const factor = WASTE_TYPE_CARBON_FACTORS[bin.wasteType] || WASTE_TYPE_CARBON_FACTORS.mixed;
        return sum + (bin.currentLoadKg || 0) * factor;
    }, 0);
};

export const buildRoutePlan = (bins, vehicleCount = 3, riskThreshold = 75) => {
    if (!bins?.length) {
        return {
            totalDistanceKm: 0,
            avgRisk: 0,
            priorityStops: [],
            routes: []
        };
    }

    const enriched = bins.map((bin) => {
        const overflowEtaHours = estimateOverflowEtaHours(bin);
        const risk = calculateOverflowRisk(bin, riskThreshold);

        return {
            ...bin,
            overflowEtaHours,
            risk
        };
    });

    const priorityStops = [...enriched].sort((a, b) => {
        if (b.risk !== a.risk) return b.risk - a.risk;
        return a.overflowEtaHours - b.overflowEtaHours;
    });

    const routes = Array.from({ length: Math.max(vehicleCount, 1) }, (_, index) => ({
        vehicle: `Fleet-${index + 1}`,
        stops: [],
        distanceKm: 0
    }));

    priorityStops.forEach((stop, index) => {
        const routeIndex = index % routes.length;
        routes[routeIndex].stops.push(stop);
        routes[routeIndex].distanceKm += (stop.distanceFromHubKm || 0) * 1.12;
    });

    const totalDistanceKm = routes.reduce((sum, route) => sum + route.distanceKm, 0);
    const avgRisk = safeDivide(priorityStops.reduce((sum, stop) => sum + stop.risk, 0), priorityStops.length);

    return {
        totalDistanceKm,
        avgRisk,
        priorityStops,
        routes
    };
};

export const buildWasteForecast = (generationSeries, horizonHours = 6) => {
    if (!generationSeries?.length) return [];

    const recent = generationSeries.slice(-4);
    const generatedSlope = safeDivide(
        recent.slice(1).reduce((sum, point, index) => sum + (point.generatedKg - recent[index].generatedKg), 0),
        Math.max(recent.length - 1, 1)
    );
    const collectedSlope = safeDivide(
        recent.slice(1).reduce((sum, point, index) => sum + (point.collectedKg - recent[index].collectedKg), 0),
        Math.max(recent.length - 1, 1)
    );

    const last = generationSeries[generationSeries.length - 1];

    return Array.from({ length: horizonHours }, (_, idx) => {
        const step = idx + 1;
        return {
            time: `F+${step}h`,
            generatedKg: Math.max(0, Number((last.generatedKg + generatedSlope * step).toFixed(1))),
            collectedKg: Math.max(0, Number((last.collectedKg + collectedSlope * step).toFixed(1))),
            forecast: true
        };
    });
};

export const calculateWasteKpis = (bins, compositionPoint, routePlan) => {
    const totalCollectedKg = bins.reduce((sum, bin) => sum + (bin.currentLoadKg || 0), 0);
    const avgFillPct = safeDivide(bins.reduce((sum, bin) => sum + (bin.fillPct || 0), 0), bins.length);
    const diversionRate = calculateDiversionRate(compositionPoint);
    const segregationCompliance = calculateSegregationCompliance(bins);
    const riskyBins = bins.filter((bin) => calculateOverflowRisk(bin) >= 75).length;
    const missedPickups = bins.filter((bin) => (bin.lastPickupHoursAgo || 0) >= 14 && (bin.fillPct || 0) >= 80).length;
    const compostPotentialKg = (compositionPoint?.organic || 0) * 12.8;

    const routeDistance = routePlan?.totalDistanceKm || 0;
    const routeEfficiency = clamp(100 - routeDistance * 1.7, 0, 100);
    const carbonEstimateKg = estimateCarbonFromWasteStream(bins);

    return {
        totalCollectedKg,
        avgFillPct,
        diversionRate,
        segregationCompliance,
        riskyBins,
        missedPickups,
        compostPotentialKg,
        routeDistance,
        routeEfficiency,
        carbonEstimateKg
    };
};