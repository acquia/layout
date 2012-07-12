(function (RLD, $) {
  // Temp location.
  RLD['Step'] = (function () {

    function Step() {
      this.options = {
        'breakpoint': '0',
        'label': 'No label'
      };
      this.breakpoint;
      this.label;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    
    Step.prototype.init = function (options) {
      this.options = $.extend({}, this.options, options);
      this.breakpoint = this.options.breakpoint;
      this.label = this.options.label;
    };
    
    Step.prototype.getBreakPoint = function () {
      return this.breakpoint;
    };
    
    Step.prototype.getLabel = function () {
      return this.label;
    };
    
    return Step;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));