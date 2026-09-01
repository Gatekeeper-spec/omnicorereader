//#region node_modules/.nitro/vite/services/ssr/assets/idb-DCH0hIyx.js
var DB_NAME = "omni-files";
var STORE = "files";
function openDb() {
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
async function saveLocalFile(bookId, file, name, type) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore(STORE).put({
			name,
			type,
			blob: file,
			updatedAt: Date.now()
		}, bookId);
	});
	db.close();
}
async function getLocalFile(bookId) {
	const db = await openDb();
	const value = await new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(bookId);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error);
	});
	db.close();
	return value;
}
async function deleteLocalFile(bookId) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore(STORE).delete(bookId);
	});
	db.close();
}
//#endregion
export { getLocalFile as n, saveLocalFile as r, deleteLocalFile as t };
