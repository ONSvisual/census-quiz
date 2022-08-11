<script>
    import { format } from "../utils";
    import Slider from "./Slider.svelte";
	import Tooltip from "./Tooltip.svelte";

    export let answers;
    export let questions;
    export let qNum;
    export let data;
    export let place;

	let w;
	let w_guess;
	let w_actual;

	$: dp = questions[qNum].formatVal ? questions[qNum].formatVal : 0;
    $: f = format(dp);
	$: x_guess = ((answers[qNum].val - answers[qNum].min) /
		(answers[qNum].max - answers[qNum].min)) *
		w;
	$: x_actual = ((data.find(d => d.code == place.code)[questions[qNum].key] - answers[qNum].min) /
		(answers[qNum].max - answers[qNum].min)) *
		w;
</script>

<div class="range-container" bind:clientWidth={w}>
	{#if !answers[qNum].set}
    <Tooltip x={((answers[qNum].val - answers[qNum].min) /
		(answers[qNum].max - answers[qNum].min)) *
		w} y={-7} width={w} xPad={-7} title="{f(answers[qNum].val)}{questions[qNum]
		.unit}" pos="top"/>
	{:else}
	<Tooltip x={x_guess} y={-7} width={w} xPad={-7} title="Your guess {f(answers[qNum].val)}{questions[qNum]
		.unit}" bind:w={w_guess} pos="top"/>
	<Tooltip x={x_actual} y={Math.abs(x_actual - x_guess) < ((w_guess + w_actual) / 2) + 20 ? -40 : -7} width={w} xPad={-7} title="Actual {f(answers[qNum].avg)}{questions[qNum]
		.unit}" bind:w={w_actual} pos="top"/>
    {/if}
    <div class="range-tick range-tick-left" style="left: 0">
      {f(answers[qNum].min)}
    </div>
    <div class="range-tick range-tick-right" style="left: 100%">
      {f(answers[qNum].max)}
    </div>
    <div class="range-tick avg-line" style="left: {((answers[qNum].avg - answers[qNum].min)/(answers[qNum].max - answers[qNum].min)) * 100}%">
        Average {f(answers[qNum].avg)}
    </div>
    
    <Slider
      bind:value={answers[qNum].val}
      min={answers[qNum].min}
      max={answers[qNum].max}
      {data}
      selected={place.code}
      valueKey={questions[qNum].key}
      disabled={answers[qNum].set}
      unit={questions[qNum].unit}
      format={f}
      {dp}
    />
  </div>

  <style>
    .range-container {
        position: relative;
        margin: 70px 0 50px 0;
        --thumb-bg: #206095;
    }
    .range-value {
        position: absolute;
        top: -40px;
        transform: translateX(-50%);
    }
    .range-tick {
        position: absolute;
        top: 7px;
        height: 25px;
        color: grey;
        font-size: 0.85em;
        line-height: 35px;
    }
    .range-tick-left {
        border-left: 1px solid grey;
        padding-left: 4px;
    }
    .range-tick-right {
        border-right: 1px solid grey;
        padding-right: 4px;
        transform: translateX(-100%);
    }

  .avg-line {
    /* make a little rectangle/line to show average */
    border-left: 1px solid  gray;
    height: 10px;
    /* color: red; */
    /* padding-right: 100px; */
    font-size: small;
  }
  </style>