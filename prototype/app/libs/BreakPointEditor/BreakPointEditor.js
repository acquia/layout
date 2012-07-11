(function (RLD, $) {
  /**
   * BreakPointEditor editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  RLD['BreakPointEditor'] = (function build() {
    
    function BreakPointEditor() {
      this.options = {
        'ui': {
          'class-layout': 'layouts',
          'class-layout-tabs': 'layouts-list',
          'class-layout-content': 'layouts-content'
        },
        'breakpoints': {
          '1': {
            'label': 'small'
          }
        }
      };
      this.$editor = $('<div>', {});
      this.$layouts = $();
      this.$controls = $();
      this.$root = $();
      this.listeners = {};
      this.events = {
        'breakPointAdded': []
      };
      // Setup
      this.init.apply(this, arguments);
      this.build.apply(this, arguments);
    }
    /**
     * Integrate instantiation options.
     */
    BreakPointEditor.prototype.init = function (options) {
      this.options = $.extend({}, this.options, options);
      this.$root = options.root;
      this.stepEditor = new RLD.StepEditor(this.options.breakpoints);
    };
    
    BreakPointEditor.prototype.build = function () {
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
      )
      .appendTo(this.$root);
      // Store the important elements of the editor as jQuery references.
      this.$layouts = this.$editor.find('.' + this.options.ui['class-layout']);
      this.$controls = this.$editor.find('.controls');
      // Set up jQuery UI objects.
      this.refreshEditor();
      // Add layouts provided to the constructor.
      this.addLayout(this.options.breakpoints);
      // Create a dialog to use for various things.
      this.dialog = $('#dialog');
    };
    
    BreakPointEditor.prototype.refreshEditor = function () {
      // Add layout proxy.
      var fn = $.proxy(this.addLayout, this);
      // Start the jQuery UI elements.
      this.$layouts.tabs();
      this.$controls
      .find('button')
      .once('control', function () {
        $(this)
        .button()
        .bind('click.breakPointEditor', fn);
      });
    };

    BreakPointEditor.prototype.getEditor = function () {
      return this.$editor;
    };

    BreakPointEditor.prototype.addLayout = function (breakpoints) {
      var br, id, label;
      for (br in breakpoints) {
        if (breakpoints.hasOwnProperty(br)) {
          id = 'breakpoint-' + br;
          this.$editor
          .find('.' + this.options.ui['class-layout-content'])
          .append(
            $('<div>', {
              id: 'breakpoint-' + br,
              text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            })
          );
          // Incorporate the new pane into the tabs.
          label = breakpoints[br].label || 'no label provided';
          this.$layouts.tabs('add', '#breakpoint-' + br, label);
        }
      }
    };
    
    BreakPointEditor.prototype.launchStepEditor = function () {
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
    
    BreakPointEditor.prototype.registerEventListener = function (event, fn) {
      this.listeners[event] = fn;
    }
    
    return BreakPointEditor;
    
  }());

}(ResponsiveLayoutDesigner, jQuery));