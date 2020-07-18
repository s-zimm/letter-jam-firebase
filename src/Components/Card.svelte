<style>
    .card {
        border: solid #9e9e9e 1px;
        width: 120px;
        height: 140px;
        border-radius: 5px;
        box-shadow: 1px 1px 3px #bfbfbf, -1px 1px 3px #bfbfbf;
        transition: ease .2s all;
        background-color: white;
    }

    .card:hover {
        box-shadow: 1px 2px 7px #bfbfbf, -1px 2px 7px #bfbfbf;
        transform: translateY(-3px)
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
</style>

<script>
    export let letter;
</script>

<div class="card" on:click>
    <div class="top-letter">{letter}</div>
    <div class="main-letter">
        {letter}
    </div>
</div>