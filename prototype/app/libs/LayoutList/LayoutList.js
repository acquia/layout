(function (RLD, $) {
  // Temp location.
  RLD['LayoutList'] = (function () {

    function LayoutList() {
      this.options = {};
      this.items = [];
      this.$editor = $();
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
    LayoutList.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // Format the layouts.
      this.processList(this.layouts);
    };
    /**
     *
     */
    LayoutList.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    LayoutList.prototype.info = function (property, value) {      
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
    LayoutList.prototype.processList = function (items) {
      var item;
      for (item in items) {
        if (items.hasOwnProperty(item)) {
          this.items.push(new RLD.Layout({
            'name': items[item],
            'machine_name': item
          }));
        }
      }
    };
    /**
     *
     */
    LayoutList.prototype.addItem = function (item) {
      this.items.push(item);
    };
    /**
     *
     */
    LayoutList.prototype.getItem = function (index) {
      var i;
      for (i = 0; i < this.items.length; i++) {
        for (property in this.items[i]) {
          if ('machine_name' in this.items[i] && this.items[i]['machine_name'] === index) {
              return this.items[i];
          }
        }
      }
      log('[RLD | LayoutList] Item not found in this set.', 'info');
      return;
    };
    /**
     *
     */
    LayoutList.prototype.update = function (layoutSet) {
      this.layoutItems = layoutSet;
    };

    return LayoutList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
