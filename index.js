let songsDiv = document.getElementById('songs')
const searchBar = document.getElementById('searchBar');
let itunesSongs = [];


searchBar.addEventListener('keyup', (e) =>{
    const searchString = e.target.value.toLowerCase()
    const filteredSongs = itunesSongs.filter((song) =>{
        return (
            song["im:name"].label.toLowerCase().includes(searchString) ||
            song["im:artist"].label.toLowerCase().includes(searchString)
        )
    })
    displaySongs(filteredSongs)
})


const loadSongs = async () => {
    try {
        const res = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
        songs_json = await res.json()
        itunesSongs = songs_json.feed.entry
        displaySongs(itunesSongs)
    } catch (err) {
        console.error(err)
    }
}


const displaySongs = (songs) => {
    const htmlString = songs
        .map((element) => {
            return `
            <div class="song">
                <img class="img-circle shadowed" src="${element["im:image"][2].label}" alt="Album image" width="180" height="180">
                <h2>${element["im:name"].label}</h2>
                <p>${element["im:artist"].label}</p>
                <p><a class="btn btn-default shadowed" href="${element.link.attributes.href}" role="button" target="_blank">View details &raquo;</a></p>
            </div>
            `})
    console.log(htmlString)
    songsDiv.innerHTML = htmlString
}


loadSongs();
