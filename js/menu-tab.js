$(document).ready(function() {
  var menu = $('.main-menu > li');
  var subMenu = $('.sub-menu');
  var last = $('.sub-menu li:last-child a')

  menu.hover(function() {
    $(this).find(subMenu).toggleClass('menu-act');
  });
  menu.focus(function() {
    $(this).find(subMenu).addClass('menu-act');
  });
  list.focusout(function() {
    $(this).parents('.sub-menu').removeClass('menu-act');
  })
});