import { runCLI, RunCLIArgs, RunCLIServer } from '@wp-playground/cli';
import type { BlueprintDeclaration } from '@wp-playground/blueprints';

let cliServer: RunCLIServer;
const myBlueprint: BlueprintDeclaration = {
  landingPage: '/wp-admin/',
  steps: [
    {
      step: 'writeFile',
      path: '/wordpress/wp-content/mu-plugins/bgnightly-notice.php',
      data: "<?php add_action('admin_notices', function() {  echo '<div class=\"notice notice-info is-dismissible\"><p>Hello from Playground.</p></div>'; });",
    },
  ],
};

cliServer = await runCLI({
  command: 'server',
  php: '8.3',
  wp: 'latest',
  login: true,
  blueprint: myBlueprint,
} as RunCLIArgs);
