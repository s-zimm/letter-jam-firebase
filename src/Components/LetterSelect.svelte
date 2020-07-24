<script>
    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();
    let handleChange = (event) => {
        dispatch('change', event.target.value);
    }
</script>

<style>
    .letters-select {
        width: 50px;
    }
</style>

<label for="letter-select">Choose a letter:</label>
<select name="letters" id="letter-select" class="letters-select" on:change={handleChange}>
    <option value="">--</option>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="D">D</option>
    <option value="E">E</option>
    <option value="F">F</option>
    <option value="G">G</option>
    <option value="H">H</option>
    <option value="I">I</option>
    <option value="K">K</option>
    <option value="L">L</option>
    <option value="M">M</option>
    <option value="N">N</option>
    <option value="O">O</option>
    <option value="P">P</option>
    <option value="R">R</option>
    <option value="S">S</option>
    <option value="T">T</option>
    <option value="U">U</option>
    <option value="W">W</option>
    <option value="Y">Y</option>
</select>