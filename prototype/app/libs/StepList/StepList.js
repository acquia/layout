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
    StepList.prototype.update = function (type, list) {
      this.stepItems = type;
      this.triggerEvent('stepOrderUpdated', this);
    };

    return StepList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
