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
var arr;
var arrMovie;
var limit;
var page;
var clickedButton;
var gifSet = $("<div>").addClass("card-columns col-md-12");
var responseMovies;

$(".row")
  .last()
  .prepend(gifSet);

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

renderButtons();

$(".container").on("click", ".gifButton", displayGifs);
$(".container").on("click", "img", displayAnim);
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
    "https://www.omdbapi.com/?s=" + clickedButton + "&apikey=trilogy";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $.ajax({
      url: queryURLMovies,
      method: "GET"
    }).then(function(responseMovies) {
      saveImgAttr(response, responseMovies);
      console.log(response);
      console.log(responseMovies);
    });
  });
}

function saveImgAttr(response, responseMovies) {
  arr = response.data;
  console.log(response);
  console.log(responseMovies.Response);

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

    if ((i < 10) & (responseMovies.Response !== "False")) {
      arrMovie = responseMovies.Search;
      card
        .find(".card-link")
        .attr("href", "https://www.imdb.com/title/" + arrMovie[i].imdbID)
        .append(arrMovie[i].Title);
    }

    gifSet.append(card);
  }
}
$(document).on("click", "#addToFav", addToFavorite);
function addToFavorite() {
  $("#favorite").append($(this).closest(".card"));
  $(this).unbind(addToFavorite);
}

function displayAnim() {
  console.log($(this));
  var state = $(this).data("state");
  if (state === "still") {
    $(this).attr("src", $(this).data("animate"));
    $(this).data("state", "animate");
  } else {
    $(this).attr("src", $(this).data("still"));
    $(this).data("state", "still");
  }
}

$("#add-button").on("click", function(event) {
  event.preventDefault();
  var newButton = $("#button-name").val();
  topics.push(newButton);
  renderButtons();
  $("#button-name").val("");
});
