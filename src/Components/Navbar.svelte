<style>
    div.navbar {
        width: 100%;
        height: 9%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 8px rgb(165, 165, 165);

    }

    img {
        max-width: 100%;
        max-height: 70%;
    }
</style>

<script>
    import { Link, navigate } from 'svelte-routing';
    import Button from './Button.svelte';
    import FlexContainer from './FlexContainer.svelte';
    import { room, playerName } from '../store';

    const navItems = [
        { name: 'Start Game', route: 'game/start' },
        { name: 'Join Game', route: 'game/join' }
    ]

</script>

<div class="navbar">
    <FlexContainer justify="center" align="center" width="10%" height="100%">
        <img on:click={() => navigate('/')} src="/images/bluebnstrawb.png" alt="Logo" />
    </FlexContainer>
    {#if !$room.gameStarted}
        <FlexContainer justify="space-around" width="380px">
            {#each navItems as item}
                <Link to={item.route}>
                    <Button>{item.name}</Button>
                </Link>
            {/each}
        </FlexContainer>
    {:else if $room.currentClue}
        <FlexContainer width="90%" height="100%" justify="center" align="center">
            {#each $room.currentClue as { letter, player }}
                <span style="margin:5px">{player === $playerName ? '?' : letter}</span>
            {/each}       
        </FlexContainer>
    {/if}
</div>