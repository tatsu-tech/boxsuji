$(document).on('turbolinks:load', function() {
  $(".game-screen__btn-lists--description").on("click", "#description", function() {
    $(".description-screen").fadeToggle();
  })
  $(".topbackground").on("click", ".description-screen", function() {
    $(".description-screen").fadeToggle();
  })
})