<style>
    .button {
        width: 100px;
        height: 25px;
        padding: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgb(148, 148, 148);
        transition: all .2s;
        cursor: pointer;
    }

    .button:hover {
        box-shadow: 0 2px 8px rgb(148, 148, 148);
    }

    .default {
        background-color: gray;
        color: rgba(240, 248, 255, 0.856);
    }

    .default:hover {
        background-color: rgb(94, 94, 94);
        color: aliceblue;
    }
</style>

<script>
    export let type;
    export let text;

</script>

<div class="button {type ? type : 'default'}">{text}</div>