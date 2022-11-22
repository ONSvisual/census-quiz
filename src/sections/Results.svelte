<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "../ui/Icon.svelte";
  import { copyEmbed, makeEmbed, analyticsEvent } from "../utils";
  
  const dispatch = createEventDispatcher();

  export let numberOfQuestions;
  export let score;
  export let answers;
  export let place;

	let copied = false;
  let showEmbed = false;
  let embedPlace = true;

  function copyResults(results) {
		copied = true;
		setTimeout(async () => {
			copied = false;
		}, 1000);

		var copyString =
			"I scored " +
			score +
			" out of " +
			answers.length +
			" in the ONS 'How Well Do You Know Your Area' quiz for " +
			place.name +
			". " 
			// +
			// results
			;

		if (!navigator.clipboard) {
			copyResultsFallback(copyString);
			return;
		}
		navigator.clipboard.writeText(copyString).then(
			function () {
				console.log("Async: Copying to clipboard was successful!");
				console.log(copyString);
			},
			function (err) {
				console.error("Async: Could not copy text: ", err);
			}
		);
    analyticsEvent({
			event: "scoreShare",
			place: place.name,
      score: score
		});
	}

	function copyResultsFallback(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;

		// Avoid scrolling to bottom
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand("copy");
			var msg = successful ? "successful" : "unsuccessful";
			console.log("Fallback: Copying text command was " + msg);
			console.log(copyString);
		} catch (err) {
			console.error("Fallback: Oops, unable to copy", err);
		}

		document.body.removeChild(textArea);
	}
</script>

<div id="game-container">
  <section class="columns">
    <div>
	<div aria-live="assertive" class="result-message">
      <h2>You scored {score} out of {numberOfQuestions}!</h2>
<!-- 
      <p>{answers.map((d) => (d.correct ? "✅" : "🟥")).join("")}</p> -->

		<p style="font-weight: bold">	
			{	
				(score >= 6) ? "Well done! You really know where you live. See if you can do it again with some different questions.":
				(score >= 4 && score <= 5) ? "Not bad. Try again with some different questions and find out more about your area.":
				(score <= 3) ? "Never mind! There's a lot that Census 2021 can tell you about your area, so try again with some different questions." : ""
			}

		</p>
	</div>
		<p>	
			<img src = "./img/resultsbadges/results

			{	
				(score >= 6) ? '01':
				(score >= 4 && score <= 5) ? '02':
				(score <= 3) ? '03' : ""
			}
			
			.svg" width="300px" alt="You scored {score} out of {numberOfQuestions}"/>
		</p>

      <button
        class="btn-primary btn-wide"
        on:click={copyResults(
          answers.map((d) => (d.correct ? "✅" : "🟥")).join("")
        )}
      >
        {#if copied}
          Copied!
        {:else}
          Share
        {/if}
      </button>
      <button class="btn-primary btn-wide" on:click={e => dispatch("restart", {e})}>Play again</button>

      <div class="embed-container">
        <button
          class="btn-link"
          on:click={() => showEmbed = !showEmbed}>
          <Icon type="code"/>
          {showEmbed ? 'Hide embed code' : 'Embed this'}
        </button>

        {#if showEmbed}
        <textarea id="embed" readonly>{makeEmbed(embedPlace ? place.code : null)}</textarea>
        <label>
          <input type="checkbox" bind:checked={embedPlace}/>
          Set {place.name} as default selection
        </label>
        <button class="btn-primary" style:margin="3px 0 0" on:click={copyEmbed}><Icon type="copy"/> Copy to clipboard</button>
        {/if}
      </div>
    </div>
  </section>
</div>

<style>
  .btn-wide {
    display: block;
    width: 100%;
    max-width: 380px;
  }

  .result-message {
	background-color: #F2FAFB;
	padding: 12px;
  }
</style>