<script>
  import Icon from "./Icon.svelte";

  export let correct = true;
</script>

<div class="reveal-box" class:correct>
  <div class="reveal-badge" class:correct><Icon type="{correct ? 'tick' : 'cross'}" notranslate/></div>
  <slot/>
</div>

<style>
  .reveal-box {
    position: relative;
    width: 100%;
    margin: 40px 0 20px;
    padding: 12px;
    background-color: #FBEAEA;
  }
  .reveal-box.correct {
    background-color: #E7F3EC;
  }
  .reveal-badge {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    top: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.7em;
    background-color: #D32F2F;
    color: white;
    transform: translate(-50%, -50%);
  }
  .reveal-badge.correct {
    background-color: #0F8243;
  }
</style>