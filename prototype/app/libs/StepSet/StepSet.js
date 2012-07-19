(function (RLD, $) {
  // Temp location.
  RLD['StepSet'] = (function () {

    function StepSet() {
      this.options = {};
      this.items = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    StepSet.prototype = new RLD.InitClass();
    /**
     *
     */
    StepSet.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Format the steps.
      this.processList(this.steps);
    };
    /**
     *
     */
    StepSet.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    StepSet.prototype.info = function (property, value) {      
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
     *
     */
     StepSet.prototype.processList = function (items) {
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Step({
            'name': items[item].name,
            'machine_name': item,
            'breakpoint': items[item].breakpoint,
            'regions': items[item].regions,
            'grid': items[item].grid
          }));
        }
      }
    };
    /**
     *
     */
    StepSet.prototype.update = function (stepSet) {
      this.stepItems = stepSet;
      this.triggerEvent('stepOrderUpdated', this);
    };

    return StepSet;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
