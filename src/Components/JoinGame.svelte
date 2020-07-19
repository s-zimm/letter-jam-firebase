<script>
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import { navigate } from 'svelte-routing';
    import { playerName, roomCodeState } from '../store';
    import { db, arrayUnion } from '../firebase.js';
    import { onMount } from 'svelte';

    let name = '';
    let userExists = false;
    export let roomCode;

    onMount(() => roomCodeState.set(roomCode))

    const joinRoom = async () => {
        const roomRef = db.collection('rooms').doc(roomCode);
        const room = await roomRef.get();
        name = name.trim();
        const usernameExists = room.data().players.find(player => player.name === name);
        if (usernameExists) {
            userExists = true;
            return;
        }

        playerName.update(n => name);
        roomRef.update({
            players: arrayUnion({ name })
        });
        navigate(`/room/${roomCode}`);
    }
</script>

<FlexContainer align="center" justify="center" direction="column" height="100%">
    <input bind:value={name} placeholder="Enter name">
    {#if userExists}
        <span style="color:red">A user with this name already exists</span>
    {/if}
    <Button on:click={joinRoom}>Join Room</Button>
    
</FlexContainer>