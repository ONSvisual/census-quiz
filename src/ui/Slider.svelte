<script>
  import { createEventDispatcher } from "svelte";
	import tooltip from './tooltip.js';
	
  import Thumb from "./Thumb.svelte";
  const dispatch = createEventDispatcher();
	
  export let range = false;
  export let min = 0;
  export let max = 100;
  export let format = d => d;
  export let dp = null;
  export let step = null;
  export let value = 50;
  export let order = false;
	
	export let disabled = false;
	export let showBar = false;
	export let data = null;
	export let selected = null;
	export let valueKey = "value";
	export let labelKey = "name";
	export let idKey = "code";
	export let unit = "";
	
  let pos;
  let active = false;
  let focus = false;
	
  $: _step = step ? step : dp != undefined && dp != null ? Math.pow(10, -dp) : 1;
  $: if (active) setValue(pos);
  $: if (!active) setPos(value);
  $: if (range && order && active) pos = checkPos(pos);
  $: min, max, clamp();
  $: progress = `
    left: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    right: ${100 - Math.max(pos[0], (range ? pos[1] : pos[0])) * 100}%;
  `;
  function setValue(pos) {
    const offset = min % _step;
    const width = max - min
    let newvalue = pos
      .map(v => min + v * width)
      .map(v => Math.round((v - offset) / _step) * _step + offset);
		value = Array.isArray(value) ? newvalue : newvalue[0];
    dispatch("input", value);
  }
  function setPos(value) {
    pos = Array.isArray(value) ?
			value
      .map(v => Math.min(Math.max(v, min), max))
      .map(v => (v - min) / (max - min)) :
		[(value - min) / (max - min), 0];
  }
  function checkPos(pos) {
    return [Math.min(...pos), Math.max(...pos)];
  }
  function clamp() {
    setPos(value);
    setValue(pos);
  }
  
</script>

<div class="track">
	{#if showBar}
  <div
    class="progress"
    style={progress} />
	{/if}
	{#if disabled && Array.isArray(data)}
	{#each data as d}
	<div class="point" title="{d[labelKey]} {format(d[valueKey])}{unit}" use:tooltip data-tooltip-pos="bottom" data-tooltip-bgcolor="gray" style:left="{(100 * (d[valueKey] - min)) / (max - min)}%"/>
	{/each}
	<div class="point guess" data-tooltip-pos="top" style:left="{pos[0] * 100}%"/>
	{#if selected}
	{#each [data.find(d => d[idKey] == selected)] as d}
	<div class="point selected" data-tooltip-pos="top" style:left="{(100 * (d[valueKey] - min)) / (max - min)}%"/>
	{/each}
	{/if}
	{/if}
	{#if !disabled}
  <Thumb bind:pos={pos[0]} on:active={({ detail: v }) => active = v}>
    <slot name="left">
      <slot>
        <div class="thumb" class:focus/>
      </slot>
    </slot>
  </Thumb>
  {#if range}
    <Thumb bind:pos={pos[1]} on:active={({ detail: v }) => active = v}>
      <slot name="right">
        <slot>
          <div class="thumb" class:focus/>
        </slot>
      </slot>
    </Thumb>
  {/if}
	{/if}
</div>
<input type="range" class="visuallyhidden" 
  on:focus={() => focus = true}
  on:blur={() => focus = false}
  bind:value={value}
  {min} {max} step={_step}
  {disabled}/>

<style>
  /* input {
    display: none;
  } */
  .track {
    margin: 16px 0;
    position: relative;
    height: 4px;
    width: 100%;
    border-radius: 100vh;
    background: var(--track-bg, #ebebeb);
  }
  .progress {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 100vh;
    background: var(--progress-bg, #8abdff);
  }
	.point {
		position: absolute;
		top: 50%;
		height: 8px;
		width: 8px;
		background-color: rgba(168,168,168,0.5);
		border-radius: 50%;
		transform: translate(-50%,-50%);
	}


	.selected {
		background-color: #206095;
		height: 12px;
		width: 12px;
	}
	.guess {
		background-color: var(--thumb-bg, #206095);
		height: 12px;
		width: 12px;
	}
	.point:hover {
		background-color: red;
	}
  .thumb {
    width: 16px;
    height: 16px;
    border-radius: 100vh;
    background: var(--thumb-bg, #5784fd);
  }
  .thumb:hover {
    background: #153c5c;
    transition: .2s background;
    -webkit-transition: .2s background;
    -moz-transition: .2s background;
  }

  .thumb:focus {
		outline: 3px solid orange;
	}
  .focus {
		outline: 3px solid orange;
	}
</style>