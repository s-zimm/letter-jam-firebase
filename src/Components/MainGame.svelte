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
		let updatedShuffledDeck = [ ...$room.shuffledDeck ];
        const updatedPlayers = $room.players.map(player => {
            if (player.name !== $playerName) {
                return player;
            }
            const clueColor = $room.cluesConfig.requiredPerPlayer > player.clues.length ? "red" : "green";
            const index = updatedCluesLeft.indexOf(clueColor);
            updatedCluesLeft.splice(index, 1);
			const updatedClues = [ ...player.clues, clueColor ];
			return { ...player, clues: updatedClues }
		});

		const cluesGivenFromNpcStands = [];
		const chosenNpcStandIndexes = letterObjects
										.filter(letter => letter.player === 'NPC')
										.map(letterObj => letterObj.index);
		const updatedNpcStands = {
			...$room.nonPlayerStands
		};
		chosenNpcStandIndexes.forEach(index => {
			if (updatedNpcStands[index][0] !== 'END') {
				// Checking for length === 2 because the last item is "END" to note empty stack.
				// New letters will be appended after "END" item.
				if (updatedNpcStands[index].length === 2) {
					cluesGivenFromNpcStands.push("green");
					updatedNpcStands[index].push(updatedShuffledDeck.shift());
				} 
				updatedNpcStands[index].shift();
			} else {
				updatedNpcStands[index].pop();
				updatedNpcStands[index].push(updatedShuffledDeck.shift());
			}
		});

		const playerToVisibleIndex = $room.players.reduce((acc, player) => 
			({ ...acc, [player.name]: player.currentVisibleIndex}), {});
		const letterObjsWithPlayerIndexes = {
			playerToVisibleIndex,
			letterObjects
		}
		const wordLog = $room.wordLog
			? { ...$room.wordLog, [Object.keys($room.wordLog).length]: letterObjsWithPlayerIndexes }
			: { 0: letterObjsWithPlayerIndexes }
		
        roomRef.update({ 
			players: updatedPlayers,
			cluesLeft: updatedCluesLeft.concat(cluesGivenFromNpcStands),
			currentClue: letterObjects,
			nonPlayerStands: updatedNpcStands,
			shuffledDeck: updatedShuffledDeck,
			wordLog
		});
		letterObjects = [];
	}

	const handleCancelGuess = () => {
		currentLetterGuess = "";
		movingOn = false;
	}

	const submitGuess = () => {
		let permanentBonusLetters = $room.permanentBonusLetters
			? [ ...$room.permanentBonusLetters ]
			: [];
		let updatedDeck = [ ...$room.shuffledDeck ];
		const updatedPlayers = $room.players.map(player => {
            if (player.name !== $playerName) {
                return player;
			}

			let updatedPlayer;
			if (player.guessedLetters && player.guessedLetters.length >= 4) {
				if (player.extraLetter) {
					player.extraLetter === currentLetterGuess
						? permanentBonusLetters.push(currentLetterGuess)
						: null
				}
				updatedPlayer = {
					...player,
					extraLetter: updatedDeck.pop()
				};
				if (player.guessedLetters.length === 4) {
					updatedPlayer.guessedLetters = [ ...player.guessedLetters, currentLetterGuess ];
				}
				
			} else {
				updatedPlayer = {
					...player,
					currentVisibleIndex: player.currentVisibleIndex + 1,
					guessedLetters: player.guessedLetters
						? [ ...player.guessedLetters, currentLetterGuess ]
						: [ currentLetterGuess ]
				};
			}

			return updatedPlayer
		});

		const roomUpdate = {
			players: updatedPlayers,
			shuffledDeck: updatedDeck
		}

		if (permanentBonusLetters.length > 0) {
			roomUpdate.permanentBonusLetters = permanentBonusLetters;
		}

		db.collection('rooms').doc($roomCodeState).update(roomUpdate);
		currentLetterGuess = "";
		movingOn = false;
	}

	const isEndNpcStack = (npc) => npc[0] === 'END';

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

	.alphabet-list {
		color: #afafaf;
		margin: 5px;
	}
</style>

{#if $room.gamePhase !== 'main'}
    <Loader />
{:else}
    <FlexContainer width="100%" height="100%" direction="column">
		<FlexContainer width="100%" height="5%" justify="center">
            <span class="alphabet-list">
				A B C D E F G H I K L M N O P R S T U W Y
			</span>
        </FlexContainer>
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
						<div style="margin-top:10px">
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
						</div>
					</FlexContainer>
                </FlexContainer>
            </div>
        </FlexContainer>
        <FlexContainer width="100%" height="65%" justify="center" align="center" wrap="wrap">
			{#if $room.permanentBonusLetters}
				<div class="player-cards-container">
					<h3>PERMANENT BONUS LETTERS</h3>
					<FlexContainer width="100%" justify="center" wrap="wrap">
						{#each $room.permanentBonusLetters as letter}
							<Card {letter} on:click={(event) => handleCardClick(event.detail, 'BONUS', 'BONUS')}/>
						{/each}
					</FlexContainer>
				</div>
			{/if}
            {#each $room.players as player}
                <div class="player-cards-container">
                    <FlexContainer align="center">
                        <h3>{player.name}{player.name === $playerName ? " (Me)" : ""}</h3>
                        {#if player.clues.length > 0}
                            {#each player.clues as clueColor}
                                <ClueToken color="{clueColor}" />
                            {/each}
                        {/if}
                    </FlexContainer>
                    <FlexContainer width="100%" justify="center" wrap="wrap">
						{#if player.name !== $playerName}
							{#each player.secretWord.letters as letter, i}
								{#if !player.extraLetter && i === player.currentVisibleIndex}
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
						{#if player.extraLetter}
							<Card letter={player.name === $playerName ? "" : player.extraLetter} on:click={(event) => handleCardClick(event.detail, 'EXTRA', player.name)}/>
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
                            <h3 style="text-align:center">{isEndNpcStack(npc) ? 'Done!' : `${npc.length - 1} left`}</h3>
                            <Card 
								selected={letterObjects.find(obj => obj.index === i && obj.player === 'NPC')}
								letter={!isEndNpcStack(npc) ? npc[0] : npc[1]}
								on:click={(event) => handleCardClick(event.detail, i, 'NPC')}
							/>
                        </FlexContainer>
                    {/each}
                </FlexContainer>
            </div>
        </FlexContainer>
    </FlexContainer>
{/if}