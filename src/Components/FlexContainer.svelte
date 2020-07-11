<style>
    .flex-container {
        width: 100%;
        height: 100%;
        display: flex;
    }
</style>

<script>
    export let direction = "";
    export let align = "";
    export let justify = "";
</script>

<div class="flex-container" style="flex-direction:{direction};align-items:{align};justify-content:{justify}">
    <slot></slot>
</div>