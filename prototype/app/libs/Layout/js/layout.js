$(function() {

  function resizeRegion(e) {
    var oldX = e.data.origin.left;
    var newX = e.pageX;
    var oldW = e.data.width;
    var newW = oldW - deltaX - 5;
    var deltaX = newX - oldX;
    var siblingTo = e.data.siblings;
    var splitFrom = e.data.side;
    var gutter = (siblingTo == 'left') ? 'margin-left' : 'margin-right';

    // Resize current region.
    this.css( {
      gutter: '5px',
      'width': newW
    } );
    console.log('region width: ' + this.css('width'));
    
    // Resize adjacent region.
    var adjacent = (splitFrom == 'left') ? this.prev('.region') : this.next('.region');
    var adjacentW = parseFloat(adjacent.css('width'));
    adjacent.css('width', adjacentW + deltaX);
    console.log('adjacentW: ' + adjacentW + ', deltaX: ' + deltaX + ', adjacent width: ' + adjacent.css('width'));
  }

  function finishRegionResize(e) {
    resizeRegion.apply(this, arguments);
    $('.splitter').removeClass('splitter-active');
    $(document).unbind('.regionResize');
    this.find('.splitter').unbind('mouseup.regionResize');
  }

  function createRegion(e) {
    // Create a region to the left or right of the region in question.
    var newRegion = $('<div>', {
      'class': 'region new empty',
      'html': $('<p>Region X</p>')
      // 'html': $('<p>Region X</p>', { 'text': variable }),
    });
    if (e.data.side == 'left' && e.data.siblings !== 'left') {
      newRegion.prependTo(this.closest('.row'));
    }
    else if (e.data.side == 'right' && e.data.siblings !== 'right') {
      newRegion.appendTo(this.closest('.row'));
    }
    this.find('.splitter').unbind('mousedown.regionCreate');
  }

  $('.region').css('-webkit-user-select', 'none');

  $('.splitter').mousedown(function(event) {
    var $region = $(this).closest('.region');
    var fn = $.proxy(createRegion, $region);

    // Determine if there are siblings before or after region.
    var splitterSiblings;
    // @TODO: Fix the following logic; should 'both' be accounted for?
    if ($region.prev().length === 1) {
      splitterSiblings = 'left';
      if ($region.prev().length === 1 && $region.next().length === 1) {
        splitterSiblings = 'both';
      }
    }
    else {
      splitterSiblings = 'right';
    }

    // Determine if the splitter is on the left or right side of region.
    var splitterSide = ($(this).hasClass('splitter-left')) ? 'left' : 'right';

    var originObject = {
      origin: {
        top: $region.position().top,
        left: $region.position().left
      },
      width: $region.outerWidth(),
      siblings: splitterSiblings,
      side: splitterSide
    };
    $(document).bind('mousedown.regionCreate', originObject, fn);
    fn = $.proxy(resizeRegion, $region);
    $(document).bind('mousemove.regionResize', originObject, fn);
    fn = $.proxy(finishRegionResize, $region);
    $(document).bind('mouseup.regionResize', originObject, fn);
    $(document).bind('mouseup.regionResize', originObject, fn);
    $(this).addClass('splitter-active');
  });

});
