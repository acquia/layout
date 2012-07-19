(function (RLD, $) {

  RLD['LayoutEditor'] = (function () {
    
    var options = {};
    var plugin = 'LayoutEditor';
    
    function LayoutEditor() {
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutEditor.prototype = new RLD.InitClass();
    
    return LayoutEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));