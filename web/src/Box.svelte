<script>
  export let title;
  export let padding = "0.5rem";
</script>

<style>
  .box {
    border: 2px solid #006633;
    border-radius: 4px;
    box-shadow: #006633 1px 1px 0px, #006633 3px 3px 0px, #006633 5px 5px 0px,
      #006633 7px 7px 0px, #006633 9px 9px 0px;
    margin: 16px;
    margin-top: 0px;
  }
  .title {
    color: #006633;
    margin-bottom: 2px;
    margin-left: 16px;
  }
</style>

<div>
  {#if title}
    <p class="title">{title}</p>
  {/if}
  <div class="box" style="padding: {padding};">
    <slot />
  </div>
</div>
