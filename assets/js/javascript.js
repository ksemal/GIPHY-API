var buttons = [
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
var gifSet = $("<div>").addClass("gifSet");
$(".container").append(gifSet);

function renderButtons() {
  $("#buttons-view").empty();
  for (var i = 0; i < buttons.length; i++) {
    var button = $("<button>");
    button.addClass("gifButton");
    button.attr("data-name", buttons[i]);
    button.text(buttons[i]);
    $("#buttons-view").append(button);
  }
}

renderButtons();

$(".container").on("click", ".gifButton", displayGifs);

function displayGifs() {
  gifSet.empty();
  var clickedButton = $(this).data("name");
  var queryURL =
    "https://api.giphy.com/v1/gifs/search?q=" +
    clickedButton +
    "&api_key=dc6zaTOxFJmzC&limit=15";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    saveImgId(response);
    $(".container").on("click", "img", displayAnim);
  });
}

function saveImgId(response) {
  arr = response.data;

  for (var i = 0; i < arr.length; i++) {
    var oneGif = $("<img/>");
    oneGif.attr("src", arr[i].images.fixed_width_still.url);
    oneGif.attr("id", i);
    gifSet.append(oneGif);
  }
}

function displayAnim() {
  console.log($(this));
  var id = $(this).attr("id");
  $(this).attr("src", arr[id].images.fixed_width.url);
}

$("#add-button").on("click", function(event) {
  event.preventDefault();
  var newButton = $("#button-name").val();
  buttons.push(newButton);
  renderButtons();
  $("#button-name").val("");
});
