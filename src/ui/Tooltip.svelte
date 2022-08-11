<script>
	export let title;
	export let x;
	export let y;	
	export let width;
	export let pos = "bottom";
	export let xPad = 4;
	
	export let w;
	
	$: xPos = w && x + (w / 2) > width - xPad ? width - (w / 2) - xPad : w && x - (w / 2) < 0 + xPad ? (w / 2) + xPad : x;
</script>

<div class="tooltip" style:top="{y}px" style:left="{xPos}px" class:tooltip-top={pos == "top"} bind:clientWidth={w}>
  {title}
  <div class="caret" class:caret-bottom={pos == 'bottom'} class:caret-top={pos == 'top'} style:transform="translateX({x - xPos}px)"></div>
</div>

<style>
	.tooltip {
		background: #333;
		color: white;
		border-radius: 2px;
		padding: 4px;
		position: absolute;
		transform: translate(-50%,6px);
		font-size: 0.85em;
		white-space: nowrap;
		pointer-events: none;
	}
	.tooltip-top {
		transform: translate(-50%,calc(-100% - 5px));
	}
	.caret {
		content: " ";
		position: absolute;
		left: 50%;
		margin-left: -6px;
		border-width: 6px;
		border-style: solid;
		pointer-events: none;
	}
	.caret-bottom {
		bottom: calc(100% - 1px);
		border-color: transparent transparent #333 transparent;
	}
	.caret-top {
		top: calc(100% - 1px);
		border-color: #333 transparent transparent transparent;
	}
</style>