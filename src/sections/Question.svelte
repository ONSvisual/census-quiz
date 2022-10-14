<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { adjectify, format, higherLower, parseInfo } from "../utils";
	import Icon from "../ui/Icon.svelte";
	import SliderWrapper from "../ui/SliderWrapper.svelte";
  import Reveal from "../ui/Reveal.svelte";
  
  const dispatch = createEventDispatcher();

  export let data;
  export let place;
  export let answers;
  export let qNum;
  export let score;

  let w; // Width of #game-container

	function guess(i, correct) {
		answers[i].correct = correct;
		answers[i].set = true;
		score += answers[i].correct ? 1 : 0;
	}

	function guessPercent(i) {

		let correct = answers[i].val >= answers[i].ansMin && answers[i].val <= answers[i].ansMax;

		guess(i, correct);
	}

	function guessHigherLowerAvg(i, hl) {
		let comparator = answers[i].comparator;
		let key = answers[i].key;

		let correct =
			(hl == "higher" && place[key] >= comparator[key]) ||
			(hl == "lower" && place[key] <= comparator[key]);

		answers[i].val = hl;
		guess(i, correct);
	}

  function guessHigherLowerCat(i, hl) {
		let correct =
			(hl == "higher" && answers[i].option.value >= answers[i].comparator.value) ||
			(hl == "lower" && answers[i].option.value <= answers[i].comparator.value);

		answers[i].val = hl;
		guess(i, correct);
	}

  function guessTrueFalseChange(i, tf) {
    let hl = answers[i].keyQualifier;
    let isTrue =
      hl == "higher" && answers[i].option.value >= 0 ||
      hl == "lower" && answers[i].option.value <= 0;

		let correct = (tf && isTrue) || (!tf && !isTrue);

		answers[i].val = tf;
		guess(i, correct);
	}

  function guessTrueFalseCat(i, tf) {
    let hl = answers[i].keyQualifier;
    let isTrue =
      hl == "higher" && answers[i].option.value >= answers[i].comparator.value ||
      hl == "lower" && answers[i].option.value <= answers[i].comparator.value;

		let correct = (tf && isTrue) || (!tf && !isTrue);

		answers[i].val = tf;
		guess(i, correct);
	}

	function guessSort(i) {
		let arr = answers[i].options;
		let key = answers[i].key;
		let sorted = [...arr].sort((a, b) => b[key] - a[key]);
		let check = arr.map((d, i) => d[key] == sorted[i][key]);

		console.log(arr, sorted, check);
		guess(i, !check.includes(false));
	}

  function guessMultiValue(i, option) {
    guess(i, option.code == place.code);
  }

  function guessMultiCat(i, option) {
    guess(i, option.key == answers[i].option.key);
  }

	function sortOptions(i, array_ind, change) {
		let arr = [...answers[i].options];
		let new_ind = array_ind + change;
		arr.splice(array_ind, 1);
		arr.splice(new_ind, 0, answers[i].options[array_ind]);
		answers[i].options = arr;
	}

  $: f = answers[qNum].format;
  $: unit = answers[qNum].unit ? answers[qNum].unit : "";
  $: legendUnit = answers[qNum].legendUnit ? unit : "";
</script>

