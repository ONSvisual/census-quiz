<script>
  import { format } from "../utils";
  import Slider from "./Slider.svelte";
  import Tooltip from "./Tooltip.svelte";

  export let answers;
  export let qNum;
  export let data;
  export let place;

	let w;
	let w_guess;
	let w_actual;

	$: dp = (answers[qNum].formatVal ? answers[qNum].formatVal : 0) + (answers[qNum].shiftVal ? answers[qNum].shiftVal : 0);
  $: f = answers[qNum].format;
  $: unit = answers[qNum].unit ? answers[qNum].unit : "";
  $: legendUnit = answers[qNum].legendUnit ? unit : "";
	$: x_guess = ((answers[qNum].val - answers[qNum].min) /
		(answers[qNum].max - answers[qNum].min)) *
		w;
  $: x_actual = ((answers[qNum].ans - answers[qNum].min) /
		(answers[qNum].max - answers[qNum].min)) *
		w;
  $: scale = (val) => ((val - answers[qNum].min)/(answers[qNum].max - answers[qNum].min)) * 100;
  // console.log("answers log");
  // console.log(x_actual);

</script>

<div class="range-container" bind:clientWidth={w}>
	{#if !answers[qNum].set}
    <Tooltip x={((answers[qNum].val - answers[qNum].min) /
		(answers[qNum].max - answers[qNum].min)) * w} 
      y={-7} width={w} xPad={-7} title="{f(answers[qNum].val)}{unit}" pos="top" bgcolor="#206095"/>
      {#if answers[qNum].customMarker || answers[qNum].customMarker === 0 }
        <div class="range-tick mid-line" style:left="{scale(answers[qNum].customMarker)}%">
          <span>{f(answers[qNum].customMarker)}</span>
        </div>
      {/if}
	{:else}

  <div class="range-ans" style:left="{scale(answers[qNum].ansMin)}%" style:right="{100 - scale(answers[qNum].ansMax)}%">
  </div>

  <div class="range-tick avg-line" style="left: {scale(answers[qNum].avg)}%">
    <div style:padding-left="{(w * (scale(answers[qNum].avg) / 100)) < 28 ? 28 - (w * (scale(answers[qNum].avg) / 100)) : 0}px">
      {#if answers[qNum].countryOnly}{answers[qNum].countryOnly}{:else}England and Wales{/if} {f(answers[qNum].avg)}{unit}
    </div>
  </div>
  
	<Tooltip x={x_guess} y={-7} width={w} xPad={-7} bgcolor={answers[qNum].correct ? "#0F8243" : '#D0021B'} title="Your guess {f(answers[qNum].val)}{unit}" bind:w={w_guess} pos="top"/>
	<Tooltip x={x_actual} y={Math.abs(x_actual - x_guess) < ((w_guess + w_actual) / 2) + 20 ? -40 : -7} bgcolor="#206095" width={w} xPad={-7} title="Answer {f(data.find(d => d.code == place.code)[answers[qNum].key])}{unit}" bind:w={w_actual} pos="top"/>
    {/if}
    <div class="range-tick range-tick-left" style:left="0">
      {f(answers[qNum].min)}{legendUnit}
    </div>
    <div class="range-tick range-tick-right" style:left="100%">
      {f(answers[qNum].max)}{legendUnit}
    </div>

    
    <Slider
      bind:value={answers[qNum].val}
      min={answers[qNum].min}
      max={answers[qNum].max}
      {data}
      selected={place.code}
      valueKey={answers[qNum].key}
      disabled={answers[qNum].set}
      unit={unit}
      format={f}
      {dp}
    />
  </div>

  <style>
    .range-container {
        position: relative;
        margin: 70px 0 70px 0;
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
        white-space: nowrap;
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

  .mid-line {
    /* make a little rectangle/line to show mid point */
    border-left: 1px solid  gray;
    height: 10px;
    /* color: red; */
    padding-right: 100px;
    font-size: small;
  }

  .mid-line > span { 
    /* make the average text in the middle */
    position: relative;
    right: 50%;
  }

  .range-ans {
    /* green "correct" area */
    position: absolute;
    background-color: green;
    opacity: 0.2;
    height: 21px;
    top: -8px;
  
  }
  </style>