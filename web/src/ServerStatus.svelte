<script>
  import { onMount } from "svelte";
  import Box from "./Box.svelte";
  import RefreshButton from "./RefreshButton.svelte";
  import ButtonBox from "./ButtonBox.svelte";
  import { capitalize } from "./utils.js";

  export let status = "unknown";
  let loading = true;

  const makeApiRequest = fn => async () => {
    loading = true;
    try {
      await fn();
      loading = false;
    } catch (error) {
      status = "error";
      loading = false;
      alert(error.message);
    }
  };

  const fetchStatus = makeApiRequest(async () => {
    const res = await fetch("https://api.mc.ianjsikes.com/status", {
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    status = json.status;
  });

  const startServer = makeApiRequest(async () => {
    const res = await fetch("https://api.mc.ianjsikes.com/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    status = json.status;
  });

  const stopServer = makeApiRequest(async () => {
    const res = await fetch("https://api.mc.ianjsikes.com/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    status = json.status;
  });

  onMount(fetchStatus);
</script>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .status-container {
    display: flex;
    flex-direction: column;
  }

  .status {
    font-size: 20px;
  }

  .status-label {
    font-size: 14px;
    color: "#008903";
    margin-bottom: -4px;
  }

  .server-action-text {
    font-size: 24px;
  }
</style>

<Box padding="0.5rem">
  <div class="container">
    <div class="status-container">
      <p class="status-label">Status:</p>
      <p class="status">{capitalize(status)}</p>
    </div>
    <RefreshButton size={25} on:click={fetchStatus} {loading} />
  </div>
</Box>

{#if status === 'running'}
  <ButtonBox padding="0.2rem" on:click={stopServer} disabled={loading}>
    {#if loading}
      <RefreshButton size={25} loading={true} />
    {:else}
      <p class="server-action-text">Stop</p>
    {/if}
  </ButtonBox>
{:else if status === 'stopped'}
  <ButtonBox padding="0.2rem" on:click={startServer} disabled={loading}>
    {#if loading}
      <RefreshButton size={25} loading={true} />
    {:else}
      <p class="server-action-text">Start</p>
    {/if}
  </ButtonBox>
{/if}
