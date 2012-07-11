(function (RLD, $) {
  RLD['LayoutManager'] = (function () {
    
    var defaults = {};
    
    function LayoutManager() {
      this.editor = $();
      this.init.apply(this, arguments);
    }
    
    LayoutManager.prototype.init = function () {
      
    };
    
    LayoutManager.prototype.getEditor = function () {
      return this.editor;
    }
    
    return LayoutManager;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));