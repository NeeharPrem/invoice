import { openDB } from 'idb';

const DB_NAME = 'BillData';
const STORE_NAME = 'Bills';

async function initializeDB() {
    try {
        const db = await openDB(DB_NAME, 2, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { autoIncrement: true });
                }
            },
        });
        return db;
    } catch (error) {
        console.error('Error initializing the database:', error);
        throw new Error('Failed to initialize IndexedDB');
    }
}

async function saveBillToDB(bill) {
    try {
        const db = await initializeDB();
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            throw new Error(`Object store "${STORE_NAME}" not found`);
        }

        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        await store.add(bill);
        await tx.done;

        console.log('Bill saved successfully');
        return true;
    } catch (error) {
        console.error('Error saving bill data:', error);
        return false;
    }
}

async function getAllBillsFromDB() {
    try {
        const db = await initializeDB();
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            throw new Error(`Object store "${STORE_NAME}" not found`);
        }

        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);

        const bills = await store.getAll();
        await tx.done;

        return bills;
    } catch (error) {
        console.error('Error retrieving bills from database:', error);
        return [];
    }
}

export { saveBillToDB, getAllBillsFromDB };