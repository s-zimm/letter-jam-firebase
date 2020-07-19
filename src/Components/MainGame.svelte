<script>
    import { room, playerName } from '../store';
    import Loader from './Loader.svelte';
</script>

{#if $room.gamePhase !== 'main'}
    <Loader />
{:else}
    THA GAME
{/if}