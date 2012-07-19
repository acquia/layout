(function (RLD, $) {
  
  RLD['Layout'] = (function () {
  
    var options = {};
    var plugin = 'Layout';
  
    // Region manipulation functions.
    function regionResizeHandler(event) {
      event.stopImmediatePropagation();
      // Disable sortable while resize is active.
      var $delegator = $(event.getDelegator());
      $delegator.sortable('disable');
      var $splitter = $(this);
      var $region = $splitter.closest('.region');
      var $row = $region.closest('.row');
      // Since the resize function will be called on mousemove, we don't want
      // to calculate the state of the row's region more than once. So we
      // pass this information into the handlers.
      var data = {};
      // Determine if the splitter is on the left or right side of region.
      data.side = ($splitter.hasClass('splitter-left')) ? 'left' : 'right';
      data.width = $region.outerWidth();
      data.siblings = {
        '$left': $region.prevAll(),
        '$right': $region.nextAll()
      };
      // Calculate the X origin. This is either the left or right edge of the active
      // region, depending on which splitter is clicked.
      data.regionX = 0;
      data.siblings.$left.each(function () {
        var $this = $(this);
        data.regionX += $this.outerWidth();
      });
      data.regionX += (data.side === 'right') ? data.width : 0;
      data.mouseX = event.pageX;
      data.bounds = {};
      data.bounds.width = $row.width();
      data.bounds.left = $row.position().left;
      data.bounds.right = $row.position().left + data.bounds.width;
      data.$delegator = $delegator;
      // Mark the splitter active.
      $splitter.addClass('splitter-active');
      // Add behaviors.
      fn = $.proxy(resizeRegion, $region);
      $(document).bind('mousemove.regionResize', data, fn);
      fn = $.proxy(finishRegionResize, $region);
      $(document).bind('mouseup.regionResize', data, fn);
    }

    function resizeRegion(event) {
      event.stopImmediatePropagation();
      if (event.pageX <= event.data.bounds.left || event.pageX >= event.data.bounds.right) {
        return false;
      }
      var $region = this;
      var side = event.data.side;
      var deltaX = event.pageX - event.data.mouseX;
      
      if (event.data.side === 'left') {
        // Resize the region.
        $region.css({
          'width': event.data.width - deltaX
        });
        // Resize the left siblings.
        event.data.siblings.$left.css({
          'width': event.data.regionX + deltaX
        });
      }
      if (event.data.side === 'right') {
        // Resize the region.
        $region.css({
          'width': event.data.width + deltaX
        });
        // Resize the left siblings.
        event.data.siblings.$right.css({
          'width': event.data.bounds.width - (event.data.regionX + deltaX)
        }); 
      }
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

    // Layout Class
    function Layout() {
      this.regions = {}; // RegionList
      this.grid = {}; // Grid 
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Layout.prototype = new RLD.InitClass();
    
    Layout.prototype.build = function () {
      var regions = this.regionList.info('items');
      this.$editor = $('<div>', {
        'class': 'layout'
      });
      var i;
      if (regions.length > 0) {
        for (i = 0; i < regions.length; i++) {
          $('<div>', {
            'class': 'row clearfix'
          })
          .append(regions[i].build({
            'classes': ['unit']
          }))
          .prepend($('<div>', {
            'class': 'placeholder unit'
          }))
          .append($('<div>', {
            'class': 'placeholder unit'
          }))
          .appendTo(this.$editor);
        }
      }
      // Region resizing behaviors.
      this.$editor
      .delegate('.region .splitter', 'mousedown.ResponsiveLayoutDesigner', regionResizeHandler);
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
    
    Layout.prototype.processSort = function(event, ui) {
      var regionList = [];
      var i;
      // Get the region objects in their new order.
      var $regions = ui.sender.find('.region');
      for (i = 0; i < $regions.length; i++) {
        regionList.push($($regions[i]).data('RLD/Region'));
      }
      this.regionList.update(regionList);
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
