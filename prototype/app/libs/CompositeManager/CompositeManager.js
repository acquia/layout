(function (RLD, $) {
  /**
   * CompositeManager editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['CompositeManager'] = (function build() {
    
    function CompositeManager() {
      this.options = {
        'ui': {
          'class-layout': 'layouts',
          'class-layout-tabs': 'layouts-list',
          'class-layout-content': 'layouts-content'
        }
      };
      this.$editor = $('<div>', {});
      this.$layouts = $();
      this.$controls = $();
      this.listeners = {
        'breakpointAdded': []
      };
      this.composites = [];
      // Setup
      this.init.apply(this, arguments);
    }
    /**
     * Integrate instantiation options.
     */
    CompositeManager.prototype.init = function (options) {
      this.options = $.extend({}, this.options, options);
      // this.stepEditor = new RLD.StepEditor(this.options.breakpoints);
    };
    
    CompositeManager.prototype.build = function () {
      // Set up a basic editor fraemwork.
      this.$editor
      .addClass('breakpoint-editor')
      .append($('<div>', {
          'class': 'controls'
        })
        .append($('<button>', {
          text: 'Add new breakpoint'
        }))
      )
      .append($('<div>', {
          'class': this.options.ui['class-layout']
        })
        .append(
          $('<ul>', {
            'class': this.options.ui['class-layout-tabs']
          })
        )
        .append(
          $('<div>', {
            'class': this.options.ui['class-layout-content']
          })
        )
      );
      // Store the important elements of the editor as jQuery references.
      this.$layouts = this.$editor.find('.' + this.options.ui['class-layout']);
      this.$controls = this.$editor.find('.controls');
      // Set up jQuery UI objects.
      this.refreshEditor();
      // Add layouts provided to the constructor.
      this.addLayout(this.composites);
      
      return this.$editor;
    };
    
    CompositeManager.prototype.refreshEditor = function () {
      // Add layout proxy.
      var fn = $.proxy(this.addLayout, this);
      // Start the jQuery UI elements.
      this.$layouts.tabs();
      this.$controls
      .find('button')
      .once('control', function () {
        $(this)
        .button()
        .bind('click.breakpointEditor', fn);
      });
    };

    CompositeManager.prototype.getEditor = function () {
      return this.$editor;
    };

    CompositeManager.prototype.addLayout = function (composites) {
      var item, id, step, label, breakpoint;
      for (item in composites) {
        if (composites.hasOwnProperty(item)) {
          step = composites[item].step;
          breakpoint = step.info('breakpoint');
          label = step.info('label');
          id = 'breakpoint-' + breakpoint;
          this.$editor
          .find('.' + this.options.ui['class-layout-content'])
          .append(
            $('<div>', {
              id: id,
              text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            })
          );
          // Incorporate the new pane into the tabs.
          this.$layouts.tabs('add', '#' + id, label);
        }
      }
    };
    
    CompositeManager.prototype.registerComposite = function (index, Step, Layout, Grid) {
      this.composites[index] = {
        step: Step,
        layout: Layout,
        grid: Grid
      };
    };
    
    CompositeManager.prototype.getStep = function (index) {
      if (index && index in this.steps) {
        return this.steps[index];
      }
      return this.steps;
    }
    
    CompositeManager.prototype.launchStepEditor = function () {
      var $dialog = this.dialog;
      $dialog.append(this.stepEditor.getEditor());
      $dialog.dialog({
        autoOpen: false,
        modal: true,
        open: function() {},
        close: function() {
          $(this).dialog('destroy').removeAttr('style');
        }
      })
    }
    
    CompositeManager.prototype.registerEventListener = function (event, fn) {
      if (typeof event === 'string' && event in this.listeners && typeof fn === 'function') {
        this.listeners[event].push({
          callback: fn
        });
      }
    }
    
    return CompositeManager;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));