<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "../ui/Icon.svelte";
  import { copyEmbed, makeEmbed } from "../utils";
  
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
			". " +
			results;

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
      <h2>Score</h2>

      <p>You scored {score} out of {numberOfQuestions}!</p>

      <p>{answers.map((d) => (d.correct ? "✅" : "🟥")).join("")}</p>

		<p style="font-weight: bold">	
			{	
				(score >= 6) ? "Well done! You've reached your destination.":
				(score >= 4 && score <= 5) ? "Nearly there!":
				(score <= 3) ? "Don't worry.. you'll make it next time!" : ""
			}

		</p>

		<p>	
			<img src = "./img/resultsbadges/{score}.svg" alt="You scored {score} out of {numberOfQuestions}"/>
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
</style>