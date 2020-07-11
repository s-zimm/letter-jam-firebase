<script>
    import WaitingRoom from './WaitingRoom.svelte';
    import FlexContainer from './FlexContainer.svelte';
    import JoinGame from './JoinGame.svelte';

    export let roomCode;
    import { room, playerName } from '../store';
    import { db } from '../firebase.js';

    db.collection('rooms')
        .doc(roomCode)
        .onSnapshot(doc => {
            room.update(r => doc.data());
        });
    
</script>

<FlexContainer>
    {#if $room.gameStarted}
        Game Started!!!
    {:else if !$playerName}
        <JoinGame {roomCode} />
    {:else}
        <WaitingRoom {roomCode} />
    {/if}
</FlexContainer>