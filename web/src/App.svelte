<script>
  import Box from "./Box.svelte";
  import ServerStatus from "./ServerStatus.svelte";

  // Color palette: http://www.colorbox.io/#steps=4#hue_start=96#hue_end=150#hue_curve=easeInQuad#sat_start=8#sat_end=90#sat_curve=easeOutQuad#sat_rate=130#lum_start=98#lum_end=40#lum_curve=easeInOutSine#minor_steps_map=0
  /**
			{
				"0": "#EAFAE0",
				"5": "#AAE989",
				"10": "#6AD73C",
				"20": "#008903",
				"30": "#006633"
			}
	 */

  let status;
</script>

<style>
  :global(body) {
    background-color: #aae989;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  :global(p, h1, h2, h3, li) {
    margin: 4px;
    color: #006633;
  }
  :global(button) {
    color: #006633;
    background-color: transparent;
    border: 0px;
    margin: 0px;
  }
  :global(button:active) {
    background-color: transparent;
  }

  h1 {
    font-family: "Squada One";
    font-size: 48px;
  }

  .address-label {
    font-weight: bold;
  }

  p {
    margin-bottom: 32px;
  }
</style>

<h1>Ian's Minecraft Server</h1>
<p>
  <span class="address-label">Address:</span>
  <span class="address">ftb.mc.ianjsikes.com</span>
</p>
<ServerStatus bind:status />
<a href="https://hackmd.io/@ianjsikes/HJswpywvr">
  How to setup modded Minecraft
</a>
