(function (RLD, $) {

  RLD['GridEditor'] = (function () {
    
    var options = {};
    var plugin = 'GridEditor';
    
    function GridEditor() {
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    GridEditor.prototype = new RLD.InitClass();
    
    return GridEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));