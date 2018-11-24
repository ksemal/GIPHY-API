# GIPHY-API

GIPHY API App is a dynamic web page that populates with gifs of your choice.

##How it works:

- When the user clicks on a button with specific name, the app search gifs with that topic and show 10 static, non-animated gif images on the page. If the user clicks one more time on the same button, 10 more gifs will be added to the page. If the user clicks on a different button, it will show only 10 gifs with that new topic. And the user can press that button again to see more gifs.

- When the user clicks one of the still images, the gif animates. If the user clicks the gif again, it stops playing.

- Under every gif, the user can see title, rating, tags, id of this gif and in a section "movie" the user can see random movie from OMDB API(where the button name is used in the movie title) with the link to IMDB.

- User can create custom button in the right upper corner and see all the gif with this topic.

- The user can add their favorite gifs to a `favorite` section with "heart" button and remove them from the section with remove button. This information is saved in local storage and it shows on the page even when the page is reloaded.
- The user can download any gif by clicking on download button(arrow down).
