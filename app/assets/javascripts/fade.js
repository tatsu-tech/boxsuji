$(document).on('turbolinks:load', function() {
  $(".game-screen__btn-lists--description").on("click", "#description", function() {
    $(".description-screen").fadeToggle();
  })
  $(".description-screen").on("click", ".description-screen__backbtn", function() {
    $(".description-screen").fadeToggle();
  })
  $(".game-screen__quiz-lists").on("click", ".game-screen__quiz-lists--create-game", function() {
    $(".create-screen").fadeToggle();
  })
  $(".create-screen").on("click", ".create-screen__foot--backbtn", function() {
    $(".create-screen").fadeToggle();
    return false;
  })
  $(".game-screen__quiz-lists").on("click", ".game-screen__quiz-lists--created-game", function() {
    $(".created-screen").fadeToggle();
  })
  $(".created-screen").on("click", ".created-screen__backbtn", function() {
    $(".created-screen").fadeToggle();
  })
  $(".created-screen__list--main--one").on("click", "a", function() {
    $(".created-screen").css("display", "none");
  })
  setTimeout("$('.game-screen__notice-message').fadeOut('slow')", 1500)
})
function sortClear() {
  for (const element of document.getElementById('sortForm')) {
    element.checked = false;
  }
}
