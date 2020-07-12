<style></style>

<script>
    import { room, isRoomCreator } from '../store';
    import { get } from 'svelte/store';
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../firebase.js';

    export let roomCode;

const startGame = () => {
    db.collection('rooms').doc(roomCode).update({ gameStarted: true })
}

</script>

<FlexContainer justify="center", align="center" direction="column">
    <h2>{roomCode}</h2>
    <ol>
        {#each $room.players as player}
            <li>{player.name}</li>
        {/each}
    </ol>
    {#if $isRoomCreator}
        <Button on:click={startGame}>Start Game</Button>
    {/if}
</FlexContainer>