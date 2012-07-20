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
    
    Step.prototype.setup = function () {
      // Breakpoints can be defined in pixels or ems.
      //this.processBreakpoint();
    };
    /**
     *
     */
    Step.prototype.info = function (property, value) {      
      if (property in this) {
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        return this[property];
      }
      return;
    };
    /**
     * A breakpoint can be defined in pixels or ems. So we store the value
     * as a set of components that can be calculated on request.
     */
    Step.prototype.processBreakpoint = function () {};
    
    Step.prototype.getBreakpoint = function (type) {};

    return Step;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));