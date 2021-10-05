// on load
$(function(){
  // add sorting function to table headers
  $('.table-header li').not('.images').not('.diagram').click(function(){
    changeActiveCategory($(this));
  });
});
