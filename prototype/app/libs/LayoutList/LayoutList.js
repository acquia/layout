(function (RLD, $) {
  // Temp location.
  RLD['LayoutList'] = (function () {

    var plugin = 'LayoutList';

    function LayoutList() {
      this.items = [];
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutList.prototype = new RLD.InitClass();
    /**
     *
     */
    LayoutList.prototype.setup = function () {
      // Process list items.
      if ('layouts' in this) {
        this.processList(this.layouts);
        delete this.layouts;
      }
      else {
        this.log('[RLD | ' + plugin + '] The list has no items at setup.');
      }
    };
    /**
     *
     */
    LayoutList.prototype.processList = function (items) {
      var i;
      // Create obects for each composite.
      for (i = 0; i < items.length; i++) {
        // Save the composition elements into a unit.
        this.items.push(
          new RLD.Layout({
            'regionList': items[i].regionList,
            'step': items[i].step,
            'grid': items[i].grid
          })
        );
      }
    };
    /**
     *
     */
    LayoutList.prototype.addItem = function (layout) {
      this.processList([layout]);
    }
    /**
     *
     */
    LayoutList.prototype.update = function (type, list) {
      this.items = list;
    };

    return LayoutList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
