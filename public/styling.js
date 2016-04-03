$(document).ready(function() {
  $('div#body').height($(window).height() - $('div#header').height());
  $('div#wrapper > div.half-container').width($(window).width()/2);

  $('input').keydown(function(e) {
    console.log("lol")
    if (e.key === "Enter") {
      $(this).animate({'marginTop': '0'}, 500);
    }
  });

  $(window).resize(function() {
    $('div#body').height($(window).height() - $('div#header').height());
  })
})
