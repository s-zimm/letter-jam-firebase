<script>
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import { navigate } from 'svelte-routing';
    import { playerName } from '../store';
    import { db, arrayUnion } from '../firebase.js';

    let name = '';
    export let roomCode;

    const joinRoom = () => {
        playerName.update(n => name);
        db.collection('rooms').doc(roomCode).update({
            players: arrayUnion({ name })
        });
        navigate(`/room/${roomCode}`);
    }
</script>

<FlexContainer align="center" justify="center" direction="column">
    <input bind:value={name} placeholder="Enter name">
    <Button on:click={joinRoom}>Join Room</Button>
    
</FlexContainer>