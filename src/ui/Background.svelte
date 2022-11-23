<script>
  export let offset = 0;
  export let zoom = false;
  $: width = zoom ? 2800 : 1400; // Width of background image
  let w; // Width of div
</script>

<div bind:clientWidth={w} class="parallax clouds" style:background-position="left {-((offset + 0.4) * ((width - w) * 0.2))}px bottom 20px" 
style:background-size="{width}px auto"/>
<div class="parallax skyline" style:background-position="left {-((offset + 0.1) * ((width - w) * 0.8))}px bottom 0" 
style:background-size="{width}px auto"/>
<div class="parallax town" style:background-position="left {-(offset * ((width - w) * 1.0))}px bottom 0" 
style:background-size="{width}px auto"/>

<style>
  .parallax {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-repeat: no-repeat;
    background-attachment: absolute;
    transition: all 0.7s ease-in-out;
  }
  .clouds {
    background-image: url("../img/clouds.svg");
  }
  .skyline {
    background-image: url("../img/skyline.svg");
  }
  .town {
    background-image: url("../img/town.svg");
  }
</style>