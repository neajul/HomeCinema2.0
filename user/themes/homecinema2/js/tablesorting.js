// on load
$(function(){
  // add sorting function to table headers
  $('.movie-table>.table-line.first li').not('.img').click(function(){
    changeActiveCategory($(this));
  });
});

// table ordering functions find active row
function changeActiveCategory(item){
  // first make sure we contain everything to this table
  var table = item.parent().parent().parent();
  // check if we are changing columns
  if (!item.hasClass('selected')) {
    // remove all selected classes
    table.find('li').removeClass('selected').removeClass('asc').removeClass('desc');
    // make this item selected
    item.addClass('selected');
  }
  // check direction
  if (item.hasClass('asc')) {
    // if the item already is on ascending, change it to descending
    item.removeClass('asc');
    item.addClass('desc');
  } else {
    // otherwise always go ascending
    item.removeClass('desc');
    item.addClass('asc');
  }
  // get arguments: 0 is context, 1 is selected, 2 is direction
  var arguments = item.attr("class").split(' ');
  sortItems(table, arguments[0], arguments[2]);
}


// sort items in list alphabetically
function sortItems(context, condition, direction){
  var listitems = context.children('.table-line.sort').get();
  listitems.sort(function(a, b) {
    // default: desc
    var item1 = a;
    var item2 = b;
    // if asc
    if (direction == 'asc') {
      var item1 = b;
      var item2 = a;
    }
    // sort items, also take numbers into accounts as actual numbers
    return $(item1).find('.' + condition + '.sorting-argument').eq(0).text().trim().toUpperCase().replace(" MIN", "").localeCompare(
      $(item2).find('.' + condition + '.sorting-argument').eq(0).text().trim().toUpperCase().replace(" MIN", ""), undefined, {
        numeric: true,
        sensitivity: 'base'
      }
    );
  })
  $.each(listitems, function(idx, itm) { context.find('.table-line.first').not('.block').after(itm); });
}
