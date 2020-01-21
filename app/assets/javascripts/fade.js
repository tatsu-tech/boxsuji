$(document).on('turbolinks:load', function() {
  $(".game-screen__btn-lists--description").on("click", "#description", function() {
    $(".description-screen").fadeToggle();
  })
  $(".topbackground").on("click", ".description-screen", function() {
    $(".description-screen").fadeToggle();
  })
  $(".game-screen__quiz-lists").on("click", ".game-screen__quiz-lists--created-game", function() {
    $(".created-screen").fadeToggle();
  })
  $(".topbackground").on("click", ".created-screen__backbtn", function() {
    $(".created-screen").fadeToggle();
  })
  setTimeout("$('.game-screen__notice-message').fadeOut('slow')", 1500)
})
function sortClear() {
  for (const element of document.getElementById('sortForm')) {
    element.checked = false;
  }
}
