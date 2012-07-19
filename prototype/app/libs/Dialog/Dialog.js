(function (RLD, $) {

  RLD['Dialog'] = (function () {
    
    var options = {};
    var plugin = 'Dialog';
    
    function Dialog() {
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    Dialog.prototype = new RLD.InitClass();
    
    return Dialog;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));