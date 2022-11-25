<script>
	export let count = 10;
	export let step = 1;
	export let color = "#99DADB";
	export let background = "#f8f8f8";
</script>

<div class="progress" style:--color={color} style:--background={background}>
  <div class="progress-track">
    <div class="progress-under">
      {#each Array.from(Array(count).keys()) as i}
      <div class="progress-point" style:left="{(i / (count - 1)) * 100}%" on:click={() => step = i} title="Question {i + 1}"/>
      {/each}
    </div>
		<div class="progress-bar" style:width="{(step / (count - 1)) * 100}%"/>
    {#each Array.from(Array(count).keys()).slice(0, step + 1) as i}
    <div class="progress-point done" style:left="{(i / (count - 1)) * 100}%" on:click={() => step = i} title="Question {i + 1}"/>
    {/each}
	</div>
</div>

<style>
	.progress {
		box-sizing: border-box;
		width: 100%;
		height: 14px;
		padding: 5px 7px;
	}
	.progress-track {
		position: relative;
		width: 100%;
		height: 4px;
	}
  .progress-under {
    position: absolute;
		height: 100%;
		width: 100%;
		background-color: var(--background, white);
    opacity: 0.7;
  }
	.progress-bar {
		position: absolute;
		height: 180%;
		background-color: var(--color,  #99DADB);
		transform: translateY(-20%);
	}
	.progress-point {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: var(--background, white);
		transform: translate(-5px,-3px);
	}
	.progress-point.done {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background-color: var(--color, #99DADB);
		transform: translate(-9px,-7px);
	}
</style>