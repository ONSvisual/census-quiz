<script>
    import { format } from "./utils";
    import Slider from "./Slider.svelte";

    export let answers;
    export let questions;
    export let questionNum;
    export let data;
    export let place;

    $: f = questions[questionNum].formatVal ? format(questions[questionNum].formatVal) : format(0);
</script>

<div class="range-container">
    {#if !answers[questionNum].set}
      <output
        class="range-value"
        style="left: {((answers[questionNum].val - answers[questionNum].min) /
          (answers[questionNum].max - answers[questionNum].min)) *
          100}%"
        >{f(answers[questionNum].val)}{questions[questionNum]
          .unit}</output
      >
    {/if}
    <div class="range-tick range-tick-left" style="left: 0">
      {f(answers[questionNum].min)}
    </div>
    <div class="range-tick range-tick-right" style="left: 100%">
      {f(answers[questionNum].max)}
    </div>
    <div class="range-tick avg-line" style="left: {((answers[questionNum].avg - answers[questionNum].min)/(answers[questionNum].max - answers[questionNum].min)) * 100}%">
        Average {f(answers[questionNum].avg)}
    </div>
    
    <Slider
      bind:value={answers[questionNum].val}
      min={answers[questionNum].min}
      max={answers[questionNum].max}
      {data}
      selected={place.code}
      valueKey={questions[questionNum].key}
      disabled={answers[questionNum].set}
      unit={questions[questionNum].unit}
      format={f}
      dp={questions[questionNum].formatVal}
    />
  </div>

  <style>
    .range-container {
        position: relative;
        margin: 70px 20px 50px 20px;
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