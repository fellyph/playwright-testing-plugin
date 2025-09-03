import { runCLI, RunCLIServer } from '@wp-playground/cli';

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  php: '8.3',
  wp: 'https://playground.wordpress.net/plugin-proxy.php?url=https://wordpress.org/wordpress-6.2.1.zip',
  login: true,
});
