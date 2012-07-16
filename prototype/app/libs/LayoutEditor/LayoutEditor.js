(function (RLD, $) {
  RLD['LayoutEditor'] = (function () {
    
    function LayoutEditor() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    LayoutEditor.prototype = new RLD.InitClass();
    
    LayoutEditor.prototype.init = function () {
      
    };
    
    LayoutEditor.prototype.build = function () {
      return this.$editor;
    }
    
    return LayoutEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));