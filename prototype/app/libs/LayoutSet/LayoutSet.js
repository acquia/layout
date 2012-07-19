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
    LayoutList.prototype.update = function (layoutSet) {
      this.layoutItems = layoutSet;
    };

    return LayoutList;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
