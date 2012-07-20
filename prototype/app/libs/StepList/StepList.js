(function (RLD, $) {
  // Temp location.
  RLD['StepList'] = (function () {

    var options = {};
    var plugin = 'StepList';

    function StepList() {
      this.items = [];
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    StepList.prototype = new RLD.InitClass();
    /**
     *
     */
    StepList.prototype.setup = function () {
      // Process list items.
      if ('steps' in this) {
        this.processList(this.steps);
        delete this.steps;
      }
      else {
        this.log('[RLD | ' + plugin + '] The list has no items at setup.');
      }
    };
    /**
     *
     */
     StepList.prototype.processList = function (items) {
      var i;
      for (i = 0; i < items.length; i++) {
        this.items.push(new RLD.Step({
          'label': items[i].label,
          'machine_name': items[i].machine_name,
          'breakpoint': items[i].breakpoint,
          'regions': items[i].regions,
          'grid': items[i].grid
        }));
      }
    };
    /**
     *
     */
    StepList.prototype.update = function (type, list) {
      this.stepItems = type;
      this.triggerEvent('stepOrderUpdated', this);
    };

    return StepList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
