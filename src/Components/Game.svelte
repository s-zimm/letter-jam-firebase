<script>
    import { room, playerName, roomCodeState } from '../store';
    import { db } from '../firebase.js';
    
    import FlexContainer from './FlexContainer.svelte';
    import Card from './Card.svelte';
    import Button from './Button.svelte';
    import Loader from './Loader.svelte';
    import MainGame from './MainGame.svelte';
    import SecretWordChoice from './SecretWordChoice.svelte';

    $: allPlayersLockedIn = !$room.players.find(player => !player.chosenSecretWord);
</script>

{#if $room.players[0].initialCards && !allPlayersLockedIn}
    <SecretWordChoice />
{:else if allPlayersLockedIn}
    <MainGame />
{:else}
    <FlexContainer width="100%" justify="center" align="center">
        <Loader />
    </FlexContainer>
{/if}