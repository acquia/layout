(function (RLD, $) {
  RLD['StepEditor'] = (function () {
    
    function StepEditor() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    StepEditor.prototype = new RLD.InitClass();
    
    StepEditor.prototype.init = function () {
      
    };
    
    StepEditor.prototype.build = function () {
      return this.$editor;
    }
    
    return StepEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));