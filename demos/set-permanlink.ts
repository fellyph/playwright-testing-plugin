import { runCLI, RunCLIServer } from '@wp-playground/cli';

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  login: true,
  blueprint: {
    steps: [
      {
        step: 'writeFile',
        path: '/wordpress/wp-content/mu-plugins/rewrite.php',
        data: "<?php add_action( 'after_setup_theme', function() { global $wp_rewrite; $wp_rewrite->set_permalink_structure('/%postname%/'); $wp_rewrite->flush_rules(); } );",
      },
    ],
  },
});
