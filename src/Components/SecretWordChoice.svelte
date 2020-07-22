<script>
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import Card from './Card.svelte';
    import { playerName, roomCodeState, room } from '../store';
    import { db } from '../firebase.js';

     const handleCardClick = (letter, i) => {
        if (maxLengthReached || selectedIndexes.includes(i)) {
            return;
        } 
        word += letter;
        selectedIndexes = [ ...selectedIndexes, i ];
    }

    const resetWord = () => {
        word = '';
        selectedIndexes = [];
    }

    const lockInWord = async () => {
        const dbRoomRef = db.collection('rooms').doc($roomCodeState);
        const theRoom = await dbRoomRef.get();
        const updatedPlayers = theRoom.data().players.map(player => 
            player.name === $playerName ? ({ ...player, chosenSecretWord: { word, letters: word.split("") } }) : ({ ...player }));
        dbRoomRef.update({ players: updatedPlayers });
        lockedIn = true;
    }

    let word = '';
    let maxLength = 5;
    let lockedIn = false;
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

<FlexContainer direction="column" justify="center">
    <div class="full-word-container">
        <div class="letters">
            {#each word as singleLetter}
                <div class="single-letter">{singleLetter}</div>
            {/each}
        </div>
        {#if maxLengthReached}
            <span style="color:red">Max word length reached</span>
        {/if}
        <FlexContainer justify="space-around" width="320px">
            <Button on:click={resetWord} disabled={lockedIn}>Reset word</Button>
            <Button on:click={lockInWord} disabled={!maxLengthReached || lockedIn}>Lock in</Button>
        </FlexContainer>
    </div>
    <div class="cards-container">
        {#each $room.players[0].initialCards as letter, i}
            <Card
                selected={selectedIndexes.includes(i)}
                {letter}
                disabled={maxLengthReached || lockedIn}
                on:click={(event) => handleCardClick(event.detail, i)}
            />
        {/each}
    </div>
</FlexContainer>
