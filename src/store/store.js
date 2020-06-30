import { writable } from 'svelte/store';

export const $players = writable([]);
export const $username = writable('Guest');