(function (RLD, $) {
  RLD['GridEditor'] = (function () {
    
    function GridEditor() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    
    GridEditor.prototype.init = function () {
      
    };
    
    GridEditor.prototype.build = function () {
      return this.$editor;
    }
    
    return GridEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));