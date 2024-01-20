import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export function persistable<T>(key: string, value: T): Writable<T> {
    if (!browser) {
        return writable(value);
    }

    const inStore = window.localStorage.getItem(key);
    let initialValue = value;

    if (inStore) {
        initialValue = JSON.parse(inStore) as T;
    }
    const persist = writable<T>(initialValue);
    persist.subscribe((value) => {
        localStorage.setItem(key, JSON.stringify(value));
    });
    return persist;
}