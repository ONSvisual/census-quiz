<script>
	export let title;
</script>

<div class="tooltip-body">
  {title}
  <div class="tooltip-caret caret-bottom"></div>
</div>

<style>
	.tooltip-body {
    z-index: 100;
		background: var(--bgcolor, #333);
		color: white;
		border-radius: 2px;
		padding: 4px;
		position: absolute;
    left: 50%;
    top: 100%;
		transform: translate(-50%,6px);
		font-size: 0.85em;
		white-space: nowrap;
		pointer-events: none;
	}
	.tooltip-caret {
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
		border-color: transparent transparent var(--bgcolor, #333) transparent;
	}
</style>