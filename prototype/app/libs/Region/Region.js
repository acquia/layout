(function (RLD, $) {

  RLD['Region'] = (function () {

    var plugin = 'Region';

    function regionClosed(event) {
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
      var classes = ['region'];
      if ('classes' in options && 'length' in options.classes && options.classes.length > 0) {
        classes = classes.concat(options.classes).join(' ');
      }
      this.$editor = $('<div>', {
        'id': 'region-' + this.label.split(' ').join('_'),
        'class': classes,
        'html': $('<p>', {
          'text': 'Region ' + this.label
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

      this.$editor.delegate('.region-close', 'mousedown', regionClosed);
    
      return this.$editor;
    };
  
    return Region;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
