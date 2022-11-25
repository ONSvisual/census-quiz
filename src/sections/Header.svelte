<script>
  import tooltip from "../ui/tooltip.js";
  import Progress from "../ui/Progress.svelte";
  import Icon from "../ui/Icon.svelte";

  export let place = null;
  export let numberOfQuestions;
  export let qNum;
  export let screen;
  
  let fullscreen = false;

  function toggleFullscreen() {
		if (!fullscreen) {
			document.body.requestFullscreen();
			fullscreen = true;
		} else {
			document.exitFullscreen();
			fullscreen = false;
		}
	}
</script>

<header>
  {#if screen === "start"}
  <div/>
  {:else}
  <h2 class="text-lrg">
    How well do you know {place ? place.name : 'your area'}?
  </h2>
  {/if}
  <nav>
    <button
      title="Full screen mode"
      on:click={toggleFullscreen}
      use:tooltip
      ><Icon type={fullscreen ? "full_exit" : "full"} /></button
    >
  </nav>
</header>
{#if screen !== "start"}
<div id="breadcrumb">
  <Progress count={numberOfQuestions} bind:step={qNum}/>
</div>
{/if}