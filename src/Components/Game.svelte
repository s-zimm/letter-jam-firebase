<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .full-word-container {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .letters {
        display: flex;
        justify-content: center;
    }

    .single-letter {
        font-size: 80px;
        text-decoration: underline;
        margin: 0 8px;
    }

    .cards-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>

<script>
    import { room, playerName } from '../store';
    
    import FlexContainer from './FlexContainer.svelte';
    import Card from './Card.svelte';
    import Button from './Button.svelte';

    const handleCardClick = (letter) => {
        word += letter;
    }

    const resetWord = () => {
        word = '';
    }

    let word = '';
</script>

<div class="container">
    <div class="full-word-container">
        <div class="letters">
            {#each word as singleLetter}
                <div class="single-letter">{singleLetter}</div>
            {/each}
        </div>
        <Button on:click={resetWord}>Reset word</Button>
    </div>
    <div class="cards-container">
        {#if $room.players[0].initialCards}
            {#each $room.players[0].initialCards as letter}
                <Card {letter} on:click={() => handleCardClick(letter)}/>
            {/each}
        {/if}
    </div>
</div>