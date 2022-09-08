<script>
    import { geoAlbers, geoPath } from "d3-geo";
      import distance from "@turf/distance";
      import gb from "./gb.json";
      
      let width = 400;
      $: height = width * 2;
      
    $: projection = geoAlbers().center([0, 55.4])
      .rotate([2.8, 0])
      .parallels([50, 60])
      .scale(10 * width)
      .translate([width / 2, height / 2]);
      
      console.log(distance([0,0], [1,1], "km"))
  </script>
  
  <div class="map-container" bind:clientWidth={width}>
      <svg {width} {height} viewBox="0 0 {width} {height}" on:click={e => console.log(e)}>
        <path d={geoPath().projection(projection)(gb)} class="border" />
      </svg>
  </div>
  
  <style>
      .map-container {
          width: 100%;
      }
    .border {
      stroke: #444444;
      fill: #cccccc;
    }
  </style> 