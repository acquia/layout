(function (RLD, $) {

  RLD['Grid'] = (function () {
    
    var options = {};
    var plugin = 'Grid';
    
    function Grid() {
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Grid.prototype = new RLD.InitClass();
    
    return Grid;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));