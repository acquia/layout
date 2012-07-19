(function (RLD, $) {
  // Temp location.
  RLD['GridSet'] = (function () {

    function GridSet() {
      this.options = {};
      this.items = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    GridSet.prototype = new RLD.InitClass();
    /**
     *
     */
    GridSet.prototype.initialize = function () {
      // Format the grids.
      this.processList(this.grids);
    };
    /**
     *
     */
    GridSet.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    GridSet.prototype.processList = function (items) {
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Grid({
            'machine_name': item,
            'scope': items[item].scope
          }));
        }
      }
    };
    /**
     *
     */
    GridSet.prototype.getItem = function (index) {
      var i;
      for (i = 0; i < this.items.length; i++) {
        for (property in this.items[i]) {
          if ('machine_name' in this.items[i] && this.items[i]['machine_name'] === index) {
              return this.items[i];
          }
        }
      }
      log('[RLD | GridSet] Item not found in this set.', 'info');
    }
    /**
     *
     */
    GridSet.prototype.update = function (set) {
      this.items = set;
    };

    return GridSet;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
