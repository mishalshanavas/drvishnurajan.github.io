
import { db } from './src/firebase.config.js';
import { ref, update } from 'firebase/database';

const updates = {};
updates['assets/C-01/category'] = 'energy';
updates['assets/C-02/category'] = 'energy';

update(ref(db), updates)
    .then(() => {
        console.log("Successfully patched C-01 and C-02 to category: energy");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Failed to patch assets:", err);
        process.exit(1);
    });
