(function (RLD, $) {
  // Temp location.
  RLD['Step'] = (function () {

    function Step() {
      this.options = {
        'breakpoint': '0',
        'label': 'No label'
      };
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    
    Step.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Breakpoints can be defined in pixels or ems.
      //this.processBreakpoint();
    };
    
    Step.prototype.build = function () {
      return this.$editor;
    };
    
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