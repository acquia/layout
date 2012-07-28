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
      var i, widthOffset, originalColumn;
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
      data.frame = Math.floor(Number(this.step.info('size')) / data.totalColumns);
      // Get the region from the columns override from the span object
      // for this region.
      this.overrideRegion = this.step.regionList.getItem(region.info('machine_name'));
      // If no override exists, assume full width.
      data.overrideColumns = (this.overrideRegion) ? this.overrideRegion.columns : this.grid.info('columns');
      // Store the X origin of the original click.
      data.originX = event.pageX;
      // Get the column the resize started in.
      widthOffset = (data.side === 'right') ? data.width : 0;
      originalColumn = Math.floor(($region.position().left + widthOffset) / data.frame);
      data.originColumn = (data.side === 'left') ? ++originalColumn : originalColumn;
      // Calculate the left and right bounds for the resizing.
      data.rightMaxTraversal = data.totalColumns - data.originColumn;
      data.leftMaxTraversal = (data.originColumn -1) * -1;
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
      var columnsTraversed = Math.floor((event.pageX - data.originX) / data.frame);
      // We want regions resized from the right to resize on the trailing
      // edge of the column, not the leading edge.
      if (columnsTraversed < 0 ) {
        columnsTraversed += 1;
      }
      // Get the difference between the distance we know we've covered in previous loops,
      // and where the mouse is in this loop.
      var traversedChunk = columnsTraversed - this.deltaColumns;
      var proposedDelta = this.deltaColumns + traversedChunk;
      // Keep track of the current number of traversed columns
      // and only resize the region if the frame changes.
      if (proposedDelta < data.leftMaxTraversal || proposedDelta > data.rightMaxTraversal) {
        return;
      }
      if (columnsTraversed !== this.deltaColumns) {
        this.deltaColumns = proposedDelta;
        // Get an object of two regions: the one to be expanded and the one to be contracted.
        var affectedRegions = this.getAffectedRegions(region, data, traversedChunk);
        // Resize the affected regions by the amount traversed chunk of columns.
        if (affectedRegions.right) {
          affectedRegions.right.alterSpan((traversedChunk * -1), true);
        }
        if (affectedRegions.left) {
          affectedRegions.left.alterSpan(traversedChunk, true);
        }
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
    Layout.prototype.getAffectedRegions = function (region, data, traversedChunk) {
      var units = data.units;
      var activeSide = (data.side === 'left') ? 'right' : 'left';
      var candidateSide = (data.side === 'left') ? 'left' : 'right';
      var regions = {};
      // Expanding and contracting checks for the active and candidate regions.
      var isActiveContracting = ((activeSide === 'left' && traversedChunk < 0) || (activeSide === 'right' && traversedChunk > 0));
      var isActiveExpanding = ((activeSide === 'left' && traversedChunk > 0) || (activeSide === 'right' && traversedChunk < 0));
      var isCandidateContracting = ((candidateSide === 'left' && traversedChunk < 0) || (candidateSide === 'right' && traversedChunk > 0));
      var isCandidateExpanding = ((candidateSide === 'left' && traversedChunk > 0) || (candidateSide === 'right' && traversedChunk < 0));
      var i, index, candidate;
      // Assume nothing is changing.
      regions[activeSide] = null;
      regions[candidateSide] = null;
      // Don't allow the active region to contract smaller than one column or expand more than the total number of columns.
      if ((region.span === 1 && isActiveContracting) || ((region.span === data.totalColumns) && isActiveExpanding)) {
        return regions;
      }
      // If the active region can be altered, then determine which unit will be the passive unit.
      // This is a zero-sum game. Someone has to make room or take room.
      // Get the index of the active region from the units.
      for (i = 0; i < units.length; i++) {
        if ('active' in units[i] && units[i].active) {
          index = i;
          break;
        }
      }
      // Try candidate units until one can be manipulated.
      for (i = (data.side === 'left') ? (i - 1) : (i + 1); i > 0 || i < (units.length - 1); (data.side === 'left') ? i-- : i++) {
        // The try-catch is here to make sure we don't access an index of units
        // that doesn't exist and blow up the application.
        try {
          candidate = units[i];
          // If the candidate is a placeholder, just use it.
          if (candidate.type === 'placeholder') {
            regions[candidateSide] = candidate;
            break;
          }
          // Don't allow the candidate region to contract smaller than one column or expand more than the total number of columns.
          if ((candidate.span === 1 && isCandidateContracting) || ((candidate.span === data.totalColumns) && isCandidateExpanding)) {
            return regions;
          }
          // The candidate can be manipulated.
          regions[candidateSide] = candidate;
          break;
        }
        catch (error) {
          regions[candidateSide] = null;
        }
      }
      // The region can be resized. We should have a candidate as well.
      regions[activeSide] = region;
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
