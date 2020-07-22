<script>
    import WaitingRoom from './WaitingRoom.svelte';
    import FlexContainer from './FlexContainer.svelte';
    import JoinGame from './JoinGame.svelte';
    import Game from './Game.svelte'
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';

    import { room, playerName, isRoomCreator } from '../store';
    import { db } from '../firebase.js';

    export let roomCode;

    onMount(async () => {
        if (roomCode && !get(playerName)) {
            const playerInfo = JSON.parse(localStorage.getItem(`LETTER_JAM_ROOM:${roomCode}`));
            playerName.set(playerInfo.name);
            isRoomCreator.set(playerInfo.isRoomCreator);
            const roomRef = db.collection('rooms').doc(roomCode);
            const theRoom = await roomRef.get();
            room.set(theRoom.data());
        }
    })

    db.collection('rooms')
        .doc(roomCode)
        .onSnapshot(doc => {
            room.update(r => doc.data());
            if (roomCode && get(playerName)) {
                const playerInfo = {
                    name: get(playerName),
                    isRoomCreator: get(isRoomCreator)
                }
                localStorage.setItem(`LETTER_JAM_ROOM:${roomCode}`, JSON.stringify(playerInfo));
            }
        });
    
</script>

<FlexContainer>
    {#if $room.gameStarted}
        <Game />
    {:else if !$playerName}
        <JoinGame {roomCode} />
    {:else}
        <WaitingRoom {roomCode} />
    {/if}
</FlexContainer>