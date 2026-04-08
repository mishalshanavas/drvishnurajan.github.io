export const BASELINE_SUSTAINABILITY_PROFILE = {
    totalEmissionsKg: 5840,
    totalEnergyKwh: 16750,
    renewableShare: 54,
    waterEfficiency: 72,
    wasteDiversion: 63,
    resilienceScore: 69,
    recycledKg: 980,
    compostedKg: 1240,
    totalWasteKg: 3520,
    reusedWaterKl: 118,
    totalWaterKl: 166
};

export const SUSTAINABILITY_SCENARIOS = {
    baseline: {
        label: 'Baseline Operations',
        emissionsDeltaPct: 0,
        renewableDeltaPct: 0,
        waterEfficiencyDeltaPct: 0,
        wasteDiversionDeltaPct: 0,
        resilienceDeltaPct: 0
    },
    festival: {
        label: 'Festival Load',
        emissionsDeltaPct: 12,
        renewableDeltaPct: -4,
        waterEfficiencyDeltaPct: -7,
        wasteDiversionDeltaPct: -5,
        resilienceDeltaPct: -6
    },
    waterStress: {
        label: 'Water Stress Week',
        emissionsDeltaPct: 7,
        renewableDeltaPct: -2,
        waterEfficiencyDeltaPct: -12,
        wasteDiversionDeltaPct: -3,
        resilienceDeltaPct: -8
    },
    greenPolicy: {
        label: 'Green Policy Push',
        emissionsDeltaPct: -14,
        renewableDeltaPct: 11,
        waterEfficiencyDeltaPct: 9,
        wasteDiversionDeltaPct: 10,
        resilienceDeltaPct: 8
    }
};

export const SUSTAINABILITY_TREND_SERIES = [
    { time: 'Week 1', ecoScore: 68, carbonIntensity: 0.38, renewableShare: 51, waterEfficiency: 69, circularity: 56 },
    { time: 'Week 2', ecoScore: 69, carbonIntensity: 0.37, renewableShare: 52, waterEfficiency: 70, circularity: 57 },
    { time: 'Week 3', ecoScore: 70, carbonIntensity: 0.36, renewableShare: 53, waterEfficiency: 71, circularity: 58 },
    { time: 'Week 4', ecoScore: 71, carbonIntensity: 0.35, renewableShare: 54, waterEfficiency: 72, circularity: 60 },
    { time: 'Week 5', ecoScore: 72, carbonIntensity: 0.35, renewableShare: 55, waterEfficiency: 72, circularity: 61 },
    { time: 'Week 6', ecoScore: 73, carbonIntensity: 0.34, renewableShare: 56, waterEfficiency: 73, circularity: 63 },
    { time: 'Week 7', ecoScore: 74, carbonIntensity: 0.33, renewableShare: 58, waterEfficiency: 74, circularity: 64 },
    { time: 'Week 8', ecoScore: 75, carbonIntensity: 0.32, renewableShare: 59, waterEfficiency: 75, circularity: 66 }
];

export const RESOURCE_COUPLING_SERIES = [
    { time: '06:00', microgridKw: 314, irrigationKl: 18, treatmentKl: 21, wasteToEnergyKw: 33 },
    { time: '08:00', microgridKw: 338, irrigationKl: 24, treatmentKl: 23, wasteToEnergyKw: 36 },
    { time: '10:00', microgridKw: 362, irrigationKl: 28, treatmentKl: 24, wasteToEnergyKw: 38 },
    { time: '12:00', microgridKw: 405, irrigationKl: 32, treatmentKl: 26, wasteToEnergyKw: 40 },
    { time: '14:00', microgridKw: 426, irrigationKl: 29, treatmentKl: 28, wasteToEnergyKw: 41 },
    { time: '16:00', microgridKw: 391, irrigationKl: 25, treatmentKl: 27, wasteToEnergyKw: 39 },
    { time: '18:00', microgridKw: 372, irrigationKl: 21, treatmentKl: 25, wasteToEnergyKw: 37 },
    { time: '20:00', microgridKw: 349, irrigationKl: 17, treatmentKl: 22, wasteToEnergyKw: 34 }
];

export const EMISSIONS_BY_SECTOR = [
    { sector: 'Grid Import', emissionsKg: 2200 },
    { sector: 'Transport Fleet', emissionsKg: 980 },
    { sector: 'Water Treatment', emissionsKg: 760 },
    { sector: 'Solid Waste', emissionsKg: 940 },
    { sector: 'Buildings', emissionsKg: 960 }
];

export const ZONE_SUSTAINABILITY_STATUS = [
    { zone: 'North Habitat', energy: 74, water: 70, waste: 67, resilience: 72 },
    { zone: 'South Habitat', energy: 70, water: 66, waste: 64, resilience: 68 },
    { zone: 'Institutional Core', energy: 79, water: 75, waste: 71, resilience: 76 },
    { zone: 'Market Belt', energy: 65, water: 61, waste: 58, resilience: 60 },
    { zone: 'Agri Fringe', energy: 72, water: 78, waste: 63, resilience: 74 }
];

export const SUSTAINABILITY_TARGETS = [
    { metric: 'Eco Score', target: 80, deadline: 'Q3 2026' },
    { metric: 'Carbon Intensity', target: 0.29, deadline: 'Q4 2026', lowerIsBetter: true },
    { metric: 'Renewable Share', target: 66, deadline: 'Q4 2026' },
    { metric: 'Water Efficiency', target: 82, deadline: 'Q3 2026' },
    { metric: 'Circularity Index', target: 72, deadline: 'Q4 2026' }
];

export const SUSTAINABILITY_ANOMALIES = [
    {
        id: 'SUS-01',
        severity: 'warning',
        zone: 'Market Belt',
        message: 'Evening energy spike coupled with low solar availability.',
        recommendation: 'Shift cold-storage loads by 90 minutes and trigger battery dispatch plan.',
        time: '08:40'
    },
    {
        id: 'SUS-02',
        severity: 'critical',
        zone: 'South Habitat',
        message: 'Water reuse loop dropped below projected rate by 14%.',
        recommendation: 'Increase greywater recirculation duty cycle and inspect valve cluster W-2.',
        time: '08:18'
    },
    {
        id: 'SUS-03',
        severity: 'normal',
        zone: 'Institutional Core',
        message: 'Compost-to-biogas conversion reached efficiency baseline.',
        recommendation: 'Maintain feed consistency and hold digester temperature profile.',
        time: '07:56'
    }
];