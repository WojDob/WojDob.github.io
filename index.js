const songs_element = document.getElementById('songs')
const search_bar_element = document.getElementById('searchBar');
const pagination_element = document.getElementById('pagination')
const select_genre_element = document.getElementById('genres');

let itunesSongs = [];
let genres = [];
let current_genre = "all"
let current_search_string = ""
let current_page = 1;
let rows = 10;


search_bar_element.addEventListener('keyup', (e) =>{
    current_page = 1
    current_search_string = e.target.value.toLowerCase()
    var filteredSongs = filterSongs(current_genre,current_search_string)
    displaySongs(filteredSongs,songs_element,rows,current_page)
})


select_genre_element.addEventListener("change", (e) =>{
    current_page = 1
    current_genre = e.target.value
    var filteredSongs = filterSongs(current_genre,current_search_string)
    displaySongs(filteredSongs,songs_element,rows,current_page)
})

function filterSongs(genre,searchString){
    if (genre !== "all") {
        var filteredSongs = itunesSongs.filter((song) =>{
            return (
                song.category.attributes.label === genre &&
                (song["im:name"].label.toLowerCase().includes(searchString) ||
                song["im:artist"].label.toLowerCase().includes(searchString))
            )
        })
    }
    else{
        var filteredSongs = itunesSongs.filter((song) =>{
            return (
                song["im:name"].label.toLowerCase().includes(searchString) ||
                song["im:artist"].label.toLowerCase().includes(searchString)
            )
        })
    }
    return filteredSongs
}

const loadSongs = async () => {
    try {
        const res = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
        songs_json = await res.json()
        itunesSongs = songs_json.feed.entry
        itunesSongs.forEach(function(element, index){
            genre = element.category.attributes.label
            if (genres.indexOf(genre) === -1) genres.push(genre);
            element["index"] = index
        } )
        loadGenres(genres, select_genre_element)
        displaySongs(itunesSongs,songs_element,rows,current_page)
    } catch (err) {
        console.error(err)
    }
}

const loadGenres = (genres, wrapper) => {
    genres.forEach(function(element){
        wrapper.innerHTML += `<option value="${element}">${element}</option>`;
    })
}



const displaySongs = (songs, wrapper, rows_per_page, page) => {
    wrapper.innerHTML = ''
    page--
    let start = rows_per_page * page
    let end = start + rows_per_page
    let paginatedItems = songs.slice(start,end)

    paginatedItems.forEach(function(element) {
        wrapper.innerHTML += `
        <div class="song">
            <img class="img-circle shadowed" src="${element["im:image"][2].label}" alt="Album image" width="180" height="180">
            <h2>#${element["index"]} ${element["im:name"].label}</h2>
            <p>${element["im:artist"].label}</p>
            
            <button id="myBtn" class="btn btn-default shadowed">View details</button>
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>${element["im:name"].label}</h2>
                    <p><b>Artist:</b>  ${element["im:artist"].label}</p>
                    <p><b>Category:</b>   ${element.category.attributes.label}</p>
                    <p><b>Release date:</b>  ${element["im:releaseDate"].attributes.label}</p>
                    <p><b>Price:</b>  ${element["im:price"].label}</p>
                    <p><b>Rights:</b>  ${element.rights.label}</p>
                    <p><a class="btn btn-default shadowed" href="${element.link.attributes.href}" role="button" target="_blank">View on iTunes &raquo;</a></p>
                </div>
            </div> 
        </div>
        `; 
      })
      
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function() {
        modal.style.display = "block";
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 
    setupPagination(songs, pagination_element, rows_per_page);
}


function setupPagination (items, wrapper, rows_per_page) {
	wrapper.innerHTML = "";

	let page_count = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < page_count + 1; i++) {
		let btn = paginationButton(i, items);
		wrapper.appendChild(btn);
	}
}


function paginationButton (page, items) {
	let button = document.createElement('button');
	button.innerText = page;

	if (current_page == page) button.classList.add('active');

	button.addEventListener('click', function () {
		current_page = page;
		displaySongs(items, songs_element, rows, current_page);
		let current_btn = document.querySelector('.pagenumbers button.active');
		current_btn.classList.remove('active');
		button.classList.add('active');
	});
	return button;
}


loadSongs();
