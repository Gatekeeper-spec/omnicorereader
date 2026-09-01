const DB_NAME = "omni-files";
const STORE = "files";

export type StoredFile = {
  name: string;
  type: string;
  blob: Blob;
  updatedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalFile(bookId: string, file: File | Blob, name: string, type: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).put({ name, type, blob: file, updatedAt: Date.now() } satisfies StoredFile, bookId);
  });
  db.close();
}

export async function getLocalFile(bookId: string): Promise<StoredFile | null> {
  const db = await openDb();
  const value = await new Promise<StoredFile | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(bookId);
    req.onsuccess = () => resolve((req.result as StoredFile | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return value;
}

export async function deleteLocalFile(bookId: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.objectStore(STORE).delete(bookId);
  });
  db.close();
}
