(function (RLD, $) {

  RLD['StepManager'] = (function () {

    var plugin = 'StepManager';

    function StepManager() {
      this.steps = [];
      this.activeStep;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     * Extend the InitClass Object.
     */
    StepManager.prototype = new RLD.InitClass();
    /**
     *
     */
    StepManager.prototype.setup = function (options) {
      // UI objects.
      this.$stepContainer = $('<div>', {});
      this.$layoutContainer = $('<div>', {});
    };
    /**
     *
     */
    StepManager.prototype.build = function ($stepContainer) {
      this.$editor = $('<div>', {});
      this.activeStep = this.activeStep || this.steps[0];
      var fn, i, step;
      this.$stepContainer = ($stepContainer.length > 0) ? $stepContainer : this.$stepContainer;
      // Clear the UI.
      this.$stepContainer.children().remove();
      this.$layoutContainer.children().remove();
      // Build the list of steps.
      for (i = 0; i < this.steps.length; i++) {
        step = this.steps[i];
        breakpoint = step.info('breakpoint');
        label = step.info('label');
        id = 'breakpoint-' + breakpoint;
        this.$stepContainer
        .append(
          $('<li>', {
            'html': $('<a>', {
              'href': '#' + id,
              'text': label
            })
            .data('RLD/Step', step)
          })
        );
      }
      // Attach behaviors.
      this.$stepContainer.delegate('a', 'click.RLD.StepManager', {'manager': this}, this.activateStep);
      // Attach the steps and layouts to the $editor and return it.
      return this.$editor
      .append(this.$stepContainer);
    };
    /**
     *
     */
    StepManager.prototype.addItem = function (step) {
      this.steps.push(step);
    };
    /**
     *
     */
    StepManager.prototype.activateStep = function (event) {
      event.preventDefault();
      var $this = $(this);
      var step = $this.data('RLD/Step');
      event.data.manager.activeStep = step;
      event.data.manager.triggerEvent('stepActivated', step);
    };
    
    return StepManager;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));