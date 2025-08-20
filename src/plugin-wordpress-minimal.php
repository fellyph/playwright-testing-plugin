<?php
/*
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

class PlaywrightMinimalPlugin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_ajax_submit_contact_form', array($this, 'handle_contact_form'));
        add_action('wp_ajax_nopriv_submit_contact_form', array($this, 'handle_contact_form'));
        add_shortcode('playwright_contact_form', array($this, 'contact_form_shortcode'));
        register_activation_hook(__FILE__, array($this, 'activate'));
    }
    
    public function activate() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'playwright_contacts';
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            message text NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Playwright Test',
            'Playwright Test',
            'manage_options',
            'playwright-test',
            array($this, 'admin_page'),
            'dashicons-testimonial',
            30
        );
    }
    
    public function admin_page() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'playwright_contacts';
        $contacts = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
        
        ?>
        <div class="wrap">
            <h1>Playwright Test Plugin</h1>
            
            <h2>Contact Form Submissions</h2>
            <?php if (empty($contacts)): ?>
                <p>No submissions yet.</p>
            <?php else: ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($contacts as $contact): ?>
                            <tr>
                                <td><?php echo esc_html($contact->name); ?></td>
                                <td><?php echo esc_html($contact->email); ?></td>
                                <td><?php echo esc_html($contact->message); ?></td>
                                <td><?php echo esc_html($contact->created_at); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
            
            <h2>Test Actions</h2>
            <p>
                <button id="clear-submissions" class="button button-secondary">Clear All</button>
                <button id="add-test-data" class="button button-primary">Add Test Data</button>
            </p>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            $('#clear-submissions').on('click', function() {
                $.post(ajaxurl, {
                    action: 'clear_submissions',
                    nonce: '<?php echo wp_create_nonce("playwright_admin_nonce"); ?>'
                }, function(response) {
                    if (response.success) location.reload();
                });
            });
            
            $('#add-test-data').on('click', function() {
                $.post(ajaxurl, {
                    action: 'add_test_data',
                    nonce: '<?php echo wp_create_nonce("playwright_admin_nonce"); ?>'
                }, function(response) {
                    if (response.success) location.reload();
                });
            });
        });
        </script>
        <?php
    }
    
    public function contact_form_shortcode($atts) {
        $atts = shortcode_atts(array('title' => 'Contact Us'), $atts);
        
        ob_start();
        ?>
        <div class="playwright-contact-form">
            <h3><?php echo esc_html($atts['title']); ?></h3>
            <form id="playwright-contact-form">
                <p>
                    <label for="playwright-name">Name:</label>
                    <input type="text" id="playwright-name" name="name" class="regular-text" required>
                </p>
                
                <p>
                    <label for="playwright-email">Email:</label>
                    <input type="email" id="playwright-email" name="email" class="regular-text" required>
                </p>
                
                <p>
                    <label for="playwright-message">Message:</label>
                    <textarea id="playwright-message" name="message" rows="4" class="large-text" required></textarea>
                </p>
                
                <p>
                    <button type="submit" class="button button-primary">Send Message</button>
                </p>
            </form>
            
            <div id="playwright-form-response"></div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            $('#playwright-contact-form').on('submit', function(e) {
                e.preventDefault();
                
                var $form = $(this);
                var $submitBtn = $form.find('.button-primary');
                var $response = $('#playwright-form-response');
                
                var formData = {
                    action: 'submit_contact_form',
                    nonce: '<?php echo wp_create_nonce("playwright_nonce"); ?>',
                    name: $('#playwright-name').val(),
                    email: $('#playwright-email').val(),
                    message: $('#playwright-message').val()
                };
                
                $submitBtn.prop('disabled', true).text('Sending...');
                $response.html('');
                
                $.post('<?php echo admin_url("admin-ajax.php"); ?>', formData, function(response) {
                    if (response.success) {
                        $response.html('<div class="notice notice-success"><p>' + response.data + '</p></div>');
                        $form[0].reset();
                    } else {
                        $response.html('<div class="notice notice-error"><p>' + response.data + '</p></div>');
                    }
                }).fail(function() {
                    $response.html('<div class="notice notice-error"><p>An error occurred. Please try again.</p></div>');
                }).always(function() {
                    $submitBtn.prop('disabled', false).text('Send Message');
                });
            });
        });
        </script>
        <?php
        return ob_get_clean();
    }
    
    public function handle_contact_form() {
        check_ajax_referer('playwright_nonce', 'nonce');
        
        $name = sanitize_text_field($_POST['name']);
        $email = sanitize_email($_POST['email']);
        $message = sanitize_textarea_field($_POST['message']);
        
        if (empty($name) || empty($email) || empty($message)) {
            wp_send_json_error('All fields are required.');
        }
        
        if (!is_email($email)) {
            wp_send_json_error('Please enter a valid email address.');
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'playwright_contacts';
        
        $result = $wpdb->insert(
            $table_name,
            array('name' => $name, 'email' => $email, 'message' => $message),
            array('%s', '%s', '%s')
        );
        
        if ($result === false) {
            wp_send_json_error('Failed to save message. Please try again.');
        }
        
        wp_send_json_success('Message sent successfully!');
    }
}

new PlaywrightMinimalPlugin();

// Admin AJAX handlers
add_action('wp_ajax_clear_submissions', 'playwright_clear_submissions');
add_action('wp_ajax_add_test_data', 'playwright_add_test_data');

function playwright_clear_submissions() {
    check_ajax_referer('playwright_admin_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error('Unauthorized');
    
    global $wpdb;
    $wpdb->query("TRUNCATE TABLE {$wpdb->prefix}playwright_contacts");
    wp_send_json_success('All submissions cleared');
}

function playwright_add_test_data() {
    check_ajax_referer('playwright_admin_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error('Unauthorized');
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'playwright_contacts';
    
    $test_data = array(
        array('John Doe', 'john@example.com', 'Test message from John'),
        array('Jane Smith', 'jane@example.com', 'Test message from Jane'),
        array('Bob Johnson', 'bob@example.com', 'Test message from Bob')
    );
    
    foreach ($test_data as $data) {
        $wpdb->insert($table_name, array('name' => $data[0], 'email' => $data[1], 'message' => $data[2]), array('%s', '%s', '%s'));
    }
    
    wp_send_json_success('Test data added successfully');
}
