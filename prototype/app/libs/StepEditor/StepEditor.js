(function (RLD, $) {
  RLD['StepEditor'] = (function () {
    
    function StepEditor() {
      this.$editor = $();
      this.init.apply(this, arguments);
    }
    
    StepEditor.prototype.init = function () {
      
    };
    
    StepEditor.prototype.build = function () {
      return this.$editor;
    }
    
    return StepEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));