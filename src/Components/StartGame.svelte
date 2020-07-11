<script>
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import { db } from '../firebase.js';
    import { room, playerName } from '../store';
    import { navigate } from "svelte-routing";

    let name = '';

    function generateNewRoom() {
        db.collection('rooms').add({
            players: [{ name }],
            gameStarted: false 
        }).then(docRef => {
            const roomCode = docRef.id;
            room.update(current => ({ roomCode, players: [{ name }], gameStarted: false }));
            playerName.update(n => name);
            navigate(`/room/${roomCode}`);
        })
    }
</script>

<FlexContainer align="center" justify="center" direction="column">
    <input bind:value={name} placeholder="Enter name">
    <Button on:click={generateNewRoom}>Generate Room</Button>
    
</FlexContainer>