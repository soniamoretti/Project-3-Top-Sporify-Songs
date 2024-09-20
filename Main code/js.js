// The GitHub raw URL of your JSON file
const jsonUrl = "https://raw.githubusercontent.com/soniamoretti/Project-3-Top-Sporify-Songs/refs/heads/main/Resources/Spotify_songs.json";

// Load the JSON file from the URL using fetch
async function loadJsonData() {
    const response = await fetch(jsonUrl); 
    const data = await response.json();
    return data;
}

// Process artist names for the Wordcloud
function processWordcloudData(songs) {
    const artists = songs.flatMap(song => song["artist(s)_name"].split(", "));
    
    // Count artist repetitions
    const data = artists.reduce((arr, artist) => {
        let obj = Highcharts.find(arr, obj => obj.name === artist);
        if (obj) {
            obj.weight += 1;
        } else {
            obj = { name: artist, weight: 1 };
            arr.push(obj);
        }
        return arr;
    }, []);

    // Filter out artists with less than 8 repetitions
    const filteredData = data.filter(artist => artist.weight > 8);

    return filteredData;
}

// Load and process the data to create both the Wordcloud and radar chart
document.addEventListener('DOMContentLoaded', async function () {
    const songs = await loadJsonData(); // Load data from JSON file

    // Create the Wordcloud chart
    const wordcloudData = processWordcloudData(songs); 
    Highcharts.chart('container-wc', {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        series: [{
            type: 'wordcloud',
            data: wordcloudData, // Artist names
            name: 'Occurrences'
        }],
        title: {
            text: 'Most popular artist in 2023',
            align: 'left'
        },
        subtitle: {
            text: 'Project 3',
            align: 'left'
        },
        tooltip: {
            headerFormat: '<span style="font-size: 16px"><b>{point.key}</b></span><br>'
        }
    });

    // Populate the dropdown with track names
    let dropdown = d3.select("#selDataset");
    songs.forEach((song, index) => {
        dropdown.append("option").text(song.track_name).property("value", index);
    });

    // Build the initial radar chart with the first song
    let firstSong = songs[0];
    buildChart(firstSong);

    // Update radar chart when a new song is selected
    dropdown.on("change", function() {
        let selectedIndex = dropdown.property("value");
        let selectedSong = songs[selectedIndex];
        buildChart(selectedSong);
    });
});

// Function to build the radar (spiderweb) chart
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