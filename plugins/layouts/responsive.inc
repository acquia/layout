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
  /*'regions function' => 'layout_responsive_panels',*/

  // Reusable layout Builder specific directives.
  'builder' => TRUE,
  'builder tab title' => 'Add responsive layout',

  // Sublayout code almost exactly copied from flexible layouts.
  'get child' => 'layout_responsive_get_sublayout',
  'get children' => 'layout_responsive_get_sublayouts',

  // Define ajax callbacks.
  /*'ajax' => array(
    'settings' => 'layout_ajax_responsive_edit_settings',
    'add' => 'layout_ajax_responsive_edit_add',
    'remove' => 'layout_ajax_responsive_edit_remove',
    'resize' => 'layout_ajax_responsive_edit_resize',
    'reuse' => 'layout_ajax_responsive_edit_reuse',
  ),*/
);

/**
 * Merge the main responsive plugin with a layout to create a sub plugin.
 *
 * This is used for both layout_responsive_get_sublayout and
 * layout_responsive_get_sublayouts.
 */
function layout_responsive_merge_plugin($plugin, $layout) {
  $plugin['name'] = 'responsive:' . $layout->name;
  $plugin['category'] = !empty($layout->category) ? check_plain($layout->category) : t('Miscellaneous');
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
    $layouts['responsive:' . $name] = panels_flexible_merge_plugin($plugin, $item);
  }

  return $layouts;
}

/**
 * Draw the responsive layout.
 */
function theme_layout_responsive($vars) {
  // @todo implement DOM order and wrapper rendering.
  return 'Your responsive layout rendered.';
}

/**
 * Draw the responsive layout admin interface.
 */
function theme_layout_responsive_admin($vars) {
  // @todo implement DOM order and wrapper rendering.
  return 'Your responsive layout editor.';
}
