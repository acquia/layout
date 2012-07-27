(function (RLD, $) {
  
  RLD['Layout'] = (function () {

    var plugin = 'Layout';

    // Layout Class
    function Layout() {
      this.deltaFrames = NaN;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Layout.prototype = new RLD.InitClass();
    
    Layout.prototype.setup = function () {
      var fn = $.proxy(this.processEvent, this);
      this.regionList.registerEventListener({
        'regionAdded': fn,
        'regionRemoved': fn,
        'regionResizeStarted': fn,
        'regionResizing': fn,
        'regionResized': fn
      });
    };
    
    Layout.prototype.build = function (options) {
      this.$editor = $('<div>', {});
      var regions = this.regionList.info('items');
      var step = this.step;
      var grid = this.grid;
      var count = 0;
      // The size of a region may be overridden in this step.
      var regionOverrides = step.info('regionList').info('items');
      var $row;
      var i, k, fn, region;
      // Build rows and regions.
      if (regions.length > 0) {
        for (i = 0; i < regions.length; i++) {
          var override = undefined;
          if ((count === 0) || (count >= grid.columns)) {
            $row = $('<div>', {
              'class': 'rld-row clearfix'
            });
            count = 0;
          }
          var classes = ['rld-col rld-unit'];
          region = regions[i];
          if (regionOverrides.length > 0) {
            for (k = 0; k < regionOverrides.length; k++) {         
              if (region.info('machine_name') === regionOverrides[k]['machine_name']) {
                override = regionOverrides[k];
                break;
              }
            }
          }
          if (override !== undefined) {
            classes.push('rld-span_' + override.columns);
            count += override.columns;
          }
          else {
            classes.push('rld-span_' + grid.columns);
            count = 0;
          }
          
          $row.append(
            this.modifyRegionBuild(
              regions[i].build({
                'classes': classes
              })
            )
          )
          .appendTo(this.$editor);
        }
      }
      // Bind behaviors.
      fn = $.proxy(this.processEvent, this);
      this.$editor.sortable({
        // Make a placeholder visible when dragging.
        placeholder: "ui-state-highlight",
        // When the dragging and dropping is done, save updated region
        // list in our local list.
        deactivate: fn
      });
      // Return the $editor as a jQuery object.
      return this.$editor;
    };
    
    Layout.prototype.processEvent = function (event, data) {
      switch (event.type) {
      case 'regionAdded':
        this.triggerEvent('regionAdded', this, data.object);
        break;
      case 'regionRemoved':
        this.triggerEvent('regionRemoved', this, data.object);
        break;
      case 'sortdeactivate':
        var regionList = [];
        var i;
        // Get the region objects in their new order.
        var $regions = data.sender.find('.rld-region');
        for (i = 0; i < $regions.length; i++) {
          regionList.push($($regions[i]).data('RLD/Region'));
        }
        this.regionList.update(regionList);
        // 
        this.triggerEvent('regionOrderUpdated', this);
        break;
      default:
        break;
      }
    };
    
    Layout.prototype.updateRow = function ($row) {
      var $regions = $row.find('.rld-region');
      if ($regions.length === 0) {
        $row.slideUp(function () {$(this).remove()});
      }
      if ($regions.length === 1) {}
      if ($regions.length > 1) {}
    };
    
    Layout.prototype.buildPlaceholder = function () {
      return $('<div>', {
        'class': 'rld-placeholder rld-unit'
      });
    };
    
    Layout.prototype.modifyRegionBuild = function ($region) {
      var region = $region.data('RLD/Region');
      var fn;
      // Add splittrs to the regions.
      $region
      .prepend(
        $('<div>', {
          'class': 'rld-splitter rld-splitter-left'
        })
        .data('RLD/Region/Splitter-side', 'left')
      )
      .append(
        $('<div>', {
          'class': 'rld-splitter rld-splitter-right'
        })
        .data('RLD/Region/Splitter-side', 'right')
      );
      // Return the editor as a DOM fragment.
      fn = $.proxy(this.startRegionResize, this);
      $region.find('.rld-splitter').bind('mousedown.ResponsiveLayoutDesigner', {'region': region}, fn);
      
      return $region
    };
    /**
     *
     */
    Layout.prototype.startRegionResize = function (event) {
      this.$editor.sortable('disable');
      event.stopImmediatePropagation();
      var data = event.data;
      var region = data.region;
      var $region = region.info('$editor');
      var $splitter = $(event.target);
      var $row = $region.closest('.rld-row');
      // Mark the splitter active.
      $splitter.addClass('splitter-active');
      // Since the resize function will be called on mousemove, we don't want
      // to calculate the state of the row's region more than once. So we
      // pass this information into the handlers.
      // Determine if the splitter is on the left or right side of region.
      data.side = $splitter.data('RLD/Region/Splitter-side');
      data.width = $region.outerWidth(true);
      data.siblings = {
        '$left': $region.prevAll('.rld-region'),
        '$right': $region.nextAll('.rld-region')
      };
      // If no siblings exist, then we're on a row edge. Insert a placeholder.
      if (data.siblings['$' + data.side].length === 0) {
        // Only place a placeholder if one doesn't already exist.
        if ($region[(data.side === 'left') ? 'prev' : 'next']('.rld-placeholder').length === 0) {
          var $placeholder = this.buildPlaceholder();
          $placeholder[(data.side === 'left') ? 'insertBefore' : 'insertAfter']($region);
          data.siblings['$' + data.side] = $placeholder;
        }
      }
      // Calculate the column size so regions can be snapped to grid columns.
      data.frame = Number(this.step.info('size')) / Number(this.grid.info('columns'));
      // Calculate the X origin. This is either the left or right edge of the active
      // region, depending on which splitter is clicked.
      // @todo no used any more, but might be useful in the future.
      /* data.regionX = 0;
      data.siblings.$left.each(function () {
        var $this = $(this);
        data.regionX += $this.outerWidth(true);
      });
      data.regionX += (data.side === 'right') ? data.width : 0; */
      data.mouseX = event.pageX; 
      // Calculate the left and right bounds for the resizing.
      data.bounds = {};
      data.bounds.width = $row.width();
      data.bounds.left = $row.position().left;
      data.bounds.right = $row.position().left + data.bounds.width;
      // Add behaviors.
      fn = $.proxy(this.resizeRegion, this);
      $(document).bind('mousemove.regionResize', data, fn);
      fn = $.proxy(this.finishRegionResize, this);
      $(document).bind('mouseup.regionResize', data, fn);
      // Call listeners.
      this.triggerEvent('regionResizeStarted', this);
    };
    /**
     *
     */
    Layout.prototype.resizeRegion = function (event) {
      event.stopImmediatePropagation();
      var data = event.data;
      if (event.pageX <= data.bounds.left || event.pageX >= data.bounds.right) {
        //return false;
      }
      var region = data.region;
      var $region = region.info('$editor');
      // Calculate the number of grid columns the mouse has traversed.
      var deltaFrames = Math.floor(Math.abs(event.pageX - data.mouseX) / data.frame);
      // Keep track of the deltaFrame and only resize the region if the new frame changes.
      if (deltaFrames !== this.deltaFrames) {
        this.deltaFrames = deltaFrames;
        var needle = 'rld-span';
        // Get the region from the columns override from the span object
        // for this region.  
        var overrideRegion = this.step.regionList.getItem(region.info('machine_name'));
        // If no override exists, assume full width.
        var override = (overrideRegion) ? overrideRegion.columns : this.grid.info('columns');
        // The numer of grid columns to assign to the region is the difference of the span
        // it already consumes minus the delta.
        var deltaSpan = override - deltaFrames;
        // Create a new class list with the grid span class.
        $region.supplantClass(needle, 'rld-span_' + deltaSpan);
        // Resize the left siblings.
        // The number of grids columns to assign to the region/placeholder is equal to the
        // number of grid columns removed from the region being resized.
        data.siblings.$left.supplantClass(needle, 'rld-span_' + deltaFrames);
      }
      // this.triggerEvent('regionResizing', this);
    };
    /**
     *
     */
    Layout.prototype.finishRegionResize = function (event) {
      this.$editor.sortable('enable');
      event.stopImmediatePropagation();
      var data = event.data;
      var region = data.region;
      var $region = region.info('$editor');
      // Perform a final resize.
      this.resizeRegion.apply(this, arguments);
      // Clean up globals.
      this.deltaFrames = NaN;
      // Clean up the DOM.
      $region.find('.splitter').removeClass('splitter-active');
      $(document).unbind('.regionResize');
      // Update the override. If the region is now full width, remove the override.
      // If no override exists, create one.
      // Move the next available region up to the placeholder.
      /* var $row = $region.closest('.rld-row');
      var placeholders = {
        '$left': $row.find('.rld-placeholder:first'),
        '$right': $row.find('.rld-placeholder:last')
      };
      var $nextRow = $row.next('.rld-row');
      var $candidateRegion = $nextRow.find('.rld-region:first');
      if ($candidateRegion.length > 0) {
        var $shiftedRegion = $candidateRegion.detach();
        var width = placeholders['$' + data.side].width();
        placeholders['$' + data.side].replaceWith(
          $shiftedRegion
          .css({
            width: width
          })
        );
        this.updateRow($nextRow);
      } */
      // Call listeners for this event.
      this.triggerEvent('regionResized', this);
    }
    /**
     *
     */
    Layout.prototype.processRemove = function (event) {
      
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
