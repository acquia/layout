(function (RLD, $) {
  // Temp location.
  RLD['StepEditor'] = (function () {
    
    var defaults = {};
    
    function StepEditor() {
      this.editor = $();
      this.init.apply(this, arguments);
    }
    
    StepEditor.prototype.init = function () {
      
    };
    
    StepEditor.prototype.getEditor = function () {
      return this.editor;
    }
    
    return StepEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));