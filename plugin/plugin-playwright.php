<?php
/**
* Plugin Name:       Playwright Test Plugin
 * Description:       A minimal plugin for testing with Playwright
 * Version:           1.0.0
 * Author:            Fellyph Cintra
 * Author URI:        https://profiles.wordpress.org/fellyph
 * Text Domain:       playwright-test
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) exit;

function playwright_add_admin_menu() {
    add_menu_page(
        'Playwright Tests',
        'Playwright Tests',
        'manage_options',
        'playwright-tests',
        'playwright_admin_page',
        'dashicons-admin-generic',
        30
    );
}
add_action('admin_menu', 'playwright_add_admin_menu');

function playwright_enqueue_scripts($hook) {
    if ($hook === 'toplevel_page_playwright-tests') {
        wp_enqueue_script('playwright-simple', plugin_dir_url(__FILE__) . 'assets/playwright-simple.js', array('jquery'), '1.0.0', true);
    }
}
add_action('admin_enqueue_scripts', 'playwright_enqueue_scripts');

function playwright_admin_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <div class="form-wrap">
            <form id="contact-form" class="form-table">
                <p>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" class="regular-text" required>
                </p>
                <p>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" class="regular-text" required>
                </p>
                <p>
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="4" class="large-text" required></textarea>
                </p>
                <p>
                    <button type="submit" class="button button-primary">Send Message</button>
                </p>
            </form>
        </div>
        
        <h2>Messages</h2>
        <div id="messages-list"></div>
        
        <h2>Test Actions</h2>
        <p>
            <button id="add-fake-data" class="button button-secondary">Add Fake Data</button>
            <button id="clear-messages" class="button button-secondary">Clear All</button>
        </p>
    </div>
    <?php
}
