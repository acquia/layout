(function (RLD, $) {
  RLD['LayoutEditor'] = (function () {
    
    var defaults = {};
    
    function LayoutEditor() {
      this.editor = $();
      this.init.apply(this, arguments);
    }
    
    LayoutEditor.prototype.init = function () {
      
    };
    
    LayoutEditor.prototype.getEditor = function () {
      return this.editor;
    }
    
    return LayoutEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));