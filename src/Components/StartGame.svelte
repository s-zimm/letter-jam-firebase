<script>
    import FlexContainer from './FlexContainer.svelte';
    import Button from './Button.svelte';
    import { onMount } from 'svelte';
    import { db } from '../firebase.js';
    import { room } from '../store';
    import { get } from 'svelte/store';

    let name = '';

    function generateNewRoom() {
        db.collection('rooms').add({
            players: [{ name }]
        }).then(docRef => {
            room.update(current => ({...current, roomCode: docRef.id}));
        })
    }
</script>

<FlexContainer align="center" justify="center" direction="column">
    <input bind:value={name} placeholder="Enter name">
    <Button on:click={generateNewRoom}>Generate Room</Button>
    
</FlexContainer>