<?php

/**
 * @file
 * Responsive layout builder for Panels.
 */

$plugin = array(
  'title' => t('Responsive'),
  'category' => t('Builders'),
  'icon' => 'responsive.png',
  'theme' => 'layout_responsive',
  'admin theme' => 'layout_responsive_admin',
  'css' => 'responsive.css',
  'admin css' => 'responsive-admin.css',
  'regions function' => 'layout_responsive_panels',
  'settings form' => 'layout_responsive_settings_form',
  'settings submit' => 'layout_responsive_settings_form_submit',

  // Reusable layout Builder specific directives.
  'builder' => TRUE,
  'builder tab title' => 'Add responsive layout',

  // Sublayout code almost exactly copied from flexible layouts.
  'get child' => 'layout_responsive_get_sublayout',
  'get children' => 'layout_responsive_get_sublayouts',

);

/**
 * Form callback. Add our form elements for data interchange.
 */
function layout_responsive_settings_form($display, $layout, $layout_settings) {
  // We never draw stored responsive layouts in admin mode; they must be edited
  // from the stored layout UI at that point. This can happen if the layout is
  // displayed in an admin context, but not to administer the layout per say but
  // to administer other thigns on top of the layout, such as rearranging panes
  // when switching layouts or when adding new panes.
  if (!empty($layout['layout'])) {
    return;
  }

  $form = array();
  $default_regions = layout_region_load_all();
  layout_responsive_merge_default_settings($layout_settings, $layout);
  $regions_text = '';
  foreach ($layout_settings['regions'] as $name => $classes) {
    $regions_text .= $name . '; ' . $default_regions[$name]->admin_title . '; ' . $classes . "\n";
  }
  $form['layout_responsive_regions'] = array(
    '#type' => 'textarea',
    '#title' => t('Regions in order of appearance'),
    '#default_value' => $regions_text,
  );

  return $form;
}

/**
 * Form submission. Process the changes to the layout.
 */
function layout_responsive_settings_form_submit(&$layout_settings, $display, $layout, $old_layout_settings) {
  // Get region list and overwrite the whole settings array. This will later
  // be saved by Panels to the display layout settings.
  $region_list = explode("\n", $layout_settings['layout_responsive_regions']);
  $layout_settings = array('regions' => array());

  foreach ($region_list as $region_info) {
    $region_info = trim($region_info);
    if (!empty($region_info)) {

      // Enforce machine name format for security/interoperability.
      list($name, $admin_title, $classes) = explode('; ', $region_info . ' ');
      if (!is_numeric($name) && preg_match('!^([a-z0-9_-])+$!', $name)) {

        // Save region for this layout.
        $layout_settings['regions'][$name] = $classes;

        // Save region in common regions list in case it is a new layout
        // that we did not know before or the region admin_title was updated.
        $region = (object) array(
          'name' => $name,
          'admin_title' => $admin_title,
        );
        layout_region_save($region);
      }
    }
  }
}

/**
 * Merge the main responsive plugin with a layout to create a sub plugin.
 *
 * This is used for both layout_responsive_get_sublayout and
 * layout_responsive_get_sublayouts.
 */
function layout_responsive_merge_plugin($plugin, $layout) {
  $plugin['name'] = 'responsive:' . $layout->name;
  $plugin['category'] = !empty($layout->category) ? check_plain($layout->category) : t('Responsive');
  $plugin['title'] = check_plain($layout->admin_title);
  $plugin['description'] = check_plain($layout->admin_description);
  $plugin['layout'] = $layout;
  $plugin['builder'] = FALSE;
  $plugin['builder tab title'] = NULL;
  return $plugin;
}

/**
 * Callback to provide a single stored responsive layout.
 */
function layout_responsive_get_sublayout($plugin, $layout_name, $sublayout_name) {
  // Do not worry about caching; Panels is handling that for us.
  ctools_include('export');
  $item = ctools_export_crud_load('panels_layout', $sublayout_name);
  if ($item) {
    return layout_responsive_merge_plugin($plugin, $item);
  }
}

/**
 * Callback to provide all stored responsive layouts.
 */
function layout_responsive_get_sublayouts($plugin, $layout_name) {
  $layouts[$layout_name] = $plugin;
  ctools_include('export');
  $items = ctools_export_load_object('panels_layout', 'conditions', array('plugin' => 'responsive'));
  foreach ($items as $name => $item) {
    $layouts['responsive:' . $name] = layout_responsive_merge_plugin($plugin, $item);
  }

  return $layouts;
}

/**
 * Return the actual list of regions for this responsive panel.
 */
