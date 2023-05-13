const apiUrl = 'https://api.tvmaze.com/search/shows?q=';
const imdbUrl = "https://imdb-api.com/en/API/Ratings/k_z83w23e2/";
const imdbtrailer = 'https://www.imdb.com/title/';
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list")
const ball = document.querySelector(".toggle-ball");
const movieItem = document.querySelectorAll(".movie-list-item")
const items = document.querySelectorAll(".container, .movie-list-title, .sidebar, .navbar-container, .left-menu-icon, .toggle");
const title = document.querySelector(".movieTitle");
const description = document.querySelector(".featured-desc");
const watchBtn = document.querySelector(".featured-button");
const watchtrailerBtn = document.querySelector(".featured-button-trailer");
const backgroundimg = document.querySelector(".featured-content");
const genre = document.querySelector(".movie-genre");
const country = document.querySelector(".movie-country");
const language = document.querySelector(".movie-audio");
const premired = document.querySelector(".releasedate");
const rating = document.querySelector(".rating");
const runtime = document.querySelector(".runtime");
const search = document.querySelector(".search-icon");

var link =[];

arrows.forEach((arrow, i) => {
    
    const itemNumber = movieLists[i].querySelectorAll("img").length
    let clickCounter = 0;
    arrow.addEventListener("click", () => {
        const ratio = Math.floor(window.innerWidth / 270);
        clickCounter++;
        if(itemNumber - (4 + clickCounter) + (4 - ratio) > 0){
            movieLists[i].style.transform = `translateX(${
                movieLists[i].computedStyleMap().get("transform")[0].x.value - 300
            }px)`;
        } else{
            movieLists[i].style.transform = "translateX(0)"
            clickCounter = 0;
        }
    })
});

//button to watch a movie
watchBtn.addEventListener("click", () => {
        window.open(link[0]);
});

//button to watch a trailer
watchtrailerBtn.addEventListener("click", () => {
    window.open(imdbtrailer + link[1] + "/");
})

movieItem.forEach((movie, i) => {
    movie.addEventListener("click", () => {
        getTvSeriesData(movieItem[i].innerText)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    
});

ball.addEventListener("click", () => {
    items.forEach(item => {
        item.classList.toggle("active")
    })
    ball.classList.toggle("active")
});

const renderResults = (data, ratings) => {
    link = [];
    title.textContent = data[0].show.name;
    if(ratings == null){
        rating.textContent = "Imdb " + '\u{26A0}';
    }else {
        rating.textContent = "Imdb "+ ratings;
    }
    runtime.textContent = data[0].show.averageRuntime + " min";
    var date = data[0].show.premiered;
    var dateSplit = date.split('-'); 
    var year = dateSplit[0];

    premired.textContent = year;
    description.innerHTML = data[0].show.summary;
    genre.textContent = data[0].show.genres;

    if(data[0].show.network == null){
        if (data[0].show.language == "Hindi"){
            country.textContent = "India";
        }else{
            country.textContent = "Not Provided";
        }
    } else {
        country.textContent =  data[0].show.network.country.name;
    }
    language.textContent =  data[0].show.language;
    if (data[0].show.network == null) {
        link.push(data[0].show.officialSite);
    }else {
        link.push(data[0].show.network.officialSite);
    }

    link.push(data[0].show.externals.imdb)
};

const getTvSeriesData = async (name) => {
    try{
        console.log(name)
        const response = await fetch(apiUrl + name);
        const data = await response.json();
        //const rating = await getRating(data[0].show.externals.imdb);
        console.log('results :', data);
        renderResults(data, rating);
    }catch(error){
        console.error('Network error here ',error);
    }
    
};

/*
const getRating = async (movieId) => {
    try{
        const response = await fetch(imdbUrl + movieId);
        const data = await response.json();
        console.log(data);
        return data.imDb;
    }catch(error){
        console.error('Network error here ',error);
    }
    
};
*/
//execute only once
var showFirst = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            getTvSeriesData("Panchayet");
        }
    };
})();

showFirst();