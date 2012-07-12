(function (RLD, $) {
  RLD['LayoutEditor'] = (function () {
    
    function LayoutEditor() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    
    LayoutEditor.prototype.init = function () {
      
    };
    
    LayoutEditor.prototype.build = function () {
      return this.$editor;
    }
    
    return LayoutEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));