<script>
  export let padding = "0.5rem";
  export let disabled = false;
</script>

<style>
  .box {
    border: 2px solid #006633;
    border-radius: 4px;
    margin: 16px;
    margin-top: 0px;
    box-shadow: #006633 1px 1px 0px, #006633 3px 3px 0px, #006633 5px 5px 0px;
  }
  .box:active {
    box-shadow: none;
    transform: translate(5px, 5px);
  }
</style>

<button class="box" on:click {disabled} style="padding: {padding};">
  <slot />
</button>
