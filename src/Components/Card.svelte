<script>
    import { createEventDispatcher, beforeUpdate, afterUpdate } from 'svelte';
    const dispatch = createEventDispatcher();

    export let letter = "";
    export let disabled = false;
    export let selected = false;
    export let subdued = false;

    const handleClick = () => {
        dispatch('click', letter);
    }
</script>

<style>
    .card {
        border: solid #9e9e9e 1px;
        width: 100px;
        height: 110px;
        border-radius: 5px;
        box-shadow: 1px 1px 3px #bfbfbf, -1px 1px 3px #bfbfbf;
        transition: ease .2s all;
        background-color: white;
    }

    .enabled {
        cursor: pointer;
    }

    .enabled:hover {
        box-shadow: 1px 2px 7px #bfbfbf, -1px 2px 7px #bfbfbf;
        transform: translateY(-3px);
    }

    .selected {
        box-shadow: 1px 2px 7px #bfbfbf, -1px 2px 7px #bfbfbf;
        transform: translateY(-3px);
        border: solid red 2px;
    }

    .top-letter {
        display: flex;
        height: 20%;
        font-size: 20px;
    }

    .main-letter {
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 60px;
    }

    .subdued {
        color: rgb(131, 131, 131);
    }

    @media screen and (max-width: 600px) {
        .card {
            width: 60px;
            height: 70px;
        }

        .main-letter {
            font-size: 40px;
        }
    }
</style>

{#if !disabled}
    <div class="card enabled" class:subdued class:selected on:click={handleClick}>
        <div class="top-letter">{letter}</div>
        <div class="main-letter">
            {letter}
        </div>
    </div>
{:else}
    <div class="card disabled" class:subdued class:selected>
        <div class="top-letter">{letter}</div>
        <div class="main-letter">
            {letter}
        </div>
    </div>
{/if}
