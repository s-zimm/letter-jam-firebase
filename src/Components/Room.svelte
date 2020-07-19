<script>
    import WaitingRoom from './WaitingRoom.svelte';
    import FlexContainer from './FlexContainer.svelte';
    import JoinGame from './JoinGame.svelte';
    import Game from './Game.svelte'

    import { room, playerName } from '../store';
    import { db } from '../firebase.js';

    export let roomCode;
    db.collection('rooms')
        .doc(roomCode)
        .onSnapshot(doc => {
            room.update(r => doc.data());
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