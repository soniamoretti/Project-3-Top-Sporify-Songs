// The GitHub raw URL of your JSON file
const jsonUrl = "https://raw.githubusercontent.com/soniamoretti/Project-3-Top-Sporify-Songs/refs/heads/main/Resources/Spotify_songs.json";

// Load the Spotify JSON data
d3.json(jsonUrl).then((data) => {
    // Populate dropdown with track names and artist names
    let dropdown = d3.select("#selDataset");
    data.forEach((song, index) => {
        // Concatenate track name and artist(s) name for the dropdown
        dropdown.append("option")
                .text(`${song.track_name} by ${song["artist(s)_name"]}`)
                .property("value", index);
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
            categories: [
                'Danceability', 'Valence', 'Energy', 'Acousticness', 
                'Instrumentalness', 'Liveness', 'Speechiness'
            ],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },
        tooltip: {
            // Format the tooltip to show percentages
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}%</b><br/>'
        },
        series: [{
            name: song.track_name,
            data: [
                song["danceability_%"], 
                song["valence_%"], 
                song["energy_%"], 
                song["acousticness_%"], 
                song["instrumentalness_%"], 
                song["liveness_%"],
                song["speechiness_%"]
            ],
            pointPlacement: 'on'
        }]
    });
}
