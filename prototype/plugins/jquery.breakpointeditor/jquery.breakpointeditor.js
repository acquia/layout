(function ($) {
  /**
   * BreakPointEditor editor provides functionality to display, add and remove
   * layout representations across arbitrary, user-defined breakpoint limits.
   */
  $['BreakPointEditor'] = (function build() {
    
    var defaults = {
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
    
    function BreakPointEditor() {
      this.options = {};
      this.editor = $('<div>', {});
      this.layouts = $();
      this.controls = $();
      // Setup
      this.init.apply(this, arguments);
      this.build.apply(this, arguments);
    }
    
    BreakPointEditor.prototype.init = function (options) {
      this.options = $.extend({}, defaults, options);
    };
    
    BreakPointEditor.prototype.build = function () {
      // Set up a basic editor fraemwork.
      this.editor
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
      this.layouts = this.editor.find('.' + this.options.ui['class-layout']);
      this.controls = this.editor.find('.controls');
      // Set up jQuery UI objects.
      this.refreshEditor();
      // Add layouts provided to the constructor.
      this.addLayout(this.options.breakpoints);
    };
    
    BreakPointEditor.prototype.refreshEditor = function () {
      // Add layout proxy.
      var fn = $.proxy(this.addLayout, this);
      // Start the jQuery UI elements.
      this.layouts.tabs();
      this.controls
      .find('button')
      .once('control', function () {
        $(this)
        .button()
        .bind('click.breakPointEditor', fn);
      });
    };

    BreakPointEditor.prototype.getEditor = function () {
      return this.editor;
    };

    BreakPointEditor.prototype.addLayout = function (breakpoints) {
      var br, id, label;
      for (br in breakpoints) {
        if (breakpoints.hasOwnProperty(br)) {
          id = 'breakpoint-' + br;
          this.editor
          .find('.' + this.options.ui['class-layout-content'])
          .append(
            $('<div>', {
              id: 'breakpoint-' + br,
              text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
            })
          );
          // Incorporate the new pane into the tabs.
          label = breakpoints[br].label || 'no label provided';
          this.layouts.tabs('add', '#breakpoint-' + br, label);
        }
      }
    };
    
    return BreakPointEditor;
    
  }());
  
}(jQuery));