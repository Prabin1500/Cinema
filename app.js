const apiUrl = 'https://api.tvmaze.com/search/shows?q=';
const imdbUrl = "https://imdb-api.com/en/API/Ratings/k_z83w23e2/";
const imdbtrailer = 'https://www.imdb.com/title/';
const topMovies = 'https://imdb-api.com/en/API/Top250Movies/k_z83w23e2';
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");
const ball = document.querySelector(".toggle-ball");
const movieItem = document.querySelectorAll(".movie-list-item");
const movieTitle = document.querySelectorAll(".movie-list-title");
const container = document.querySelectorAll(".movie-list-container");
const items = document.querySelectorAll(".container, .movie-list-title, .sidebar, .navbar-container, .left-menu-icon, .toggle");
const title = document.querySelector(".movieTitle");
const description = document.querySelector(".featured-desc");
const watchBtn = document.querySelector(".featured-button");
const watchtrailerBtn = document.querySelector(".featured-button-trailer");
const backgroundimg = document.querySelectorAll(".featured-content");
const genre = document.querySelector(".movie-genre");
const country = document.querySelector(".movie-country");
const language = document.querySelector(".movie-audio");
const premired = document.querySelector(".releasedate");
const rating = document.querySelector(".rating");
const runtime = document.querySelector(".runtime");
const form = document.querySelector('#search-form');
const input = form.querySelector('input');
const homeIcon = document.querySelectorAll(".home-icon");
var moviesList = [];
var link =[];

arrows.forEach((arrow, i) => {
    
    const itemNumber = movieLists[i].querySelectorAll("img").length;
    let translateVal = 0;
    let clickCounter = 0;
    arrow.addEventListener("click", () => {
        const ratio = Math.floor(window.innerWidth / 270);
        clickCounter++;
        if(itemNumber - (5 + clickCounter) + (5 - ratio) >= 0){
            movieLists[i].style.transform = `translateX(${
                translateVal - 300
            }px)`;
            translateVal = translateVal - 300;
        } else{
            movieLists[i].style.transform = "translateX(0)"
            translateVal = 0;
            clickCounter = 0;
        }
    })
});

window.addEventListener('resize', () =>{
    console.log(Math.floor(window.innerWidth / 270));
    arrows.forEach((arrow, i) => {
        const itemNumber = movieLists[i].querySelectorAll("img").length;
        if(Math.floor(window.innerWidth / 270) > itemNumber){
            arrow.style.display = 'none';
        }else {
            arrow.style.display = "block";
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
});

homeIcon.forEach((icon, i) => {
    icon.addEventListener("click", () => {
        window.location.href=window.location.href;
    })
})

//implement search functionality
input.addEventListener("keypress", (event) => {
    if(event.key == "Enter"){
        event.preventDefault();
        event.stopPropagation();
        if(input.value.length > 1) {
            getSearchResults(input.value);
        }
        
    }
    
});

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
        rating.style.color = "red";
    }else {
        rating.style.color = "rgb(177, 172, 172)";
        rating.textContent = "Imdb "+ ratings;
    }
    runtime.textContent = data[0].show.averageRuntime + " min";
    var date = data[0].show.premiered;
    var dateSplit = date.split('-'); 
    var year = dateSplit[0];

    premired.textContent = year;
    description.innerHTML = data[0].show.summary;

    if (data[0].show.genres.length == 0){
        genre.textContent = '\u{26A0}';
        genre.style.color = "red";
    }else {
        genre.style.color = "rgb(177, 172, 172)";
        genre.textContent = data[0].show.genres;
    }
    

    if(data[0].show.network == null){
        if (data[0].show.language == "Hindi"){
            country.style.color = "rgb(177, 172, 172)";
            country.textContent = "India";
        }else{
            country.textContent = '\u{26A0}';
            country.style.color = "red";
        }
    } else {
        country.style.color = "rgb(177, 172, 172)";
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

const renderSearchResults = (data, ratings) => {
    container[1].style.display = 'none';
    container[2].style.display = 'none';
    backgroundimg[1].style.display = 'none';
    movieTitle[0].innerText = "Searched item";

    console.log(movieLists[2]);
    renderResults(data, ratings);
    for (let i = 0; i < data.length; i++) {
        movieItem[i].innerHTML = `
        <img src="${data[i].show.image.medium}" alt="" class="movie-list-item-img">
        <span class="movie-list-item-title">${data[i].show.name}</span>
        `
    }
};

const renderTopMovies = (data) => {
    var arr = [];
    while(arr.length < 10){
        var r = Math.floor(Math.random() * 100) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    for (let i = 0; i < arr.length; i++) {
        movieItem[i+16].innerHTML = `
            <img src="${data.items[arr[i]].image}" alt="" class="movie-list-item-img">
            <span class="movie-list-item-title">${data.items[arr[i]].title}</span>
        `
    }
}

const getSearchResults = async (inputValue) => {
    try{
        const response = await fetch(apiUrl + inputValue);
        const data = await response.json();
        const rating = await getRating(data[0].show.externals.imdb);
        renderSearchResults(data, rating);
        renderResults(data, rating);
    }catch(error){
        console.error('Network error here ',error);
    }
    
};

const getTvSeriesData = async (name) => {
    try{
        const response = await fetch(apiUrl + name);
        const data = await response.json();
        const rating = await getRating(data[0].show.externals.imdb);
        console.log('results :', data);
        renderResults(data, rating);
    }catch(error){
        console.error('Network error here ',error);
    }
    
};

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

const getTopMovies = async () => {
    try{
        const response = await fetch(topMovies);
        const data = await response.json();
        console.log(data);
        renderTopMovies(data);
    }catch(error){
        console.error('Network error here ',error);
    }
    
};

//execute only once
var showFirst = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            getTvSeriesData(movieItem[0].innerText);
        }
    };
})();

showFirst();
getTopMovies();