(function (RLD, $) {

  RLD['StepEditor'] = (function () {
    
    var options = {};
    var plugin = 'StepEditor';
    
    function StepEditor() {
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    StepEditor.prototype = new RLD.InitClass();
    
    return StepEditor;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));