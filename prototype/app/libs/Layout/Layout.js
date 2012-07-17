(function (RLD, $) {
  
  RLD['Layout'] = (function () {
  
    // Region manipulation functions.
    function regionResizeHandler(event) {
      event.stopImmediatePropagation();
      // Disable sortable while resize is active.
      var $delegator = $(event.getDelegator());
      $delegator.sortable('disable');
      var $this = $(this);
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
  
      var data = {
        origin: {
          top: $region.position().top,
          left: $region.position().left
        },
        width: $region.outerWidth(),
        siblings: splitterSiblings,
        side: splitterSide,
        '$delegator': $delegator
      };
      createRegion(data, $region);
      fn = $.proxy(resizeRegion, $region);
      $(document).bind('mousemove.regionResize', data, fn);
      fn = $.proxy(finishRegionResize, $region);
      $(document).bind('mouseup.regionResize', data, fn);
      $this.addClass('splitter-active');
    }

    function resizeRegion(e) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      var siblingTo = e.data.siblings;
      var splitFrom = e.data.side;
      var initialX = e.data.origin.left;
      var newX = e.pageX;
      var oldW = e.data.width;
      var newW = this.outerWidth();
      var oldX = (splitFrom == 'left') ? this.position().left : this.position().left + newW;
      var deltaX = (splitFrom == 'left') ? newX - oldX : oldX - newX;
      var gutter = (siblingTo == 'left') ? 'margin-left' : 'margin-right';

      // Resize current region.
      var currentW = this.width();
      this.css( {
        gutter: '5px',
        'width': currentW - deltaX
      } );

      // Resize adjacent region.
      var adjacent = (splitFrom == 'left') ? this.prev('.region') : this.next('.region');
      var adjacentW = parseFloat(adjacent.css('width'));
      adjacent.css( {
        'width': (splitFrom == 'left') ? adjacentW + deltaX : adjacentW + deltaX
      } );
    }

    function finishRegionResize(event) {
      // Perform a final resize.
      resizeRegion.apply(this, arguments);
      // Clean up the DOM.
      $(this).find('.splitter').removeClass('splitter-active');
      $(document).unbind('.regionResize');
      // Reenable sorting
      event.data.$delegator.sortable('enable');
    }

    function createRegion(info, $context) {
      // Create a region to the left or right of the region in question.
      var newRegion = $('<div>', {
        'class': 'region new empty',
        'html': $('<p>Region X</p>')
      });
      if (info.side == 'left' && info.siblings !== 'left') {
        newRegion.prependTo($context.closest('.row'));
      }
      else if (info.side == 'right' && info.siblings !== 'right') {
        newRegion.appendTo($context.closest('.row'));
      }
      $context.find('.splitter').unbind('mousedown.regionCreate');
    }

    // Layout Class
    function Layout() {
      this.options = {};
      this.regions = {}; // RegionSet
      this.grid = {}; // Grid 
      this.$editor;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Layout.prototype = new RLD.InitClass();
    
    Layout.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
    };
    
    Layout.prototype.build = function () {
      var regions = this.regions.info('regionItems');
      this.$editor = $('<div>', {
        'class': 'layout'
      });
      var i;
      if (regions.length > 0) {
        for (i = 0; i < regions.length; i++) {
          $('<div>', {
            'class': 'row',
            'html': regions[i].build()
          })
          .appendTo(this.$editor);
        }
      }
      // Region resizing behaviors.
      this.$editor.delegate('.region .splitter', 'mousedown', regionResizeHandler);
      // Bind behaviors.
      fn = $.proxy(this.processSort, this);
      this.$editor.sortable({
        // Make a placeholder visible when dragging.
        placeholder: "ui-state-highlight",
        // When the dragging and dropping is done, save updated region
        // list in our local list.
        deactivate: fn
      });
      
      // Return the editor as a DOM fragment.
      return this.$editor;
    };
    
    Layout.prototype.info = function (property, value) {      
      if (property in this) {
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        return this[property];
      }
      return;
    };
    
    Layout.prototype.inflect = function (RegionSet, Grid) {
      this.regions = RegionSet;
      this.grid = Grid;
    };
    
    Layout.prototype.processSort = function(event, ui) {
      var regionSet = [];
      var i;
      // Get the region objects in their new order.
      var $regions = ui.sender.find('.region');
      for (i = 0; i < $regions.length; i++) {
        regionSet.push($($regions[i]).data('RLD/Region'));
      }
      this.regions.update(regionSet);
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
