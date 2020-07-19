<script>
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import { db } from '../firebase.js';
    import { room, playerName, isRoomCreator, roomCodeState } from '../store';
    import { navigate } from "svelte-routing";

    let name = '';

    function generateNewRoom() {
        db.collection('rooms').add({
            players: [{ name }],
            gameStarted: false
        }).then(docRef => {
            const roomCode = docRef.id;
            room.update(current => ({ roomCode, players: [{ name }], gameStarted: false }));
            playerName.set(name);
            isRoomCreator.set(true);
            roomCodeState.set(roomCode);
            navigate(`/room/${roomCode}`);
        })
    }
</script>

<FlexContainer align="center" justify="center" direction="column" height="100%">
    <input bind:value={name} placeholder="Enter name">
    <Button on:click={generateNewRoom}>Generate Room</Button>
    
</FlexContainer>