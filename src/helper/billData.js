import { openDB } from 'idb';

const DB_NAME = 'BillData';
const STORE_NAME = 'Bills';

async function initializeDB() {
    const db = await openDB(DB_NAME, 2, {
        upgrade(db) {
            const store = db.createObjectStore(STORE_NAME, {
                autoIncrement: true,
            });
        },
    });
    return db;
}

async function saveBillToDB(bill) {
    try {
        const db = await initializeDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        await store.add(bill);

        await tx.done;
        return true
    } catch (error) {
        console.error('Error saving bill data:', error);
    }
}


async function getAllBillsFromDB() {
    const db = await initializeDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const bills = await store.getAll();
    await tx.done;
    return bills;
}
export { saveBillToDB,getAllBillsFromDB}