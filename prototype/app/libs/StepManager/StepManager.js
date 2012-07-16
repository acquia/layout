(function (RLD, $) {

  RLD['StepManager'] = (function () {

    function StepManager() {
      this.options = {};
      this.steps = [];
      this.activeStep;
      // Initialize the object.
      this.init.apply(this, arguments);
    }
    /**
     *
     */
    StepManager.prototype.init = function (options) {
      var prop;
      this.options = $.extend({}, this.options, options);
      for (prop in this.options) {
        if (this.options.hasOwnProperty(prop)) {
          this[prop] = this.options[prop];
        }
      }
      // UI objects.
      this.$stepContainer = $('<div>', {});
      this.$layoutContainer = $('<div>', {});
      this.$editor = $('<div>', {});
    };
    /**
     *
     */
    StepManager.prototype.build = function ($stepContainer, $layoutContainer) {
      var activeStep = (this.activeStep) ? this.activeStep : 0;
      var fn;
      this.$stepContainer = ($stepContainer.length > 0) ? $stepContainer : this.$stepContainer;
      this.$layoutContainer = ($layoutContainer.length > 0) ? $layoutContainer : this.$layoutContainer;
      var i;
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
          .data('RLD/step', step)
          .data('RLD/layout', layout)
        }));
        // Activate the layout for the active step.
        if (i === activeStep) {
          this.$layoutContainer
          .append(
            $('<div>', {
              'id': id,
              'class': 'clearfix',
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
    StepManager.prototype.info = function (property, value) {      
      if (property in this) {
        if (value !== undefined) {
          this[property] = value;
          return;
        }
        return this[property];
      }
      return;
    };
    /**
     *
     */
    StepManager.prototype.addStep = function (index, steps) {
      var i, item, step;
      if (typeof index === 'object' || typeof index === 'array') {
        steps = index;
        index = undefined;
      }
      if (typeof steps === 'object') {
        steps = [steps];
      }
      for (i = 0; i < steps.length; i++) {
        if ('step' in steps[i] && 'layout' in steps[i]) {
          step = {
            'step': steps[i].step,
            'layout': steps[i].layout
          };
          if (index) {
            this.steps[index] = step;
            index += 1;
          }
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
      var layout = $this.data('RLD/layout');
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