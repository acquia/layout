// Set up the application once the DOM is ready.
$(document).ready(function (event) {
  // Attach a BreakPoint editor
  var editor = new ResponsiveLayoutDesigner({
    'regions': {
      'body': "Body",
      'footer_a': "Footer A",
      'footer_b': "Footer B",
      'footer_c': "Footer C",
      'header_a': "Header A",
      'header_b': "Header B",
      'header_c': "Header C",
      'navigation': "Navigation",
      'sidebar_a': "Sidebar A",
      'sidebar_b': "Sidebar B",
      'sidebar_c': "Sidebar C",
      'subheader_a': "Subheader A",
      'subheader_b': "Subheader B",
      'subheader_c': "Subheader C",
      'title': "Title"
    },
    'layouts': [
      {
        'name': 'Default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '0',
          'label': 'small'
        },
        'layout': {
          /* A layout is a series of overrides on a basic RegionSet. */
        },
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '28em',
          'label': 'landscape'
        },
        'layout': {},
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '41em',
          'label': 'tablet'
        },
        'layout': {},
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '56em',
          'label': 'desktop'
        },
        'layout': {},
        'grid': {}
      },
      {
        'name': 'default',
        'machine-name': 'default',
        'step': {
          'breakpoint': '64em',
          'label': 'large'
        },
        'layout': {},
        'grid': {}
      }
    ]
  });
  // Insert the editor in the DOM.
  editor.build().appendTo('#responsive-layout-designer');
  // Start the responsive layout editor.
  editor.start();
});