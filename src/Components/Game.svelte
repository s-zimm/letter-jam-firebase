<script>
    import { room, playerName } from '../store';
    
    import FlexContainer from './FlexContainer.svelte';
    import Card from './Card.svelte';
    import Button from './Button.svelte';
    import Loader from './Loader.svelte';

    const handleCardClick = (letter, i) => {
        if (maxLengthReached) {
            return;
        } 
        word += letter;
        selectedIndexes.push(i);
    }

    const resetWord = () => {
        word = '';
        selectedIndexes = [];
    }

    let word = '';
    let maxLength = 4;
    export let selectedIndexes = [];
    $: maxLengthReached = word.length === maxLength;
</script>

<style>

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

<FlexContainer direction="column" justify="center" align="center">
    {#if $room.players[0].initialCards}
        <div class="full-word-container">
            <div class="letters">
                {#each word as singleLetter}
                    <div class="single-letter">{singleLetter}</div>
                {/each}
            </div>
            {#if maxLengthReached}
                <span style="color:red">Max word length reached</span>
            {/if}
            <Button on:click={resetWord}>Reset word</Button>
        </div>
        <div class="cards-container">
            {#each $room.players[0].initialCards as letter, i}
                <Card {letter} disabled={maxLengthReached} on:click={(event) => handleCardClick(event.detail, i)} index={i} {selectedIndexes}/>
            {/each}
        </div>
    {:else}
        <Loader />
    {/if}
</FlexContainer>