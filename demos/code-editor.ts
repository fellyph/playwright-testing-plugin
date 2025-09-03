import { runCLI, RunCLIServer } from '@wp-playground/cli';

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  login: true,
  blueprint: {
    steps: [
      {
        step: 'login',
        username: 'admin',
        password: 'password',
      },
      {
        step: 'installPlugin',
        pluginData: {
          resource: 'wordpress.org/plugins',
          slug: 'interactive-code-block',
        },
      },
      {
        step: 'runPHP',
        code: "<?php require '/wordpress/wp-load.php'; wp_insert_post(['post_title' => 'WordPress Playground block demo!','post_content' => '<!-- wp:wordpress-playground/playground /-->', 'post_status' => 'publish', 'post_type' => 'post',]);",
      },
    ],
  },
});
