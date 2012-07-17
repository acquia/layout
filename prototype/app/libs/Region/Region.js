(function (RLD, $) {

  RLD['Region'] = (function () {
    
    function Region() {
      this.options = {};
      this.name = '';
      this.machine_name = '';
      this.weight;
      this.$editor;
      // Initialize the object.
      this.init.apply(this, arguments);
    }

    function regionCloseHandler(event) {
      event.stopPropagation();
      var $region = $(this).closest('.region');
      // If region has no siblings, hide row. Otherwise, hide region.
      if ($region.prev().length === 0 && $region.next().length === 0) {
        $region.closest('.row').remove();
      }
      else {
        $region.remove();
      }
    }
    
    Region.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
    };
    
    Region.prototype.build = function () {
      this.$editor = $('<div>', {
        'id': 'region-' + this.name,
        'class': 'region',
        'html': $('<p>', {
          'text': 'Region ' + this.name
        })
      })
      .prepend($('<div>', {
        'class': 'splitter splitter-left'
      }))
      .append($('<a>', {
        'class': 'region-close',
        'href': '#',
        'text': 'Close'
      }))
      .append($('<div>', {
        'class': 'splitter splitter-right'
      }))
      .data('RLD/Region', this);

      this.$editor.delegate('.region .region-close', 'mousedown', regionCloseHandler);
    
      return this.$editor;
    };
    
    Region.prototype.info = function (property, value) {      
      if (property in this) {
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        return this[property];
      }
      return;
    };
    
    return Region;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
