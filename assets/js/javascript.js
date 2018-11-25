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
    "&api_key=dc6zaTOxFJmzC&limit=" +
    limit;

  var queryURLMovies =
    "https://www.omdbapi.com/?s=" +
    clickedButton +
    "&page=" +
    page +
    "&apikey=trilogy";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $.ajax({
      url: queryURLMovies,
      method: "GET"
    }).then(function(responseMovies) {
      if (responseMovies.Response === "True") {
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
    card.find("#download").attr("href", arr[i].images.fixed_width_still.url);
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
