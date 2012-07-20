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
    StepManager.prototype.build = function ($stepContainer, $layoutContainer) {
      this.$editor = $('<div>', {});
      var activeStep = (this.activeStep) ? this.activeStep : 0;
      var fn, i, step, layout;
      this.$stepContainer = ($stepContainer.length > 0) ? $stepContainer : this.$stepContainer;
      this.$layoutContainer = ($layoutContainer.length > 0) ? $layoutContainer : this.$layoutContainer;
      // Clear the UI.
      this.$stepContainer.children().remove();
      this.$layoutContainer.children().remove();
      // Build the list of steps.
      for (i = 0; i < this.steps.length; i++) {
        step = this.steps[i].step;
        layout = this.steps[i].layout;
        breakpoint = step.info('breakpoint');
        label = step.info('label');
        id = 'breakpoint-' + breakpoint;
        this.$stepContainer
        .append($('<li>', {
          'html': $('<a>', {
            'href': '#' + id,
            'text': label
          })
          .data('RLD/Step', step)
          .data('RLD/Layout', layout)
        }));
        // Activate the layout for the active step.
        if (i === activeStep) {
          this.$layoutContainer
          .append(
            $('<div>', {
              'id': id,
              'class': 'screen clearfix',
              'html': layout.build()
            })
          );
        }
      }
      // Attach behaviors.
      this.$stepContainer.delegate('a', 'click.RLD.StepManager', {'manager': this}, this.activateStep);
      // Attach the steps and layouts to the $editor and return it.
      return this.$editor
      .append(this.$stepContainer)
      .append(this.$layoutContainer);
    };
    /**
     *
     */
    StepManager.prototype.addStep = function (steps) {
      var i, step;
      if (typeof steps === 'object') {
        steps = [steps];
      }
      for (i = 0; i < steps.length; i++) {
        if ('step' in steps[i] && 'layout' in steps[i]) {
          step = {
            'step': steps[i].step,
            'layout': steps[i].layout
          };
          this.steps.push(step);
        }
        else {
          // RLD.log('The steps provided are not formatted correctly');
        }
      }
    };
    /**
     *
     */
    StepManager.prototype.activateStep = function (event) {
      event.preventDefault();
      var $this = $(this);
      var layout = $this.data('RLD/Layout');
      event.data.manager.loadLayout(layout);
    };
    /**
     *
     */
    StepManager.prototype.loadLayout = function (layout) {
      // Clear the current layout.
      this.$layoutContainer.children().remove();
      // Build the active layout and attach it.
      this.$layoutContainer.append(layout.build()).hide().fadeIn();
    };
    
    return StepManager;
    
  }());
}(ResponsiveLayoutDesigner, jQuery));