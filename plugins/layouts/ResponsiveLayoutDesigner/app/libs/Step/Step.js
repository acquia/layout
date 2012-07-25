(function (RLD, $) {
  // Temp location.
  RLD['Step'] = (function () {

    var plugin = 'Step';
    
    function Step() {
      this.options = {
        'breakpoint': '0'
      };
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Step.prototype = new RLD.InitClass();

    return Step;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));