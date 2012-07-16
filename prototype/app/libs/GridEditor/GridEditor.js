(function (RLD, $) {
  RLD['GridEditor'] = (function () {
    
    function GridEditor() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    GridEditor.prototype = new RLD.InitClass();
    
    GridEditor.prototype.init = function () {
      
    };
    
    GridEditor.prototype.build = function () {
      return this.$editor;
    }
    
    return GridEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));