<div id="game-container" bind:clientWidth={w} style:background-position="left {-(qNum * 60)}px bottom 0">
  {#key qNum}
  <section class="columns" style:position="absolute" style:width="100%" in:fly={{x: w, duration: 500}} out:fly={{x: -w, duration: 500}}>
    <div>
      <h2>
        <span class="text-lrg">
          Question {qNum + 1}
        </span>
      </h2>
      <p style:margin-top={0}>
        {parseInfo(data, answers[qNum].text
          .replace("{place}", place.name)
          .replace(
            "{comparator}",
            answers[qNum].comparator ? answers[qNum].comparator.name : ""
          ))}
      </p>
      <!-- this could probably be done a lot better - ask Ahmad -->

      {#if answers[qNum].type === "slider"}
        <SliderWrapper
          bind:answers
          {qNum}
          {data}
          {place}
        />

        {#if !answers[qNum].set}
          <button
            class="btn-primary"
            on:click={() => guessPercent(qNum)}
            >Submit</button
          >
        <!-- {:else}
          <p>
            The {answers[qNum].label} in {place.name} is
            <strong>{f(place[answers[qNum].key])}{unit}</strong>,
            which is {adjectify(place[answers[qNum].key + "_quintile"])}
            average compared with other local authorities.
          </p> -->
        {/if}
      {:else if answers[qNum].type === "higher_lower_avg"}
        <button
          class="btn-primary"
          on:click={() => guessHigherLowerAvg(qNum, "higher")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "higher" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "higher" && !answers[qNum].correct}>
          Higher
        </button>
        <button
          class="btn-primary"
          on:click={() => guessHigherLowerAvg(qNum, "lower")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "lower" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "lower" && !answers[qNum].correct}>
          Lower
        </button>

        <!-- {#if answers[qNum].set}
          <p>
            The {answers[qNum].label} in {place.name} was
            <strong>{place[answers[qNum].key]}{unit}</strong>, which was
            <strong>{higherLower(place[answers[qNum].key] - answers[qNum].comparator[answers[qNum].key])}</strong>
            than the average (median) of {answers[qNum].comparator[answers[qNum].key]}{unit}
            across all local authorities.
          </p>
        {/if} -->

        {:else if answers[qNum].type === "higher_lower_cat"}
        <button
          class="btn-primary"
          on:click={() => guessHigherLowerCat(qNum, "higher")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "higher" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "higher" && !answers[qNum].correct}>
          Higher
        </button>
        <button
          class="btn-primary"
          on:click={() => guessHigherLowerCat(qNum, "lower")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "lower" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "lower" && !answers[qNum].correct}>
          Lower
        </button>

      {:else if answers[qNum].type === "higher_lower_cat"}
        <button
          class="btn-primary"
          on:click={() => guessHigherLowerCat(qNum, "higher")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "higher" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "higher" && !answers[qNum].correct}>
          Higher
        </button>
        <button
          class="btn-primary"
          on:click={() => guessHigherLowerCat(qNum, "lower")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "lower" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "lower" && !answers[qNum].correct}>
          Lower
        </button>
      
      {:else if answers[qNum].type === "true_false_change"}
        <button
          class="btn-primary"
          on:click={() => guessTrueFalseChange(qNum, true)}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == true && answers[qNum].correct}
          class:incorrect={answers[qNum].val == true && !answers[qNum].correct}>
          True
        </button>
        <button
          class="btn-primary"
          on:click={() => guessTrueFalseChange(qNum, false)}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == false && answers[qNum].correct}
          class:incorrect={answers[qNum].val == false && !answers[qNum].correct}>
          False
        </button>
      
      {:else if answers[qNum].type === "true_false_cat"}
        <button
          class="btn-primary"
          on:click={() => guessTrueFalseCat(qNum, true)}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == true && answers[qNum].correct}
          class:incorrect={answers[qNum].val == true && !answers[qNum].correct}>
          True
        </button>
        <button
          class="btn-primary"
          on:click={() => guessTrueFalseCat(qNum, false)}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == false && answers[qNum].correct}
          class:incorrect={answers[qNum].val == false && !answers[qNum].correct}>
          False
        </button>

      {:else if answers[qNum].type === "sort"}
        <table class="sort">
          <tbody>
            {#each answers[qNum].options as option, i}
            <tr>
              <td>{i + 1}.</td>
              <td>{option.name}</td>
              <td>
                <button on:click={() => sortOptions(qNum, i, -1)} disabled={i == 0 || answers[qNum].set} title="Move {option.name} up">
                  <Icon type="chevron" rotation={90}/>
                </button>
                <button on:click={() => sortOptions(qNum, i, 1)} disabled={i == answers[qNum].options.length - 1 || answers[qNum].set} title="Move {option.name} down">
                  <Icon type="chevron" rotation={-90}/>
                </button>
              </td>
            </tr>
            {/each}
          </tbody>
        </table>

        {#if !answers[qNum].set}
          <button class="btn-primary" on:click={() => guessSort(qNum)}>
            Submit
          </button>
        {/if}

      {:else if answers[qNum].type === "multi_choice_cat"}
        {#each answers[qNum].options as option}
          <button
            class="btn-primary"
            on:click={() => guessMultiCat(qNum, option)}
            disabled={answers[qNum].set}
            class:correct={option.key == answers[qNum].option.key && answers[qNum].correct}
            class:incorrect={option.key == answers[qNum].option.key && answers[qNum].set && !answers[qNum].correct}>
            {option.label}
          </button>
        {/each}
        {:else if answers[qNum].type === "multi_choice_value"}
        {#each answers[qNum].options as option}
          <button
            class="btn-primary"
            on:click={() => guessMultiValue(qNum, option)}
            disabled={answers[qNum].set}
            class:correct={option.code == place.code && answers[qNum].correct}
            class:incorrect={option.code == place.code && answers[qNum].set && !answers[qNum].correct}>
            {f(option[answers[qNum].key])}{unit}
          </button>
        {/each}
      {/if}
      {#if answers[qNum].set}
        <Reveal correct={answers[qNum].correct}>
          <p>
            <strong>
              {answers[qNum].correct ? 'Good guess!' : 'Not quite...'}
            </strong>
          </p>
          <p>
            {#if ["slider", "higher_lower_avg"].includes(answers[qNum].type)}
            The actual value for {place.name} was <strong>{f(place[answers[qNum].key])}{unit}</strong>.
            {:else if answers[qNum].type === "sort"}
            {answers[qNum].correct ? 'The actual values were:' : 'The actual order was:'}<br/>
            <table class="sort">
              <tbody>
                {#each [...answers[qNum].options].sort((a, b) => b[answers[qNum].key] - a[answers[qNum].key]) as option, i}
                <tr>
                  <td>{i + 1}.</td>
                  <td>{option.name}</td>
                  <td>{f(option[answers[qNum].key])}{legendUnit}</td>
                </tr>
                {/each}
              </tbody>
            </table>
            {/if}
          </p>
          {#if answers[qNum].infoWales && place.code.startsWith('W')}
            <p>{parseInfo(data, answers[qNum].infoWales)}</p>
          {:else if answers[qNum].info}
            <p>{parseInfo(data, answers[qNum].info)}</p>
          {/if}
        </Reveal>
        {#if qNum + 1 < answers.length}

          <button class="btn-primary" on:click={() => qNum ++}>
            Next question
          </button>
        {:else}
          <button class="btn-primary" on:click={e => dispatch("end", {e})}>
            View results
          </button>
        {/if}
      {/if}
    </div>
  </section>
  {/key}
</div>

<style>
  button {
    display: block;
    width: 100%;
    max-width: 380px;
  }
  table button {
    display: inline;
    width: auto;
  }
</style>