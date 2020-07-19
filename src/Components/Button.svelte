<style>
    .button {
        width: 100px;
        height: 25px;
        padding: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgb(148, 148, 148);
        transition: all .2s;
        cursor: pointer;
    }

    .button:hover:not(.disabled) {
        box-shadow: 0 2px 8px rgb(148, 148, 148);
    }

    .default {
        background-color: rgba(131, 191, 237, 0.824);
        color: rgba(255, 255, 255, 0.856);
    }

    .default:hover:not(.disabled) {
        background-color: rgb(131, 191, 237);
        color: rgb(255, 255, 255);
    }

    .disabled {
        cursor: default;
        background-color: gray;
    }
</style>

<script>
    export let type;
    export let disabled = false;

</script>

<div on:click class:disabled class="button {type ? type : 'default'}"><slot></slot></div>