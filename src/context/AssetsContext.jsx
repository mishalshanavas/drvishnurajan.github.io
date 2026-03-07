import React, { createContext, useState, useEffect, useRef } from 'react';
import { ref, onValue, update, remove } from 'firebase/database';
import { db } from '../firebase.config';
// MOCK DATA REMOVED as per user request
// import { ASSETS as MOCK_ASSETS } from '../data/mockData';
import { formatTimeIST } from '../utils/timeUtils';

export const AssetsContext = createContext();

export const AssetsProvider = ({ children }) => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const lastValuesRef = useRef({}); // Store last known values to detect changes
    const lastUpdatedMapRef = useRef({}); // Store last updated timestamps

    const historyMapRef = useRef({}); // Store value history for graphs (id -> array)
    const MAX_HISTORY_POINTS = 60; // Show last 60 data points (Live rolling window)

    const updateAsset = async (id, data, user = null) => {
        try {
            const assetRef = ref(db, `assets/${id}`);

            let finalData = { ...data };

            if (user) {
                const timestamp = formatTimeIST(new Date());
                const userInfo = {
                    name: user.displayName || 'Unknown',
                    email: user.email,
                    time: timestamp
                };

                finalData.lastModifiedBy = userInfo;
            }

            await update(assetRef, finalData);
        } catch (err) {
            console.error("Error updating asset:", err);
            throw err;
        }
    };

    const deleteAsset = async (id) => {
        try {
            const assetRef = ref(db, `assets/${id}`);
            await remove(assetRef);
        } catch (err) {
            console.error("Error deleting asset:", err);
            throw err;
        }
    };

    // Helper to parse value for graph
    const parseValueForGraph = (val) => {
        if (val === undefined || val === null) return 0;
        if (typeof val === 'number') return val;

        // Handle string cases
        if (val === 'Active' || val === 'On') return 1;
        if (val === 'Off' || val === 'Inactive' || val === 'Offline') return 0;

        const match = String(val).match(/([\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    };

    // Total Load History Logic
    const totalLoadHistoryRef = useRef([]);
    const latestTotalsRef = useRef({ load: 0, generation: 0 }); // Store latest for heartbeat
    const [totalLoadHistory, setTotalLoadHistory] = useState([]);

    // Periodic Heartbeat to ensure graph continuity
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTimestamp = formatTimeIST(new Date());
            const { load, generation } = latestTotalsRef.current;

            // Only add if we have some history (don't start from empty if no data loaded yet)
            // Or if we want to show 0 line, that's fine too.

            const lastPoint = totalLoadHistoryRef.current[totalLoadHistoryRef.current.length - 1];

            // Avoid duplicate timestamps if update happened recently
            if (lastPoint && lastPoint.time === currentTimestamp) return;

            const newLoadPoint = {
                time: currentTimestamp,
                load: load,
                generation: generation
            };

            const newHistory = [...totalLoadHistoryRef.current, newLoadPoint];
            if (newHistory.length > MAX_HISTORY_POINTS) {
                totalLoadHistoryRef.current = newHistory.slice(newHistory.length - MAX_HISTORY_POINTS);
            } else {
                totalLoadHistoryRef.current = newHistory;
            }
            setTotalLoadHistory([...totalLoadHistoryRef.current]);
        }, 1000); // 1-second Realtime Update

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const assetsRef = ref(db, 'assets');

        const unsubscribe = onValue(assetsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert to array
                const assetsArray = Array.isArray(data)
                    ? data
                    : Object.keys(data).map(key => ({ ...data[key], firebaseId: key }));

                const processedAssets = assetsArray.map(asset => {
                    let { id, val, status, category, type, range } = asset;

                    // Ensure val is a number
                    // Ensure val is a number
                    let numVal = typeof val === 'number' ? val : parseFloat(val);
                    if (isNaN(numVal)) numVal = 0;

                    // --- Flow Type Inference (Signed Integer Model) ---
                    // Positive = Producer, Negative = Consumer
                    let finalFlowType = asset.flowType;

                    if (!finalFlowType) {
                        if (numVal < 0) finalFlowType = 'consumer';
                        else if (numVal > 0) finalFlowType = 'producer';
                        else finalFlowType = 'consumer'; // Default for 0
                    }

                    // Keep numVal SIGNED for internal logic and KPI Stats
                    // Only use Math.abs() for Incident checks and specific display components
                    const absVal = Math.abs(numVal);


                    // --- Incident Logic with Range ---
                    let incidents = [];

                    // ON/OFF State determined STRICTLY by status
                    const isOnline = status !== 'offline';

                    if (range && isOnline) {
                        const { min, max, minMsg, maxMsg } = range;
                        if (absVal > max) {
                            status = 'critical';
                            const msg = maxMsg || `Value ${absVal} exceeds max ${max}`;
                            incidents.push(msg);
                        } else if (absVal < min) {
                            status = 'warning';
                            const msg = minMsg || `Value ${absVal} below min ${min}`;
                            incidents.push(msg);
                        } else {
                            if (status === 'warning' || status === 'critical') status = 'normal';
                        }
                    }

                    // ... History Logic ...
                    const prevValue = lastValuesRef.current[id]?.val;
                    const prevStatus = lastValuesRef.current[id]?.status;
                    const isFirstRun = lastValuesRef.current[id] === undefined;

                    let timestamp = lastUpdatedMapRef.current[id];

                    if (numVal !== prevValue || status !== prevStatus) {
                        if (!isFirstRun) {
                            timestamp = formatTimeIST(new Date());
                            lastUpdatedMapRef.current[id] = timestamp;

                            if (!historyMapRef.current[id]) historyMapRef.current[id] = [];
                            // Store POSITIVE value for graph
                            const newPoint = { time: timestamp, value: numVal, originalVal: numVal };

                            const currentHistory = historyMapRef.current[id];
                            const newHistory = [...currentHistory, newPoint];
                            historyMapRef.current[id] = newHistory.length > MAX_HISTORY_POINTS
                                ? newHistory.slice(newHistory.length - MAX_HISTORY_POINTS)
                                : newHistory;
                        }
                        lastValuesRef.current[id] = { val: numVal, status: status };
                    }

                    return {
                        ...asset,
                        val: numVal,
                        status,
                        incidents,
                        flowType: finalFlowType,
                        range,
                        lastUpdated: timestamp,
                        history: historyMapRef.current[id] || []
                    };
                });

                // --- Energy Aggregation ---
                let totalConsumption = 0;
                let totalGeneration = 0;

                processedAssets.forEach(asset => {
                    // We only aggregate ENERGY category assets for the main KPI
                    // AND strictly ignore Offline assets (Ghost Load fix)
                    const isOnline = asset.status !== 'offline';

                    if (asset.category?.toLowerCase() === 'energy' && isOnline) {
                        const absVal = Math.abs(asset.val);
                        // Use explicit flowType if available, otherwise fallback to sign
                        if (asset.flowType === 'producer') {
                            totalGeneration += absVal;
                        } else if (asset.flowType === 'consumer') {
                            totalConsumption += absVal;
                        } else {
                            // Fallback: Positive = Generation, Negative = Consumption
                            if (asset.val > 0) totalGeneration += asset.val;
                            else totalConsumption += absVal;
                        }
                    }
                });

                // Update latest totals for heartbeat
                latestTotalsRef.current = {
                    load: totalConsumption,
                    generation: totalGeneration
                };

                // Update Total Load History (Event-based)
                const currentTimestamp = formatTimeIST(new Date());
                const newLoadPoint = {
                    time: currentTimestamp,
                    load: totalConsumption,
                    generation: totalGeneration
                };

                const lastPoint = totalLoadHistoryRef.current[totalLoadHistoryRef.current.length - 1];

                if (totalLoadHistoryRef.current.length === 0 ||
                    (lastPoint && lastPoint.time !== currentTimestamp) ||
                    (lastPoint && lastPoint.load !== totalConsumption)) {

                    const newHistory = [...totalLoadHistoryRef.current, newLoadPoint];
                    if (newHistory.length > MAX_HISTORY_POINTS) {
                        totalLoadHistoryRef.current = newHistory.slice(newHistory.length - MAX_HISTORY_POINTS);
                    } else {
                        totalLoadHistoryRef.current = newHistory;
                    }
                    setTotalLoadHistory(totalLoadHistoryRef.current);
                }

                setAssets(processedAssets);
            } else {
                setAssets([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase fetch error:", error);
            setError(error);
            setAssets([]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    // --- Categories Logic ---
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const categoriesRef = ref(db, 'categories');
        const unsubscribe = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // If list, check if we need to migrate/add new defaults
                let currentCats = Array.isArray(data) ? data : Object.values(data);

                // Ensure required categories exist
                const requiredCats = ['energy', 'water', 'controls', 'agriculture', 'health', 'mobility', 'assistive_tech'];
                const missingCats = requiredCats.filter(c => !currentCats.includes(c));

                if (missingCats.length > 0) {
                    console.log("Migrating categories... Adding:", missingCats);
                    const updatedCats = [...currentCats, ...missingCats];
                    update(ref(db), { categories: updatedCats });
                    // Local state will update via user subscription callback
                } else {
                    setCategories(currentCats);
                }
            } else {
                // Initialize if empty
                console.log("Initializing categories...");
                const defaultCats = ['energy', 'water', 'controls', 'agriculture', 'health', 'mobility', 'assistive_tech'];
                update(ref(db), { categories: defaultCats });
                setCategories(defaultCats);
            }
        });
        return () => unsubscribe();
    }, []);

    const addCategory = async (newCat) => {
        const cat = newCat.toLowerCase().trim();
        if (!cat || categories.includes(cat)) return;

        const newCategories = [...categories, cat];
        await update(ref(db), { categories: newCategories });
    };

    return (
        <AssetsContext.Provider value={{ assets, loading, error, updateAsset, deleteAsset, totalLoadHistory, categories, addCategory }}>
            {children}
        </AssetsContext.Provider>
    );
};
