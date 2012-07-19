(function (RLD, $) {
  // Temp location.
  RLD['LayoutSet'] = (function () {

    function LayoutSet() {
      this.options = {};
      this.items = [];
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutSet.prototype = new RLD.InitClass();
    /**
     *
     */
    LayoutSet.prototype.init = function (options) {
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
    LayoutSet.prototype.build = function () {
      return this.$editor;
    };
    /**
     *
     */
    LayoutSet.prototype.info = function (property, value) {      
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
     LayoutSet.prototype.processList = function (items) {
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
    LayoutSet.prototype.update = function (layoutSet) {
      this.layoutItems = layoutSet;
    };

    return LayoutSet;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));
