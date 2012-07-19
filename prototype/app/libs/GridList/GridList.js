(function (RLD, $) {
  // Temp location.
  RLD['GridList'] = (function () {

    function GridList() {
      this.options = {};
      this.items = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    GridList.prototype = new RLD.InitClass();
    /**
     *
     */
    GridList.prototype.initialize = function () {
      // Format the grids.
      this.processList(this.grids);
    };
    /**
     *
     */
    GridList.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    GridList.prototype.processList = function (items) {
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
    GridList.prototype.getItem = function (index) {
      var i;
      for (i = 0; i < this.items.length; i++) {
        for (property in this.items[i]) {
          if ('machine_name' in this.items[i] && this.items[i]['machine_name'] === index) {
              return this.items[i];
          }
        }
      }
      log('[RLD | GridList] Item not found in this set.', 'info');
      return;
    }
    /**
     *
     */
    GridList.prototype.update = function (set) {
      this.items = set;
    };

    return GridList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