function layout_responsive_panels($display, $settings, $layout) {
  $items = array();
  layout_responsive_merge_default_settings($settings, $layout);

  // Resolve machine names to names for visual presentation in panels.
  $default_regions = layout_region_load_all();
  $region_names = array();
  foreach ($settings['regions'] as $name => $classes) {
    $region_names[$name] = $default_regions[$name]->admin_title;
  }

  return $region_names;
}

/**
 * Merge current settings with defualt settings.
 */
function layout_responsive_merge_default_settings(&$settings, &$layout) {
  // This indicates that this is a layout that they used the checkbox
  // on. The layout is still 'flexible' but it's actually pointing
  // to another stored one and we have to load it.
  if (!empty($settings['layout'])) {
    $layout = panels_get_layout('responsive:' . $settings['layout']);
  }

  if (!empty($layout['layout'])) {
    $settings = $layout['layout']->settings;
    if ($settings) {
      return $settings;
    }
  }

  if (empty($settings)) {
    // Initialize default layout options with regions we know about.
    $default_regions = layout_region_load_all();
    $settings = array(
      'regions' => array(),
    );
    foreach ($default_regions as $region) {
      if (!$region->custom) {
        $settings['regions'][$region->name] = '';
      }
    }
  }

  return $settings;
}

/**
 * Draw the responsive layout.
 *
 * @todo
 *   Embeddig the grid CSS inline is evil. Fix it.
 */
function theme_layout_responsive($vars) {
  $css_id = $vars['css_id'];
  $content = $vars['content'];
  $settings = $vars['settings'];
  $display = $vars['display'];
  $layout = $vars['layout'];
  $handler = $vars['renderer'];

  layout_responsive_merge_default_settings($settings, $layout);

  // Render the regions ordered as configured with minimal wrappers.
  $output = '';
  foreach ($content as $name => $rendered) {
    if (!empty($rendered)) {
      // Add a minimal wrapper with some common classes + configured custom classes.
      // The custom classes are used for grid placement.
      $classes = array();
      $classes[] = 'layout-responsive-region';
      $classes[] = 'layout-responsive-region-' . $name;
      $classes[] = 'col';
      if (!empty($settings['regions'][$name])) {
        $classes[] = $settings['regions'][$name];
      }
      $output .= '<div class="' . join(' ', $classes) . '">';
      $output .= $rendered;
      $output .= '</div>';
    }
  }

  // Embed the grid css inline for now. Yeah, I know this is evil.
  // It is just a prototype for now, ok? I know it is evil. Yes.
  $grid_css = layout_grid_get_css();
  return '<div class="panel-responsive clearfix"><style type="text/css">' . $grid_css . '</style>' . $output . '</div>';
}

/**
 * Draw the responsive layout admin interface.
 */
function theme_layout_responsive_admin($vars) {
  $css_id = $vars['css_id'];
  $content = $vars['content'];
  $settings = $vars['settings'];
  $display = $vars['display'];
  $layout = $vars['layout'];
  $handler = $vars['renderer'];

  // We never draw stored responsive layouts in admin mode; they must be edited
  // from the stored layout UI at that point. This can happen if the layout is
  // displayed in an admin context, but not to administer the layout per say but
  // to administer other thigns on top of the layout, such as rearranging panes
  // when switching layouts or when adding new panes.
  if (!empty($layout['layout'])) {
    return theme_layout_responsive(array('css_id' => $css_id, 'content' => $content, 'settings' => $settings, 'display' => $display, 'layout' => $layout, 'renderer' => $handler));
  }

  layout_responsive_merge_default_settings($settings, $layout);

  // Add the ResponsiveLayoutDesigner application.

  // This is a messy, messy list of files. Eventually we'll want to package
  // this app up into a single JavaScript file or wrap it in a Drupal library
  // indirection. And minify it for inclusion on the release.
  $path = drupal_get_path('module', 'layout');
  drupal_add_css($layout['path'] . '/ResponsiveLayoutDesigner/assets/css/application.css');
  drupal_add_css($layout['path'] . '/ResponsiveLayoutDesigner/assets/css/grid.css');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/main.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/LayoutManager/LayoutManager.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/LayoutList/LayoutList.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/Layout/Layout.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/StepManager/StepManager.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/StepList/StepList.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/Step/Step.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/RegionList/RegionList.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/Region/Region.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/GridList/GridList.js');
  drupal_add_js($layout['path'] . '/ResponsiveLayoutDesigner/app/libs/Grid/Grid.js');

  // Add integration code for Drupal.
  drupal_add_js($layout['path'] . '/responsive-admin.js');

  // Add data about the layout and global list of regions.
  $default_regions = layout_region_load_all();
  drupal_add_js(array('responsiveLayout' => array('settings' => $settings, 'defaultRegions' => $default_regions)), 'setting');

  drupal_add_library('system', 'ui.sortable');

  // This is filled in on the client side.
  return '<div id="responsive-layout-designer"></div>';
}
