
// Mock Data for "Sahrdaya College"
export const VILLAGE_CENTER = [10.3594, 76.2858];

// Smart Asset Data Model
export const ASSETS = [
    // --- Energy Sources (Producers) ---
    { 
        id: 'E-01', 
        type: 'Main Substation', 
        category: 'energy', 
        flowType: 'producer',
        coords: [10.3590, 76.2855], 
        status: 'normal', 
        val: '482kW', 
        details: 'Grid Connection',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 0, max: 1000, unit: 'kW' },
        incidents: []
    },
    { 
        id: 'E-02', 
        type: 'Solar Array', 
        category: 'energy', 
        flowType: 'producer',
        coords: [10.3582, 76.2868], 
        status: 'normal', 
        val: '125kW', 
        details: 'Rooftop Generation',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 10, max: 200, unit: 'kW' },
        incidents: []
    },
    { 
        id: 'E-06', 
        type: 'Diesel Gen', 
        category: 'energy', 
        flowType: 'producer',
        coords: [10.3595, 76.2870], 
        status: 'offline', 
        val: '0kW', 
        details: 'Backup Power',
        controlState: { isOn: false, mode: 'manual' },
        thresholds: { min: 0, max: 500, unit: 'kW' },
        incidents: []
    },
    { 
        id: 'E-07', 
        type: 'Biogas Plant', 
        category: 'energy', 
        flowType: 'producer',
        coords: [10.3570, 76.2860], 
        status: 'normal', 
        val: '45kW', 
        details: 'Waste to Energy',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 0, max: 100, unit: 'kW' },
        incidents: []
    },

    // --- Energy Consumers (Loads) ---
    { 
        id: 'E-03', 
        type: 'Feeder 1 (Admin)', 
        category: 'energy', 
        flowType: 'consumer',
        coords: [10.3595, 76.2840], 
        status: 'normal', 
        val: '150kW', 
        details: 'Admin Block Supply',
        controlState: { isOn: true, mode: 'manual' },
        thresholds: { min: 0, max: 200, unit: 'kW' },
        incidents: []
    },
    { 
        id: 'E-04', 
        type: 'Feeder 2 (Hostel)', 
        category: 'energy', 
        flowType: 'consumer',
        coords: [10.3578, 76.2880], 
        status: 'normal', 
        val: '180kW', 
        details: 'Hostel Zone Supply',
        controlState: { isOn: true, mode: 'manual' },
        thresholds: { min: 0, max: 250, unit: 'kW' },
        incidents: []
    },
    { 
        id: 'E-05', 
        type: 'Feeder 3 (Lab)', 
        category: 'energy', 
        flowType: 'consumer',
        coords: [10.3608, 76.2852], 
        status: 'warning', 
        val: '210kW', 
        details: 'Lab Complex Supply',
        controlState: { isOn: true, mode: 'manual' },
        thresholds: { min: 0, max: 200, unit: 'kW' }, // Exceeded max
        incidents: [] // Will be populated by logic
    },
    { 
        id: 'E-09', // Formerly C-01
        type: 'Street Lights', 
        category: 'energy', 
        flowType: 'consumer',
        coords: [10.3600, 76.2860], 
        status: 'normal', 
        val: '25kW', 
        details: 'Main Avenue Zone',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 0, max: 30, unit: 'kW' },
        incidents: [] 
    },
    { 
        id: 'E-08', 
        type: 'Battery Bank', 
        category: 'energy', 
        flowType: 'storage',
        coords: [10.3588, 76.2858], 
        status: 'normal', 
        val: '85%', 
        details: 'Energy Storage',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 20, max: 100, unit: '%' },
        incidents: []
    },

    // --- Water Assets ---
    { 
        id: 'W-01', 
        type: 'Water Tank A', 
        category: 'water', 
        flowType: 'storage',
        coords: [10.3598, 76.2860], 
        status: 'critical', 
        val: '15%', 
        details: 'Main Campus (Low Level)',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 20, max: 95, unit: '%' },
        incidents: [] 
    },
    { 
        id: 'W-02', 
        type: 'Water Tank B', 
        category: 'water', 
        flowType: 'storage',
        coords: [10.3585, 76.2875], 
        status: 'warning', 
        val: '45%', 
        details: 'Mens Hostel',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 50, max: 95, unit: '%' },
        incidents: []
    },
    { 
        id: 'W-03', 
        type: 'Water Tank C', 
        category: 'water', 
        flowType: 'storage',
        coords: [10.3610, 76.2850], 
        status: 'normal', 
        val: '92%', 
        details: 'Lab Block',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 20, max: 95, unit: '%' },
        incidents: []
    },
    { 
        id: 'W-06', 
        type: 'Treatment Plant', 
        category: 'water', 
        flowType: 'producer',
        coords: [10.3615, 76.2845], 
        status: 'normal', 
        val: 'Active', 
        details: 'RO Unit',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 0, max: 1, unit: 'boolean' },
        incidents: []
    },
    { 
        id: 'W-07', // Formerly C-02
        type: 'Irrigation Pump', 
        category: 'water', 
        flowType: 'consumer',
        coords: [10.3580, 76.2850], 
        status: 'offline', 
        val: 'Off', 
        details: 'Garden Sector B',
        controlState: { isOn: false, mode: 'manual' },
        thresholds: { min: 0, max: 1, unit: 'boolean' },
        incidents: []
    },

    // --- Other Assets (Waste, Transport) ---
    { 
        id: 'S-01', 
        type: 'Compactor Bin', 
        category: 'waste', 
        flowType: 'storage', 
        coords: [10.3600, 76.2862], 
        status: 'critical', 
        val: '95%', 
        details: 'Canteen Area',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 0, max: 90, unit: '%' },
        incidents: ['Needs Collection'] // Example preset incident
    },
    { 
        id: 'T-01', // Formerly I-01
        type: 'Traffic Cam 2', 
        category: 'transport', 
        flowType: 'sensor',
        coords: [10.3602, 76.2858], 
        status: 'warning', 
        val: 'High', 
        details: 'Gate 2 Entrance',
        controlState: { isOn: true, mode: 'auto' },
        thresholds: { min: 0, max: 1, unit: 'level' },
        incidents: ['Congestion Alert']
    },
];
