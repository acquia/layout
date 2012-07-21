(function (RLD, $, _) {
  
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
      var processShift = $.proxy(this.processShift, this);
      var processRemove = $.proxy(this.processRemove, this);
      this.regionList.registerEventListener({
        'regionResizing': processShift,
        'regionResized': processShift,
        'regionClosed': processRemove
      });
    };
    
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
    
    Layout.prototype.processShift = function (event, data) {
      switch (event.type) {
      case 'regionResized':
        var $this = event.target.info('$editor');
        var $currentRow = $this.closest('.row');
        var placeholders = {
          '$left': $currentRow.find('.placeholder:first'),
          '$right': $currentRow.find('.placeholder:last')
        };
        var $nextRow = $currentRow.next('.row');
        var $candidateRegion = $nextRow.find('.region');
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
        break;
      case 'regionResizing':
        break;
      default:
        break;
      }
    };
    
    Layout.prototype.updateRow = function ($row) {
      var $regions = $row.find('.region');
      if ($regions.length === 0) {
        $row.slideUp(function () {$(this).remove()});
      }
      if ($regions.length === 1) {}
      if ($regions.length > 1) {}
    }
    
    Layout.prototype.processRemove = function (event) {
      
    };
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery, _));
