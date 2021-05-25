const songs_element = document.getElementById('songs')
const search_bar_element = document.getElementById('searchBar');
const pagination_element = document.getElementById('pagination')
let itunesSongs = [];
let current_page = 1;
let rows = 5;


search_bar_element.addEventListener('keyup', (e) =>{
    const searchString = e.target.value.toLowerCase()
    const filteredSongs = itunesSongs.filter((song) =>{
        return (
            song["im:name"].label.toLowerCase().includes(searchString) ||
            song["im:artist"].label.toLowerCase().includes(searchString)
        )
    })
    displaySongs(filteredSongs,songs_element,rows,current_page)
})


const loadSongs = async () => {
    try {
        const res = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
        songs_json = await res.json()
        itunesSongs = songs_json.feed.entry
        itunesSongs.forEach(function(element, index){
            element["index"] = index
        } )
        displaySongs(itunesSongs,songs_element,rows,current_page)
    } catch (err) {
        console.error(err)
    }
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
            <p><a class="btn btn-default shadowed" href="${element.link.attributes.href}" role="button" target="_blank">View details &raquo;</a></p>
        </div>
        `; 
      })
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
