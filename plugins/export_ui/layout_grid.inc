<?php

/**
 * @file
 * Export / edit UI plugin for grids.
 */

$plugin = array(
  'schema' => 'layout_grid',
  'access' => 'administer layouts',

  // Define the menu item.
  'menu' => array(
    // This menu item is modified in layout_menu_alter() to be a local task
    // under the regular panels layout UI.
    'menu prefix' => 'admin/structure/panels/layouts',
    'menu item' => 'grids',
    'menu title' => 'Responsive grids',
  ),

  // Define user interface texts.
  'title singular' => t('grid'),
  'title singular proper' => t('Layout grid'),
  'title plural' => t('grids'),
  'title plural proper' => t('Layout grids'),

  'form' => array(
    'settings' => 'layout_grid_edit_form',
    'validate' => 'layout_grid_edit_form_validate',
  ),
);

/**
 * Grid item settings form.
 *
 * @see layout_grid_edit_form_validate().
 */
function layout_grid_edit_formm(&$form, $form_state) {
  $grid = $form_state['item'];

  // Common form elements are already provided by ctools for admin_title
  // (human readable label) and name (machine name).

  $form['width'] = array(
    '#type' => 'textfield',
    '#title' => t('Breakpoint'),
    // http://blog.cloudfour.com/the-ems-have-it-proportional-media-queries-ftw/
    // has some great points for em based responsive layouts, we allow for pixel
    // and em based layouts so long as the same unit is used. We do not explicitly
    // deny separate units, but our orderings assumes the same unit is used.
    '#description' => t("Width point where this grid is applied. Examples: 960px, 41em. Do not mix pixel and em based widths."),
    '#default_value' => @$grid->width,
  );
  $form['css'] = array(
    '#type' => 'textarea',
    '#title' => t('Grid CSS'),
    '#description' => t("CSS to describe the grid applied to this breakpoint."),
    '#default_value' => @$grid->css,
  );
}

/**
 * Validation for grid item settings form.
 *
 * @see layout_grid_edit_form().
 */
function layout_grid_edit_formm_validate(&$form, $form_state) {
  if (!preg_match('!(^\d+(px|em)$!', $form_state['values']['width'])) {
    form_set_error('width', t('Only pixel or em based breakpoints are supported, for example 960px or 41em.'));
  }
}
