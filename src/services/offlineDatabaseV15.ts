import { SmartOperationsState } from '../types';

const DB_NAME = 'smart-poultry-v15';
const DB_VERSION = 1;
const STATE_STORE = 'state';
const QUEUE_STORE = 'sync_queue';
const MEDIA_STORE = 'media_blobs';
const CONFLICT_STORE = 'conflicts';

export interface OfflineQueueItemV15 {
  id: string;
  created_at: string;
  entity_type: string;
  entity_id?: string;
  action: 'create' | 'update' | 'delete' | 'upload_media';
  payload: unknown;
  attempts: number;
  status: 'pending' | 'syncing' | 'failed';
  last_error?: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported on this device'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STATE_STORE)) db.createObjectStore(STATE_STORE, { keyPath: 'key' });
      if (!db.objectStoreNames.contains(QUEUE_STORE)) db.createObjectStore(QUEUE_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(MEDIA_STORE)) db.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(CONFLICT_STORE)) db.createObjectStore(CONFLICT_STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Unable to open IndexedDB'));
  });
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
  });
}

export const offlineDatabaseV15 = {
  async saveSmartOperations(state: SmartOperationsState) {
    const db = await openDb();
    const tx = db.transaction(STATE_STORE, 'readwrite');
    tx.objectStore(STATE_STORE).put({ key: 'smartOperations', value: state, updated_at: new Date().toISOString() });
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async loadSmartOperations(): Promise<SmartOperationsState | null> {
    const db = await openDb();
    const tx = db.transaction(STATE_STORE, 'readonly');
    const record = await requestToPromise<any>(tx.objectStore(STATE_STORE).get('smartOperations'));
    db.close();
    return record?.value || null;
  },

  async enqueue(item: Omit<OfflineQueueItemV15, 'id' | 'created_at' | 'attempts' | 'status'>) {
    const db = await openDb();
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    const queued: OfflineQueueItemV15 = {
      ...item,
      id: `queue-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
      attempts: 0,
      status: 'pending'
    };
    tx.objectStore(QUEUE_STORE).put(queued);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return queued;
  },


  async enqueueLatestState(state: SmartOperationsState) {
    const db = await openDb();
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    const store = tx.objectStore(QUEUE_STORE);
    const all = await requestToPromise<any[]>(store.getAll());
    for (const item of all || []) {
      if (item.entity_type === 'smart_operations' && item.status === 'pending') store.delete(item.id);
    }
    store.put({ id: 'queue-smart-operations-latest', created_at: new Date().toISOString(), entity_type: 'smart_operations', entity_id: 'singleton', action: 'update', payload: state, attempts: 0, status: 'pending' });
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); });
    db.close();
  },

  async listQueue(): Promise<OfflineQueueItemV15[]> {
    const db = await openDb();
    const tx = db.transaction(QUEUE_STORE, 'readonly');
    const items = await requestToPromise<any[]>(tx.objectStore(QUEUE_STORE).getAll());
    db.close();
    return (items || []).sort((a, b) => a.created_at.localeCompare(b.created_at));
  },

  async removeQueueItem(id: string) {
    const db = await openDb();
    const tx = db.transaction(QUEUE_STORE, 'readwrite');
    tx.objectStore(QUEUE_STORE).delete(id);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async cacheMedia(id: string, blob: Blob, metadata: Record<string, unknown> = {}) {
    const db = await openDb();
    const tx = db.transaction(MEDIA_STORE, 'readwrite');
    tx.objectStore(MEDIA_STORE).put({ id, blob, metadata, created_at: new Date().toISOString() });
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async getMedia(id: string): Promise<{ id: string; blob: Blob; metadata: Record<string, unknown> } | null> {
    const db = await openDb();
    const tx = db.transaction(MEDIA_STORE, 'readonly');
    const record = await requestToPromise<any>(tx.objectStore(MEDIA_STORE).get(id));
    db.close();
    return record || null;
  },

  async getStorageEstimate(): Promise<{ usage: number; quota: number }> {
    if (navigator.storage?.estimate) {
      const result = await navigator.storage.estimate();
      return { usage: result.usage || 0, quota: result.quota || 0 };
    }
    return { usage: 0, quota: 0 };
  }
};
