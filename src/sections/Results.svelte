<script>
  import { createEventDispatcher } from "svelte";
  
  const dispatch = createEventDispatcher();

  export let numberOfQuestions;
  export let score;
  export let resultsArray;

	let copied = false;

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

      <p>{resultsArray.map((d) => (d ? "✅" : "🟥")).join("")}</p>

      <button
        on:click={copyResults(
          resultsArray.map((d) => (d ? "✅" : "🟥")).join("")
        )}
      >
        {#if copied}
          Copied!
        {:else}
          Share
        {/if}
      </button>
      <button on:click={e => dispatch("restart", {e})}>Play again</button>
    </div>
  </section>  
</div>