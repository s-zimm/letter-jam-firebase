import { writable } from 'svelte/store';
import { db } from '../firebase';
import { get } from 'svelte/store';

export const room = writable({});

if (get(room).roomCode) {
    db.collection('rooms').where('roomCode', "==", room.roomCode)
        .onSnapshot(querySnapshot)
}