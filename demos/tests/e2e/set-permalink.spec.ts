import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from '@wp-playground/cli';

test.describe('set-permalink', () => {
  let cliServer: RunCLIServer;

  test.afterEach(async () => {
    if (cliServer) {
      await cliServer.server.close();
    }
  });

  test('should set WordPress permalink structure to "/%postname%/"', async () => {
    const postUrl = '/hello-world/';

    cliServer = await runCLI({
      command: 'server',
      blueprint: {
        steps: [
          {
            step: 'writeFile',
            path: '/wordpress/wp-content/mu-plugins/rewrite.php',
            data: "<?php add_action( 'after_setup_theme', function() { global $wp_rewrite; $wp_rewrite->set_permalink_structure('/%postname%/'); $wp_rewrite->flush_rules(); } );",
          },
        ],
      },
    } as RunCLIArgs);

    const response = await cliServer.playground.request({
      url: postUrl,
      method: 'GET',
    });

    expect(response.httpStatusCode).toBe(200);
    expect(response.text).toContain('Hello world');
  });
});
