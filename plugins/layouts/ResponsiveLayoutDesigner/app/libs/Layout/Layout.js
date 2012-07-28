(function (RLD, $) {
  
  RLD['Layout'] = (function () {

    var plugin = 'Layout';

    // Layout Class
    function Layout() {
      this.deltaColumns = 0;
      this.overrideRegion = null;
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
      var i, k, fn, region, span;
      // Build rows and regions.
      for (i = 0; i < regions.length; i++) {
        var override = undefined;
        var classes = ['rld-col rld-unit'];
        // Start a new row if the spans in the previous row are sufficient or exceed the allotment.
        if ((count === 0) || (count >= grid.columns)) {
          // Append a placeholder to the end of a row.
          if (count >= grid.columns) {
            $row.append(
              new RLD.Region({
                'type': 'placeholder'
              })
              .build({
                'classes': classes
              })
            );
          }
          // Create a new row.
          $row = $('<div>', {
            'class': 'rld-row clearfix'
          })
          // Append a placeholder to the start of the row.
          .append(
            new RLD.Region({
              'type': 'placeholder'
            })
            .build({
              'classes': classes
            })
          )
          // Append the row to the editor.
          .appendTo(this.$editor);
          // Restart the row span count.
          count = 0;
        }
        region = regions[i];
        // If this step has region overrides, get the override that matches this region, if any.
        if (regionOverrides.length > 0) {
          for (k = 0; k < regionOverrides.length; k++) {         
            if (region.info('machine_name') === regionOverrides[k]['machine_name']) {
              override = regionOverrides[k];
              break;
            }
          }
        }
        // If an override for this region exists, use it.
        if (override !== undefined) {
          span = override.columns;
          count += override.columns;
        }
        // Otherwise the region is assumed to be full width.
        else {
          span = grid.columns;
          count = grid.columns;
        }
        // Build the region and append it to the row.
        $row.append(
          this.modifyRegionBuild(
            regions[i].build({
              'classes': classes
            })
            .data('RLD/Region')
            // Get the Region object and update its span.
            .alterSpan(span)
          )
        );
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
      // @todo eventually the row should be stored in state, not structure.
      var $row = $region.closest('.rld-row');
      var i;
      // Mark the region as active.
      region.info('active', true);
      // Mark the splitter active.
      $splitter.addClass('splitter-active');
      // Since the resize function will be called on mousemove, we don't want
      // to calculate the state of the row's region more than once. So we
      // pass this information into the handlers.
      // Determine if the splitter is on the left or right side of region.
      data.side = $splitter.data('RLD/Region/Splitter-side');
      data.width = $region.outerWidth(true);
      // Find all the regions/placeholders in this row.
      data.units = $row.find('.rld-unit').map(function (index, element) {
        return $(this).data('RLD/Region');
      });
      // Calculate the column size so regions can be snapped to grid columns.
      data.totalColumns = Number(this.grid.info('columns'));
      data.frame = Number(this.step.info('size')) / data.totalColumns;
      data.needle = 'rld-span';
      // Get the region from the columns override from the span object
      // for this region.
      this.overrideRegion = this.step.regionList.getItem(region.info('machine_name'));
      // If no override exists, assume full width.
      data.overrideColumns = (this.overrideRegion) ? this.overrideRegion.columns : this.grid.info('columns');
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
      var region = data.region;
      // Calculate the number of grid columns the mouse has traversed.
      var columnsTraversed = Math.floor((event.pageX - data.mouseX) / data.frame);
      // We want regions resized from the right to resize on the trailing
      // edge of the column, not the leading edge.
      if (columnsTraversed < 0 ) {
        columnsTraversed += 1;
      }
      // Get the difference between the distance we know we've covered in previous loops,
      // and where the mouse is in this loop.
      var traversedChunk = columnsTraversed - this.deltaColumns;
      // Keep track of the current number of traversed columns
      // and only resize the region if the frame changes.
      if (columnsTraversed !== this.deltaColumns) {
        this.deltaColumns += traversedChunk;
        // Get an object of two regions: the one to be expanded and the one to be contracted.
        var affectedRegions = this.getAffectedRegions(region, data);
        //
        affectedRegions.right.alterSpan((traversedChunk * -1), true);
        affectedRegions.left.alterSpan(traversedChunk, true);
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
      // Save any changes to regions.
      // If the region already has an override, update it.
      if (this.overrideRegion) {
        this.step.regionList.getItem(this.overrideRegion.info('machine_name')).info('columns', this.deltaSpan);
      }
      // If the region doesn't have an override yet, create one. This can't be a reference to the
      // canonical regionList regions, it needs to be a new object.
      else {
        var r = region.snapshot();
        r.columns = this.deltaSpan;
        this.step.regionList.addItem(r);
      }
      // Clean up state.
      region.info('active', null);
      this.deltaColumns = 0;
      this.overrideRegion = null;
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
    Layout.prototype.getAffectedRegions = function (region, data) {
      var regions = {};
      var i, index;
      
      // Get the index of the active region from the units.
      for (i = 0; i < data.units.length; i++) {
        if ('active' in data.units[i] && data.units[i].active) {
          index = i;
          break;
        }
      }
      // Find the affected units.
      regions[(data.side === 'left') ? 'right' : 'left'] = region;
      regions[(data.side === 'left') ? 'left' : 'right'] = data.units[(data.side === 'left') ? (i - 1) : (i + 1)];
      
      return regions;
    }
    /**
     *
     */
    Layout.prototype.processRemove = function (event) {
      
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
