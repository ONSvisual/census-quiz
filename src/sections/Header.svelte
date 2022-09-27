<script>
  import Progress from "../ui/Progress.svelte";

  export let place = null;
  export let numberOfQuestions;
  export let qNum;
</script>

<header>
  <h2 class="text-lrg">
    How well do you know {place ? place.name : 'your area'}?
  </h2>
  <!-- <nav>
    <button
      title="Full screen mode"
      on:click={toggleFullscreen}
      use:tooltip
      ><Icon type={fullscreen ? "full_exit" : "full"} /></button
    >
  </nav> -->
</header>
<div id="breadcrumb">
  <Progress count={numberOfQuestions} bind:step={qNum}/>
</div>