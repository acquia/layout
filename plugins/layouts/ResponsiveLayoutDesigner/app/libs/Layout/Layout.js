(function (RLD, $) {
  
  RLD['Layout'] = (function () {

    var plugin = 'Layout';

    // Layout Class
    function Layout() {
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
      var regionOverrides = step.info('regions');
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
          var classes = ['rld-col'];
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
          
          $row.append(regions[i].build({
            'classes': classes
          }))
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
      
      // Return the editor as a DOM fragment.
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
      case 'regionResizeStarted':
        var $this = data.$object;
        var $currentRow = $this.closest('.rld-row');
        if (data.siblings['$' + data.side].length === 0) {
          var $placeholder = this.buildPlaceholder();
          $placeholder[(data.side === 'left') ? 'insertBefore' : 'insertAfter']($this);
          data.siblings['$' + data.side] = $placeholder;
        }
        this.triggerEvent('regionResizeStarted', this);
        break;
      case 'regionResizing':
        // Turn this on to test, but not for production.
        // this.triggerEvent('regionResizing', this);
        break;
      case 'regionResized':
        var $this = data.$object;
        var $currentRow = $this.closest('.rld-row');
        var placeholders = {
          '$left': $currentRow.find('.placeholder:first'),
          '$right': $currentRow.find('.placeholder:last')
        };
        var $nextRow = $currentRow.next('.rld-row');
        var $candidateRegion = $nextRow.find('.rld-region');
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
        }
        this.triggerEvent('regionResized', this);
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
        'class': 'rld-placeholder unit'
      });
    };
    
    Layout.prototype.processRemove = function (event) {
      
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
