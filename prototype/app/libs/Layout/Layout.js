(function (RLD, $) {
  
  RLD['Layout'] = (function () {
  
    // Region manipulation functions.
    function regionResizeHandler(event) {
      event.stopPropagation();
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
      $this.addClass('splitter-active');
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
      // Bind behaviors.
      fn = $.proxy(this.processSort, this);
      this.$editor.sortable({
        // Make a placeholder visible when dragging.
        placeholder: "ui-state-highlight",
        // When the dragging and dropping is done, save updated region
        // list in our local list.
        deactivate: fn
      });
      // Region resizing behaviors.
      this.$editor.delegate('.region .splitter', 'mousedown', regionResizeHandler);
      
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