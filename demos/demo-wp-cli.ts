import { runCLI, RunCLIServer } from '@wp-playground/cli';

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  wp: 'latest',
  login: true,
  blueprint: {
    steps: [
      {
        step: 'wp-cli',
        command: `wp post create --post_title='Welcome to Playground' --post_status='published' --post_type='post' --post_content='This is a test post created by the blueprint'`,
      },
    ],
  },
});
