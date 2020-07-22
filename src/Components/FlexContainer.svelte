<style>
    .flex-container {
        width: 100%;
        display: flex;
    }
</style>

<script>
    export let direction = "";
    export let align = "";
    export let justify = "";
    export let width = "100%";
    export let height = "";
    export let wrap = "";
</script>

<div 
    class="flex-container"
    style="flex-direction:{direction};align-items:{align};justify-content:{justify};width:{width};height:{height};flex-wrap:{wrap}">
    <slot></slot>
</div>