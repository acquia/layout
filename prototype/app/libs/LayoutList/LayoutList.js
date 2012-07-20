(function (RLD, $) {
  // Temp location.
  RLD['LayoutList'] = (function () {
  
    var options = {};
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
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Layout({
            'label': items[item],
            'machine_name': item
          }));
        }
      }
    };
    /**
     *
     */
    LayoutList.prototype.update = function (type, list) {
      this.items = list;
    };

    return LayoutList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
