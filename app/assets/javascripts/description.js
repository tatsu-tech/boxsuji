$(document).on('turbolinks:load', function() {
  $(".game-screen__btn-lists__description").on("click", "#description", function() {
    console.log('ok')
    $(".description-screen").fadeToggle();
  })
  $(".topbackground").on("click", ".description-screen", function() {
    $(".description-screen").fadeToggle();
  })
})