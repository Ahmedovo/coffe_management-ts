export class IndexedDBDatabase {
    private static DB_NAME = "CoffeeShopDB";
    private static DB_VERSION = 1;
    private static STORE_ORDERS = "orders";
    
    private db: IDBDatabase | null = null;

    public async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(IndexedDBDatabase.DB_NAME, IndexedDBDatabase.DB_VERSION);

            request.onerror = () => {
                reject(new Error("Failed to open database"));
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(IndexedDBDatabase.STORE_ORDERS)) {
                    db.createObjectStore(IndexedDBDatabase.STORE_ORDERS, { keyPath: "id" });
                }
            };
        });
    }

    public getOrdersStore(mode: IDBTransactionMode = "readonly"): IDBObjectStore {
        if (!this.db) {
            throw new Error("Database not initialized");
        }

        const transaction = this.db.transaction(IndexedDBDatabase.STORE_ORDERS, mode);
        return transaction.objectStore(IndexedDBDatabase.STORE_ORDERS);
    }
}