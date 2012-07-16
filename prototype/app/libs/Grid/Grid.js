(function (RLD, $) {

  RLD['Grid'] = (function () {
    
    function Grid() {
      this.options = {};
      this.$editor = $();
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Grid.prototype = new RLD.InitClass();
    
    Grid.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
    };
    
    Grid.prototype.build = function () {
      return this.$editor;
    };
    
    Grid.prototype.info = function (property, value) {      
      if (property in this) {
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        return this[property];
      }
      return;
    };
    
    return Grid;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));