"use strict";

//initialize all objects
document.addEventListener('DOMContentLoaded', onDomLoad);
//objects needed to animate the chopstick img
let imgMove = document.querySelector("#imgAnimate");
let bottom = 0;
let goingUp = true;

/*
onDomLoad runs everything that needs to be done when DOM is loaded
*/
async function onDomLoad(){
    // move chpsticks img recursively
    requestAnimationFrame(moveSushi);
    //get JSON for the articles
    await getSushi('maki');
    await getSushi('nigiri');
    let nigiriimgs = document.querySelector("#nigiri");
    let makiimgs = document.querySelector("#maki");
    //create observer for the 2 sections
    createObserver(nigiriimgs, 'nigiri');
    createObserver(makiimgs, 'maki');
}

/*
getSushi fetches the JSON from sonic
*/
async function getSushi(category){
    const url = 'https://sonic.dawsoncollege.qc.ca/~jaya/sushi/sushi.php?number='+category;
    try {
        let response = await fetch(url);
        let content;
        if (response.ok) {
          content = await response.json();
        }
        else {
          throw new Error("Status code: " + response.status);
        }
        // gets the count parameter for each sushi category
        fetchInfo(content, 'https://sonic.dawsoncollege.qc.ca/~jaya/sushi/sushi.php?category='+category+'&num=', category);
    }
    catch(e) {
        showError(e);
    }
}

/*
fetchInfo fetches all the inforamtion about each type of sushi and adds it to the correct section
*/
async function fetchInfo(json, url, category){
    let countme = json.count; // number of types of sushi under category
    let fragment = new DocumentFragment();
    let section = document.querySelector('#'+category+'Card');//section{article}

    try {
      // for each type create an article with an img and a description
        for(let i = 0; i<countme; i++){
            let article = document.createElement('article'); //article{figure, description}
            let description = document.createElement('section');
            let figure = document.createElement('figure'); //figure{img}
            let image = document.createElement('img');
            // connect to the page with info about the sushi type
            let response = await fetch(url+i);
            let content;

            if (response.ok) {
                // get info about the sushi type
                content = await response.json();
                // set info to the the correct html tag
                description.textContent = content.description;
                image.src = "./assets/sushi.webp";
                image.setAttribute("data-src", "https://sonic.dawsoncollege.qc.ca/~jaya/sushi/"+content.imageURL);
                image.className = (category);
                // set classnames
                article.className = 'card';
                figure.className = 'card-thumbnail';
                description.className = 'card-description';
                //append together everything to the article
                figure.appendChild(image);
                article.appendChild(figure);
                article.appendChild(description);
                // append article to the fragment
                fragment.appendChild(article);
            }
            else {
                throw new Error("Status code: " + response.status);
            }
        }
    }
    catch(e) {
        showError(e);
    }
    // append all sushis to the web page
    section.appendChild(fragment);
}

/*
showError prints the errors to the console
*/
function showError(error) {
    console.error(error);
    const message = document.querySelector(".error");
    message.textContent = error.message;
}

/*
createObserver creates an observer for a sushi section
*/
function createObserver(section, category){
    let observer = new IntersectionObserver(
      function(entries){
        let imgs = document.querySelectorAll("."+category);
        if (entries[0].intersectionRatio > 0){
            imgs.forEach(img => {
            displayImage(img);
          });
        }
      });
    observer.observe(section);
  }

/*
displayImage replaces he default img with the appropriate img after lazyload
*/
function displayImage(image){
    if (image.src.endsWith("assets/sushi.webp")){
        image.src = image.getAttribute("data-src");
    }
}

/*
moveSushi animates the chopstick img to go up and down continuously
*/
function moveSushi(){
    //if image needs to go up
    if(bottom<=98 && goingUp){
        //move picture up by 2px
        bottom+=2;
        imgMove.style.bottom = bottom+'px';
        //when it reaches 100px start going down
        if(bottom==100){
            goingUp = false;
        }
    }

    //if image needs to go down
    if(!goingUp && bottom>1){
        //move picture down by 2px
        bottom-=2;
        imgMove.style.bottom = bottom+'px';
        //when it reaches 0px start going up
        if(bottom==0){
            goingUp = true;
        }
    }
    //continue to animate the image
    requestAnimationFrame(moveSushi);
}
