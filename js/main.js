let elDiv = document.querySelector(".wrapper-div");
let elSpan = document.querySelector(".search-result");
let elMovieReating = document.querySelector("#movie-reating");
let elMovieYear = document.querySelector("#movie-year");
let elButton = document.querySelector("#search-button");
let elTemplate = document.querySelector("#movie-template").content;
let elCategories = document.querySelector("#categories-list");
let elSearch = document.querySelector("#search-input");
let elBookmark = document.querySelector(".bookmark-wrapper");
let elBookmarkTemplate = document.querySelector("#bookmark-template").content;

let moviesPieces = movies.slice(0,10)

let normolizeMovies = moviesPieces.map((movieItem, index) =>{
    return{
        id: index + 1,
        title: movieItem.Title.toString(),
        categories: movieItem.Categories,
        rating: movieItem.imdb_rating,
        year: movieItem.movie_year,
        imageLink: `http://i.ytimg.com/vi/${movieItem.ytid}/hqdefault.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`
    }
}) 

// function of categories

function generationCategories(movieCategories){
    let categoryList = []

    movieCategories.forEach(function(item){

        let splitItem = item.categories.split("|");

        splitItem.forEach(function(item){
            if(!categoryList.includes(item)){
                categoryList.push(item)
            }
        })
    })

    categoryList.sort()
    let categoryFragment = document.createDocumentFragment()

    categoryList.forEach(function(item){
        let categoryOption = document.createElement("option")
        categoryOption.value = item
        categoryOption.textContent = item
        categoryFragment.appendChild(categoryOption)
    })
    elCategories.appendChild(categoryFragment)
}

generationCategories(normolizeMovies)

// render movies function

function renderMovies(sliceMovies, placePush) {
    
    placePush.innerHTML = null;
    let elFragment = document.createDocumentFragment();

    sliceMovies.forEach(movie => {
        let templateDiv = elTemplate.cloneNode(true);
        
        templateDiv.querySelector(".card-img-top").src = movie.imageLink;
        templateDiv.querySelector(".card-title").textContent = movie.title;
        templateDiv.querySelector(".movie-categories").textContent = movie.categories.split("|").join(', ');
        templateDiv.querySelector(".date-movie").textContent = movie.year;
        templateDiv.querySelector(".rating-movie").textContent = movie.rating;
        templateDiv.querySelector(".btn-movie-trailer").href = movie.youtubeLink;
        templateDiv.querySelector(".bookmark_btn").dataset.movieId = movie.id
        
        elFragment.appendChild(templateDiv)
    });
    
    placePush.appendChild(elFragment)
    
    elSpan.innerHTML = null
    elSpan.textContent = sliceMovies.length
}

renderMovies(normolizeMovies, elDiv)


elButton.addEventListener("click", function(event){
    event.preventDefault()
    
    //Search with name
    let searchInput = elSearch.value.trim().toLowerCase();

    let searchMovies = normolizeMovies.filter(function(item){
        return item.title.toLowerCase().includes(searchInput)
    })

    // Search with rating and year
    let list = searchMovies.filter(function(item){
        return (item.rating >= elMovieReating.value && item.year >= elMovieYear.value)

    })  

    // Search with categories
   
    let selectOption = elCategories.value
    let categorisedMovies = []

    if(selectOption === "All"){
        categorisedMovies = list
    }

    else{
        categorisedMovies = list.filter(function(item){
            return item.categories.split("|").includes(selectOption)
        })
    }

    elSpan.innerHTML = null
    elSpan.textContent = list.length
    
    renderMovies(categorisedMovies, elDiv)

})

let storage = window.localStorage;

let getItemFromLocalStorage = JSON.parse(storage.getItem("movieArray"))
let bookmarkMovie = getItemFromLocalStorage || []

if(getItemFromLocalStorage){
    bookmarkMovie = getItemFromLocalStorage
}
else{
    bookmarkMovie = []
}


elDiv.addEventListener("click", function(evt){
    let movieID = evt.target.dataset.movieId;

    if (movieID) {
        
        let foundMovie = normolizeMovies.find(item => item.id == movieID)

        let checkInclude = bookmarkMovie.findIndex(item =>   item.id === foundMovie.id
        )

        if (checkInclude === -1) {
            bookmarkMovie.push(foundMovie)
            storage.setItem("movieArray", JSON.stringify(bookmarkMovie))
            renderBookmars(bookmarkMovie, elBookmark)
        }
        
    }
   
})

function renderBookmars(array, wrapper){

    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment();

    array.forEach(function(item){
        let templateBookmark = elBookmarkTemplate.cloneNode(true)
        
        templateBookmark.querySelector(".movie-title").textContent = item.title
        templateBookmark.querySelector(".remove-btn").dataset.markedId = item.id
        elFragment.appendChild(templateBookmark)
        console.log(elFragment);

    })
    wrapper.appendChild(elFragment)
}

renderBookmars(bookmarkMovie, elBookmark)


elBookmark.addEventListener("click", function(evt){
    let removedMovieId = evt.target.dataset.markedId;

    if (removedMovieId) {
        let indexOfMovie = bookmarkMovie.findIndex(function(item){
            return item.id == removedMovieId
        })

        bookmarkMovie.splice(indexOfMovie, 1)
        storage.setItem("movieArray", JSON.stringify(bookmarkMovie))

        renderBookmars(bookmarkMovie, elBookmark)

        console.log(bookmarkMovie);
    }

})