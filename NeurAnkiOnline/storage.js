import { freshProfile } from './study.js';
let database;
export async function openStorage() {
  database = await new Promise((resolve,reject) => {
    const request = indexedDB.open('neuranki-study', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('profile');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close other NeurAnki tabs and reload.'));
  });
  database.onversionchange = () => database.close();
  return mutateProfile(p=>p);
}
export function mutateProfile(update) {
  return new Promise((resolve,reject) => {
    const tx = database.transaction('profile','readwrite');
    const store = tx.objectStore('profile');
    const request = store.get('current'); let result, failure;
    request.onsuccess = () => {
      try {
        const profile = request.result || freshProfile();
        result = update(profile) || profile;
        result.revision = (profile.revision || 0) + 1;
        store.put(result,'current');
      } catch (error) { failure=error; tx.abort(); }
    };
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(failure || tx.error || new Error('Progress could not be saved.'));
    tx.onabort = () => reject(failure || tx.error || new Error('Progress could not be saved.'));
  });
}
export function readProfile() {
  return new Promise((resolve,reject) => {
    const request = database.transaction('profile').objectStore('profile').get('current');
    request.onsuccess = () => resolve(request.result || freshProfile());
    request.onerror = () => reject(request.error);
  });
}
