<script>
    import { room, playerName } from '../store';
    import FlexContainer from './FlexContainer.svelte';

    export let hidden = false;
    export let top = "43px";
    export let left;
    export let bottom;
    export let right = "43px";
    let indexesUsed = [];

    const checkIndexUsed = (index) => {
        const indexUsed = indexesUsed.includes(index);
        indexUsed ? null : indexesUsed = [ ...indexesUsed, index];
        return indexUsed;
    }

    $: cluesByPlayerVisibleIndex = $room.wordLog 
        ? Object.values($room.wordLog).reduce((acc, word) => {
        const playerIndexAtThisWord = word.playerToVisibleIndex[$playerName];
        if (acc[playerIndexAtThisWord]) {
            acc[playerIndexAtThisWord].push(word.letterObjects);
        } else {
            acc[playerIndexAtThisWord] = [ word.letterObjects ];
        }
        return acc;
    }, [])
        : null
</script>

<style>
    .log-card {
        width: 120px;
        height: 250px;
        overflow: scroll;
        border-radius: 3px;
        border: solid black 1px;
        background-color: white;
        position: absolute;
        z-index: 1;
    }
</style>

<div class="log-card" style="top:{top};bottom:{bottom};left:{left};right:{right};display:{hidden ? 'none' : 'block'}">
    <div style="padding:8px">
        <FlexContainer width="100%" height="100%" direction="column">
            {#if $room.wordLog}
                {#each cluesByPlayerVisibleIndex as letterObjectLists, i}
                    <h5 style="margin:5px 0">Letter {i + 1}</h5>
                    {#each letterObjectLists as letterObjects}
                        <FlexContainer>
                            {#each letterObjects as { letter, index, player }}
                                    {#if player === $playerName}
                                        ?
                                    {:else}
                                        {letter}
                                    {/if}
                            {/each}
                        </FlexContainer>
                    {/each}
                {/each}
            {:else}
                No clues given yet!
            {/if}
        </FlexContainer>
    </div>
</div>