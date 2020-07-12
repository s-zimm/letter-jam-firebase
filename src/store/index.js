import { writable } from 'svelte/store';

export const room = writable({
    players: []
});
export const playerName = writable(null);
export const isRoomCreator = writable(false);
