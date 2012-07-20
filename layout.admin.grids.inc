<?php

/**
 * @file
 * Responsive layout builder tool administration interface for grids.
 */

/**
 * Administration page for the grid list.
 */
function layout_admin_grids() {
  drupal_set_title(t('Responsive grids'));
  $grids = layout_get_grids();
  return drupal_get_form('layout_admin_grids_form', $grids);
}

/**
 * Form callback to generate basic grid editor.
 *
 * @see layout_admin_grids_form_submit()
 */
function layout_admin_grids_form($form, $form_state, $grids) {
  $form = array();
  $form['breakpoints'] = array(
    '#type' => 'container',
    '#tree' => TRUE,
  );
  foreach ($grids as $machine_name => $grid) {
    $form['breakpoints'][$machine_name] = array(
      '#type' => 'fieldset',
      '#title' => $grid->width . ' (' . $grid->label . ')',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    );
    $form['breakpoints'][$machine_name] += layout_admin_grids_form_element(array('breakpoints', $machine_name), $grid);
    $form['breakpoints'][$machine_name] += array(
      'remove' => array(
        '#type' => 'checkbox',
        '#title' => t('Remove breakpoint'),
      ),
    );
  }

  $form['new_breakpoint'] = array(
    '#type' => 'fieldset',
    '#title' => t('Add new breakpoint'),
    '#tree' => TRUE,
  );
  $form['new_breakpoint'] += layout_admin_grids_form_element(array('new_breakpoint'));

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Save grids',
  );
  return $form;
}

/**
 * Form component for one breakpoint/grid configuration.
 *
 * @param $form_parents
 *   Array with parents of the element. Used to set up the machine_name
 *   source properly.
 * @param $grid
 *   (optional) Grid data object.
 */
function layout_admin_grids_form_element($form_parents, $grid = NULL) {
  $form = array();
  $form['label'] = array(
    '#type' => 'textfield',
    '#title' => t('Breakpoint label'),
    '#description' => t("Examples: smartphone, tablet, desktop"),
    '#default_value' => @$grid->label,
  );
  $form['machine_name'] = array(
    '#title' => t('Breakpoint machine name'),
    '#type' => 'machine_name',
    '#maxlength' => 32,
    '#machine_name' => array(
      'exists' => 'layout_grid_load',
      'source' => array_merge($form_parents, array('label')),
    ),
    '#default_value' => @$grid->machine_name,
    '#description' => t('The breakpoint machine name is used to identify the breakpoint in layouts, making it possible to set up different layouts for each breakpoint.'),
  );
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
  return $form;
}

/**
 * Form submission function for layout_admin_grids_form().
 *
 * @see layout_admin_grids_form()
 */
function layout_admin_grids_form_submit($form, $form_state) {
  $new_grids = array();
  if (isset($form_state['values']['breakpoints'])) {
    $new_grids = $form_state['values']['breakpoints'];
  }
  if (!empty($form_state['values']['new_breakpoint']['width'])) {
    $new_grids[$form_state['values']['new_breakpoint']['machine_name']] = $form_state['values']['new_breakpoint'];
  }

  // Remove any grids that have the remove checkbox checked and
  // convert the grid arrays to objects for common storage.
  $grids = array();
  foreach ($new_grids as $index => $grid) {
    if (empty($grid['remove'])) {
      $grids[$grid['machine_name']] = (object) $grid;
    }
  }

  // Sort the grids by width.
  uasort($grids, 'layout_admin_grids_sort');

  // Save grids.
  layout_set_grids(array_values($grids));

  drupal_set_message(t('Saved all grid changes.'));
}

/**
 * Sort the grids in ascending order by their width.
 */
function layout_admin_grids_sort($a, $b) {
  // Cast the width to int. Whether it provided as px or em, the cast should
  // result in a relevant number. It will not sort mixed em/px numbers properly
  // but that sounds like a broken setup. Not desigining for that.
  if ((int) $a->width == (int) $b->width) {
    return 0;
  }
  return ((int) $a->width < (int) $b->width) ? -1 : 1;
}
