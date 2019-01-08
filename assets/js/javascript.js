var topics = [
  "Madness",
  "Melancholy",
  "Cheerful",
  "Mysterious",
  "Romantic",
  "Energetic",
  "Excited",
  "Loving",
  "Joyful",
  "Peaceful",
  "Angry",
  "Annoyed",
  "Depressed",
  "Frustrated",
  "Grumpy",
  "Sad",
  "Stressed",
  "Weird"
];
var movieCollection = [];
var arr;
var limit;
var page = 1;
var clickedButton;
var gifSet = $("<div>").addClass("card-columns col-md-12");
var responseMovies;
var storageGet = localStorage.getItem("savedCards");
$("#favorite").append(storageGet);

function renderButtons() {
  $("#buttons-view").empty();
  for (var i = 0; i < topics.length; i++) {
    var button = $("<button>");
    button.addClass("gifButton btn-sm");
    button.attr("data-name", topics[i]);
    button.text(topics[i]);
    $("#buttons-view").append(button);
  }
}

function displayGifs() {
  gifSet.empty();
  if (clickedButton !== $(this).data("name")) {
    limit = 10;
  } else {
    limit += 10;
  }
  clickedButton = $(this).data("name");

  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    clickedButton +
    "&api_key=uGkmCIitp5DjAFBaFY6BV6YNZ4qlay2q&limit=" +
    limit;

  var queryURLMovies =
    "https://www.omdbapi.com/?s=" +
    clickedButton +
    "&page=" +
    page +
    "&apikey=181f8c24";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $.ajax({
      url: queryURLMovies,
      method: "GET"
    }).then(function(responseMovies) {
      if (responseMovies.Response === "True") {
        movieCollection = [];
        for (var i = 0; i < responseMovies.Search.length; i++) {
          movieCollection.push(responseMovies.Search[i]);
        }
        page++;
      }
      saveImgAttr(response, movieCollection);
    });
  });
}

function saveImgAttr(response, movieCollection) {
  arr = response.data;
  console.log(arr);
  for (var i = 0; i < arr.length; i++) {
    var card = $(".hidden").html();
    card = $(card);
    var oneGif = card.find("#oneGif");
    oneGif.attr({
      src: arr[i].images.fixed_width_still.url,
      "data-still": arr[i].images.fixed_width_still.url,
      "data-animate": arr[i].images.fixed_width.url,
      "data-state": "still"
    });
    card.find("#title").append(arr[i].title);
    card.find("#rating").append(arr[i].rating);
    card.find("#tags").append(arr[i].slug);
    var pathForSaving = arr[i].images.original.url;
    pathForSaving = pathForSaving.substring(0, pathForSaving.indexOf("?"));
    card.find("#download").attr("data-href", pathForSaving);
    console.log(movieCollection);
    if (i < movieCollection.length) {
      card
        .find(".card-link")
        .attr("href", "https://www.imdb.com/title/" + movieCollection[i].imdbID)
        .append(movieCollection[i].Title);
      console.log($(".card-link"));
    }
    gifSet.append(card);
  }
}

function addToFavorite() {
  $("#favorite").append($(this).closest(".card"));
  $(this)
    .attr({ id: "remove", title: "remove" })
    .text("X");
  localStorage.setItem("savedCards", $("#favorite").html());
}

function remove() {
  $(this)
    .closest(".card")
    .remove();
  localStorage.setItem("savedCards", $("#favorite").html());
}

function displayAnim() {
  var state = $(this).data("state");
  if (state === "still") {
    $(this).attr("src", $(this).data("animate"));
    $(this).data("state", "animate");
  } else {
    $(this).attr("src", $(this).data("still"));
    $(this).data("state", "still");
  }
}

// functions to download the image

function forceDownload(blob, filename) {
  var a = document.createElement("a");
  a.download = filename;
  a.href = blob;
  a.click();
}

function downloadResource(url, filename) {
  if (!filename)
    filename = url
      .split("\\")
      .pop()
      .split("/")
      .pop();
  fetch(url, {
    headers: new Headers({
      Origin: location.origin
    }),
    mode: "cors"
  })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch(e => console.error(e));
}

//------------

$(".row")
  .last()
  .prepend(gifSet);
renderButtons();

$("#add-button").on("click", function(event) {
  event.preventDefault();
  var newButton = $("#button-name").val();
  topics.push(newButton);
  renderButtons();
  $("#button-name").val("");
});
$(".container").on("click", ".gifButton", displayGifs);
$(".container").on("click", "img", displayAnim);
$(document).on("click", "#remove", remove);
$(document).on("click", "#addToFav", addToFavorite);
$(document).on("click", "#download", function() {
  downloadResource($(this).data("href"));
});
