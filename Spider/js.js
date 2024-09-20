 // The GitHub raw URL of your JSON file
 const jsonUrl = "https://raw.githubusercontent.com/soniamoretti/Project-3-Top-Sporify-Songs/refs/heads/main/Resources/Spotify_songs.json";

 // Load the Spotify JSON data
 d3.json(jsonUrl).then((data) => {
     // Populate dropdown with track names
     let dropdown = d3.select("#selDataset");
     data.forEach((song, index) => {
         dropdown.append("option").text(song.track_name).property("value", index);
     });

     // Build the initial charts with the first song
     let firstSong = data[0];
     buildChart(firstSong);

     // Update chart when a new song is selected
     dropdown.on("change", function() {
         let selectedIndex = dropdown.property("value");
         let selectedSong = data[selectedIndex];
         buildChart(selectedSong);
     });
 });

 // Function to build the spiderweb (radar) chart
 function buildChart(song) {
     Highcharts.chart('container', {
         chart: {
             polar: true,
             type: 'line'
         },
         title: {
             text: `${song.track_name} by ${song["artist(s)_name"]}`
         },
         pane: {
             size: '80%'
         },
         xAxis: {
             categories: ['Danceability', 'Valence', 'Energy', 'Acousticness', 'Instrumentalness', 'Liveness'],
             tickmarkPlacement: 'on',
             lineWidth: 0
         },
         yAxis: {
             gridLineInterpolation: 'polygon',
             lineWidth: 0,
             min: 0
         },
         series: [{
             name: song.track_name,
             data: [
                 song["danceability_%"], 
                 song["valence_%"], 
                 song["energy_%"], 
                 song["acousticness_%"], 
                 song["instrumentalness_%"], 
                 song["liveness_%"]
             ],
             pointPlacement: 'on'
         }]
     });
 }