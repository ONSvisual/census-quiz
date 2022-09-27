<script>
	export let count = 10;
	export let step = 1;
	export let color = "#00A3A6";
	export let background = "#999";
</script>

<div class="progress" style:--color={color} style:--background={background}>
	<div class="progress-track">
		<div class="progress-bar" style:width="{(step / (count - 1)) * 100}%"/>
		{#each Array.from(Array(count).keys()) as i}
		<div class="progress-point" class:done={i <= step} style:left="{(i / (count - 1)) * 100}%" on:click={() => step = i} title="Question {i + 1}"/>
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
		background-color: var(--background, lightgrey);
	}
	.progress-bar {
		position: absolute;
		height: 100%;
		background-color: var(--color, #00A3A6);
	}
	.progress-point {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: var(--background, lightgrey);
		transform: translate(-5px,-3px);
	}
	.progress-point.done {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background-color: var(--color, #00A3A6);
		transform: translate(-7px,-5px);
	}
</style>