(function (RLD, $) {
  
  RLD['Layout'] = (function () {
    
    function Layout() {
      this.options = {};
      this.$editor = $('<div>', {
        'class': 'layout'
      });
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
      var i;
      if ('regions' in this) {
        for (i = 0; i < this.regions.length; i++) {
          $('<div>', {
            'class': 'row',
            'html': $('<div>', {
              'id': 'region-' + this.regions[i].name,
              'class': 'region',
              'html': $('<p>', {
                'text': 'Region ' + this.regions[i].name
              })
            })
            .prepend($('<div>', {
              'class': 'splitter splitter-left'
            }))
            .append($('<div>', {
              'class': 'splitter splitter-right'
            }))
          })
          .appendTo(this.$editor);
        }
      }
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
    
    return Layout;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));