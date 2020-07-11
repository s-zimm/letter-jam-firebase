<style></style>

<script>
    import { room } from '../store';
    import { get } from 'svelte/store';
    import FlexContainer from './FlexContainer.svelte';
    import { onMount } from 'svelte';

    export let roomCode;


    onMount(() => console.log('Room state: ', $room))
</script>

<FlexContainer justify="center", align="center" direction="column">
    <h2>{roomCode}</h2>
    <ol>
        {#each $room.players as player}
            <li>{player.name}</li>
        {/each}
    </ol>
</FlexContainer>