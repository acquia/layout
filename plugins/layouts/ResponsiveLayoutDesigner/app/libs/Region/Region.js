(function (RLD, $) {

  RLD['Region'] = (function () {

    var plugin = 'Region';
    
    // Region manipulation functions.
    function close(event) {
      event.stopPropagation();
      var data = {};
      var region = data.object = this;
      var $region = data.$object = this.info('$editor');
      // If region has no siblings, hide row. Otherwise, hide region.
      if ($region.prev().length === 0 && $region.next().length === 0) {
        $region.closest('.rld-row').remove();
      }
      else {
        $region.remove();
      }
      region.triggerEvent('regionRemoved', data);
    }
    /**
     *
     */
    function Region() {
      this.visibility;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Region.prototype = new RLD.InitClass();
    /**
     *
     */
    Region.prototype.build = function (options) {
      // @todo this classes stuff needs to be generalized.
      var classes = ['rld-region'];
      var fn;
      if ('classes' in options && 'length' in options.classes && options.classes.length > 0) {
        classes = classes.concat(options.classes).join(' ');
      }
      this.$editor = $('<div>', {
        'id': 'rld-region-' + this.label.split(' ').join('_'),
        'class': classes,
        'html': $('<p>', {
          'text': this.label
        })
      })
      .append($('<a>', {
        'class': 'rld-region-close',
        'href': '#',
        'text': 'X',
        'title': 'Close',
      }))
      .data('RLD/Region', this);
      // Region behaviors.
      fn = $.proxy(close, this);
      this.$editor
      .delegate('.rld-region-close', 'mousedown.ResponsiveLayoutDesigner', fn);
    
      return this.$editor;
    };
  
    return Region;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
