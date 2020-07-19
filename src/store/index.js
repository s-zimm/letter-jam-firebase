import { writable } from 'svelte/store';

export const room = writable({
    players: []
});
export const roomCodeState = writable(null);
export const playerName = writable(null);
export const isRoomCreator = writable(false);
