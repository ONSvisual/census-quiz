<script>
  import { createEventDispatcher } from "svelte";
  import { adjectify, format, higherLower, parseInfo } from "../utils";
	import Icon from "../ui/Icon.svelte";
	import SliderWrapper from "../ui/SliderWrapper.svelte";
  
  const dispatch = createEventDispatcher();

  export let data;
  export let place;
  export let answers;
  export let qNum;
  export let resultsArray;
  export let score;

	let maxAns;
	let minAns;

	function guess(i, correct) {
		answers[i].correct = correct;
		answers[i].set = true;
		score += answers[i].correct ? 1 : 0;

		resultsArray.push(answers[i].correct);
	}

	function guessPercent(i) {
		let vals = answers[i].vals;
		let len = vals.length;
		let plusminus = Math.round(0.15 * len); // Equivalent to +/- 15 percentiles
		let index = vals.indexOf(place[answers[i].key]);
		let max =
			index + plusminus >= len ? vals[len - 1] : vals[index + plusminus];
		let min = index - plusminus < 0 ? vals[0] : vals[index - plusminus];

		maxAns = max;
		minAns = min;

		let correct = answers[i].val >= min && answers[i].val <= max;

		guess(i, correct);
	}

	function guessHigherLower(i, hl) {
		let comparator = answers[i].comparator;
		let key = answers[i].key;

		let correct =
			(hl == "higher" && place[key] >= comparator[key]) ||
			(hl == "lower" && place[key] <= comparator[key]);

		answers[i].val = hl;
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

  $: console.log(qNum, answers[qNum]);
  $: f = answers[qNum] && answers[qNum].formatVal ? format(answers[qNum].formatVal) : format();
  $: unit = answers[qNum].unit ? answers[qNum].unit : "";
</script>

<div id="q-container">
  <div>
    <h2>
      <span class="text-lrg">
        Question {qNum + 1}
      </span>
    </h2>
    {answers[qNum].text
      .replace("{place}", place.name)
      .replace(
        "{comparator}",
        answers[qNum].comparator ? answers[qNum].comparator.name : ""
      )}
  </div>
</div>

<div id="game-container">
  <section class="columns">
    <div>
      <!-- this could probably be done a lot better - ask Ahmad -->

      {#if answers[qNum].type === "slider"}
        <SliderWrapper
          bind:answers
          {qNum}
          {data}
          {place}
          {minAns}
          {maxAns}
        />

        {#if !answers[qNum].set}
          <button
            class="btn-primary"
            on:click={() => guessPercent(qNum)}
            >Submit</button
          >
        {:else}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Good answer!
              {:else}
                Bad luck!
              {/if}
            </strong><br/>
            The {answers[qNum].label} in {place.name}
            is
            <strong
              >{f(place[answers[qNum].key])}
              {unit}</strong
            >, which is {adjectify(
              place[
                answers[qNum].key +
                  "_quintile"
              ]
            )} average compared with other local authorities.
          </p>

        {/if}
      {:else if answers[qNum].type === "higher_lower_avg"}
        <div />

        <button
          on:click={() =>
            guessHigherLower(qNum, "higher")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "higher" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "higher" && !answers[qNum].correct}
          >Higher</button
        >
        <button
          on:click={() =>
            guessHigherLower(qNum, "lower")}
          disabled={answers[qNum].set}
          class:correct={answers[qNum].val == "lower" && answers[qNum].correct}
          class:incorrect={answers[qNum].val == "lower" && !answers[qNum].correct}
          >Lower</button
        >

        {#if answers[qNum].set}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Correct.
              {:else}
                Incorrect.
              {/if}
            </strong>
            The {answers[qNum].label} in {place.name}
            was
            <strong
              >{place[answers[qNum].key]}
              {unit}</strong
            >, which was
            <strong
              >{higherLower(
                place[answers[qNum].key] -
                  answers[qNum].comparator[
                    answers[qNum].key
                  ]
              )}</strong
            >
            than the average (median) of {answers[
              qNum
            ].comparator[
              answers[qNum].key
            ]}{unit} across all local
            authorities.
          </p>

        {/if}
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
        {:else}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Good answer!
              {:else}
                Bad luck!
              {/if}
            </strong>
            The correct order of the areas is:
          </p>

          <table class="sort">
            <tbody>
              {#each [...answers[qNum].options].sort((a, b) => b[answers[qNum].key] - a[answers[qNum].key]) as option, i}
              <tr>
                <td>{i + 1}.</td>
                <td>{option.name}</td>
                <td>{f(option[answers[qNum].key])}{unit}</td>
              </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      {:else if answers[qNum].type === "multi_choice_cat"}
        {#each answers[qNum].options as option}
          <button
            on:click={() => guessMultiCat(qNum, option)}
            disabled={answers[qNum].set}
            class:correct={option.key == answers[qNum].option.key && answers[qNum].correct}
            class:incorrect={option.key == answers[qNum].option.key && answers[qNum].set && !answers[qNum].correct}>
            {option.label}
          </button><br/>
        {/each}
        {#if answers[qNum].set}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Correct.
              {:else}
                Incorrect.
              {/if}
            </strong>
          </p>
        {/if}
        {:else if answers[qNum].type === "multi_choice_value"}
        {#each answers[qNum].options as option}
          <button
            on:click={() => guessMultiValue(qNum, option)}
            disabled={answers[qNum].set}
            class:correct={option.code == place.code && answers[qNum].correct}
            class:incorrect={option.code == place.code && answers[qNum].set && !answers[qNum].correct}>
            {f(option[answers[qNum].key])}{unit}
          </button><br/>
        {/each}
        {#if answers[qNum].set}
          <p>
            <strong>
              {#if answers[qNum].correct}
                Correct.
              {:else}
                Incorrect.
              {/if}
            </strong>
          </p>
        {/if}
      {:else}
        <div>Error: Unknown Question Type</div>
        <button class="btn-primary" on:click={() => guess(qNum, true)}> NEXT </button>
      {/if}
      {#if answers[qNum].set}

        {#if answers[qNum].info}
          {#if answers[qNum].infoWales}
            {#if place.code.startsWith('W')}
              <p>{parseInfo(data, answers[qNum].infoWales)}</p>
            {:else}
              <p>{parseInfo(data, answers[qNum].info)}</p>
            {/if}
          {:else}
            <p>{parseInfo(data, answers[qNum].info)}</p>
          {/if}
        {/if}
        
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
</div>