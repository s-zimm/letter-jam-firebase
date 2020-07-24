<script>
	import { room, playerName, roomCodeState } from '../store';
    import { db } from '../firebase.js';
    import Loader from './Loader.svelte';
    import FlexContainer from './FlexContainer.svelte';
    import Card from './Card.svelte';
    import Button from './Button.svelte';
	import ClueToken from './ClueToken.svelte';
	import LetterSelect from './LetterSelect.svelte'

    let letterObjects = [];
	let selectedIndexes = [];
	let currentPlayerCards = [];
    let maxWordLength = false;
	let confirmSuggestion;
	let movingOn = false;
	let currentLetterGuess = "";

    const handleCardClick = (letter, i, player) => {
        if (letterObjects.length === 8) {
            maxWordLength = true;
            return;
        }
		letterObjects = [ ...letterObjects, { player, letter, index: i }];
        selectedIndexes = [ ...selectedIndexes, i ];
    }

    const resetSuggestedWord = () => {
        maxWordLength = false;
        letterObjects = [];
        selectedIndexes = [];
        confirmSuggestion = false;
    }

    const handleSuggest = () => {
		if (letterObjects.length === 0) return;
        confirmSuggestion = true;
    }

    const handleConfirmSuggestion = async () => {
        confirmSuggestion = false;
        const roomRef = db.collection('rooms').doc($roomCodeState);
        let updatedCluesLeft = [ ...$room.cluesLeft ];
        const updatedPlayers = $room.players.map(player => {
            if (player.name !== $playerName) {
                return player;
            }
            const clueColor = $room.cluesConfig.requiredPerPlayer > player.clues.length ? "red" : "green";
            const index = updatedCluesLeft.indexOf(clueColor);
            updatedCluesLeft.splice(index, 1);
			const updatedClues = [ ...player.clues, clueColor ];
			return { ...player, clues: updatedClues }
        })
        roomRef.update({ 
			players: updatedPlayers,
			cluesLeft: updatedCluesLeft,
			currentClue: letterObjects
		});
		letterObjects = [];
	}

	const handleCancelGuess = () => {
		currentLetterGuess = "";
		movingOn = false;
	}

	const submitGuess = () => {
		const updatedPlayers = $room.players.map(player => {
            if (player.name !== $playerName) {
                return player;
			}

			return {
				...player,
				guessedLetters: player.guessedLetters
					? [ ...player.guessedLetters, currentLetterGuess ]
					: [ currentLetterGuess ]
			}
		});

		db.collection('rooms').doc($roomCodeState).update({
			players: updatedPlayers
		});
		currentLetterGuess = "";
		movingOn = false;
	}

	const buildCurrentPlayerCardsList = (player) => {
		for (var i = 0; i < 5; i++) {
			if (player.guessedLetters && player.guessedLetters[i]) {
				currentPlayerCards = [ ...currentPlayerCards, player.guessedLetters[i] ]
			} else {
				currentPlayerCards = [ ...currentPlayerCards, "" ]
			}
		}
	}
</script>

<style>
    .player-cards-container {
        margin: 0 20px;
    }

    .full-word-container {
        width: 100%;
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .single-letter {
        font-size: 80px;
        text-decoration: underline;
        margin: 0 8px;
    }

    .letters {
        display: flex;
        justify-content: center;
    }
</style>

{#if $room.gamePhase !== 'main'}
    <Loader />
{:else}
    <FlexContainer width="100%" height="100%" direction="column">
        <FlexContainer width="100%" height="5%" justify="center">
            {#each $room.cluesLeft as clueColor}
                <ClueToken color={clueColor} size="15px"/>
            {/each}
        </FlexContainer>
        <FlexContainer width="100%" height="25%">
            <div class="full-word-container">
                <div class="letters">
                    {#each letterObjects as { letter, player, index }, i}
                        <div class="single-letter">{letter}</div>
                        <div>{i + 1}</div>
                    {/each}
                </div>
                <FlexContainer direction="column" align="center" width="320px">
                    {#if maxWordLength}
                        <span style="color:red">Max word length!</span>
                    {:else if confirmSuggestion}
                        <span style="color:red">This will use one of your team's clues!</span>
                    {/if}
					<FlexContainer direction="column" justify="space-around">
						<FlexContainer justify="space-around">
							<Button on:click={resetSuggestedWord}>Reset word</Button>
							{#if !confirmSuggestion}
								<Button on:click={handleSuggest}>Suggest word</Button>
							{:else}
								<Button on:click={handleConfirmSuggestion}><span style="color:red">Are you sure?</span></Button>
							{/if}
						</FlexContainer>
						<FlexContainer justify="center" align="center" direction="column">					
							{#if movingOn}
								{#if currentLetterGuess}
									<Button on:click={submitGuess}>Confirm</Button>
								{:else}
									<Button on:click={handleCancelGuess}>Cancel</Button>
								{/if}
							{:else}
								<Button on:click={() => movingOn = true}>Move On</Button>
							{/if}
							{#if movingOn}
								<LetterSelect on:change={({ detail }) => currentLetterGuess = detail}/>
							{/if}
						</FlexContainer>
					</FlexContainer>
                </FlexContainer>
            </div>
        </FlexContainer>
        <FlexContainer width="100%" height="65%" justify="center" align="center" wrap="wrap">
            {#each $room.players as player}
                <div class="player-cards-container">
                    <FlexContainer align="center">
                        <h3>{player.name}{player.name === $playerName ? " (Me)" : ""}</h3>
                        {#if player.clues > 0}
                            {#each player.clues as clueColor}
                                <ClueToken color="{clueColor}" />
                            {/each}
                        {/if}
                    </FlexContainer>
                    <FlexContainer width="100%" justify="center" wrap="wrap">
						{#if player.name !== $playerName}
							{#each player.secretWord.letters as letter, i}
								{#if i === player.currentVisibleIndex}
									<Card
										selected={letterObjects.find(obj => obj.index === i && obj.player === player.name)}
										{letter}
										on:click={(event) => handleCardClick(event.detail, i, player.name)}
									/>
								{:else}
									<Card />
								{/if}
							{/each}
						{:else}
							{#each Array(5) as _, i}
								<Card letter={player.guessedLetters && player.guessedLetters[i] ? player.guessedLetters[i] : ""} subdued={true} />
							{/each}
						{/if}
                    </FlexContainer>
                </div>
            {/each}
            <div style="margin:5px 0">
                <FlexContainer wrap="wrap" justify="space-around" align="center">
                    <FlexContainer direction="column" width="13%" justify="center" align="center">
                        <h3>Wild</h3>
                        <Card letter="*" on:click={(event) => handleCardClick(event.detail, '*', '*')}/>
                    </FlexContainer>
                    {#each Object.values($room.nonPlayerStands) as npc, i}
                        <FlexContainer direction="column" width="13%" justify="center" align="center">
                            <h3 style="text-align:center">{npc.length} left</h3>
                            <Card 
								selected={letterObjects.find(obj => obj.index === i && obj.player === 'NPC')}
								letter={npc[0]}
								on:click={(event) => handleCardClick(event.detail, i, 'NPC')}
							/>
                        </FlexContainer>
                    {/each}
                </FlexContainer>
            </div>
        </FlexContainer>
    </FlexContainer>
{/if}