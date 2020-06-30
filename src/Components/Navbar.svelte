<style>
    div.navbar {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 8px rgb(165, 165, 165);

    }

    .logo {
        width: 10%;
    }

    .nav-items {
        width: 35%;
        display: flex;
        justify-content: space-around;
    }
</style>

<script>
    const navItems = [
        { name: 'Start Game', route: '/game/start' },
        { name: 'Join Game', route: '/game/join' }
    ]

    import Button from './Button.svelte';
</script>

<div class="navbar">
    <div class="logo">LOGO</div>
    <div class="nav-items">
        {#each navItems as item}
            <Button text={item.name}/>
        {/each}
    </div>
</div>