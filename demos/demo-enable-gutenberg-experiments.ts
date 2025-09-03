import { runCLI, RunCLIServer } from '@wp-playground/cli';

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  blueprint: {
    steps: [
      {
        step: 'runPHP',
        code: "<?php require '/wordpress/wp-load.php'; update_option( 'gutenberg-experiments', array( 'gutenberg-dataviews' => true ) );",
      },
    ],
  },
});
