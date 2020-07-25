<script>
    import WaitingRoom from './WaitingRoom.svelte';
    import FlexContainer from './FlexContainer.svelte';
    import JoinGame from './JoinGame.svelte';
    import Game from './Game.svelte'
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    import { room, playerName, isRoomCreator } from '../store';
    import { db } from '../firebase.js';

    export let roomCode;

    onMount(async () => {
        const roomRef = db.collection('rooms').doc(roomCode);
        const theRoom = await roomRef.get();
        if (theRoom.exists) {
            room.set(theRoom.data());
            if (!$playerName) {
                const playerInfo = JSON.parse(localStorage.getItem(`LETTER_JAM_ROOM`));
                playerName.set(playerInfo.name);
                isRoomCreator.set(playerInfo.isRoomCreator);
            }
        } else {
            navigate('/not-found');
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
                localStorage.setItem(`LETTER_JAM_ROOM`, JSON.stringify(playerInfo));
            }
        });
    
</script>

<FlexContainer>
    {#if $room && $room.gameStarted}
        <Game />
    {:else if !$playerName}
        <JoinGame {roomCode} />
    {:else}
        <WaitingRoom {roomCode} />
    {/if}
</FlexContainer>