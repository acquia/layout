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

  /*'get child' => 'layout_responsive_get_sublayout',
  'get children' => 'layout_responsive_get_sublayouts',*/

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
