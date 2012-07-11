(function (window, $) {
  var RLD = (function(){
  
    var defaults = {
      'root': 'body'
    };
    
    function ResponsiveLayoutDesigner() {
      this.root = $();
      this.options = {};
      this.init.apply(this, arguments);
    }
    
    ResponsiveLayoutDesigner.prototype.init = function (options) {
      this.options = $.extend({}, defaults, options);
      this.root = $(options.root);
    };
    
    ResponsiveLayoutDesigner.prototype.start = function () {
      // Create the application root node.
      $('<div>', {
        'class': 'responsive-layout-designer'
      })
      .appendTo(this.root);
      // Create a new breakpoint editor.
      this.breakPointEditor = new RLD.BreakPointEditor({'root': this.root.find('.responsive-layout-designer')});
    };
    
    return ResponsiveLayoutDesigner;
    
  }());
  
  // Expose ResponsiveLayoutDesigner to the global object
  return (window.ResponsiveLayoutDesigner = RLD);
}(window, jQuery));
