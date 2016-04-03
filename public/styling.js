$(document).ready(function() {
  $('div#body').height($(window).height() - $('div#header').height());

  $(window).resize(function() {
    $('div#body').height($(window).height() - $('div#header').height());
  })
})

$('input').keydown(function(e) {
  console.log("lol")
  if (e.key === "Enter") {
    $(this).animate({'marginTop': '0'}, 500);
  }
});
