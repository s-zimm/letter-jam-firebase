<style>
    div.navbar {
        width: 100%;
        height: 9%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 8px rgb(165, 165, 165);

    }

    .logo {
        width: 10%;
    }
</style>

<script>
    import { Link } from 'svelte-routing';
    import Button from './Button.svelte';
    import FlexContainer from './FlexContainer.svelte';

    const navItems = [
        { name: 'Start Game', route: 'game/start' },
        { name: 'Join Game', route: 'game/join' }
    ]

</script>

<div class="navbar">
    <div class="logo">LOGO</div>
    <FlexContainer justify="space-around" width="380px">
        {#each navItems as item}
            <Link to={item.route}>
                <Button>{item.name}</Button>
            </Link>
        {/each}
    </FlexContainer>
</div>