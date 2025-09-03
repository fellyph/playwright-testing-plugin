import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from '@wp-playground/cli';

test.describe('set-wordpress-theme', () => {
  let cliServer: RunCLIServer;

  test.afterEach(async () => {
    if (cliServer) {
      await cliServer.server.close();
    }
  });

  test('should set WordPress Theme to Twenty Twenty One', async () => {
    const expectedTheme = 'twentytwentyone';

    cliServer = await runCLI({
      command: 'server',
      blueprint: {
        steps: [
          {
            step: 'installTheme',
            themeData: {
              resource: 'wordpress.org/themes',
              slug: 'twentytwentyone',
            },
            options: {
              activate: true,
            },
          },
        ],
      },
    } as RunCLIArgs);

    // Create a PHP file to check the activated theme
    await cliServer.playground.writeFile(
      '/wordpress/check-theme.php',
      `<?php
            require_once '/wordpress/wp-load.php';
            $current_theme = wp_get_theme();
            echo $current_theme->get('TextDomain');
            ?>`
    );

    const response = await cliServer.playground.request({
      url: '/check-theme.php',
      method: 'GET',
    });

    expect(response.httpStatusCode).toBe(200);
    expect(response.text.trim()).toBe(expectedTheme);
  });
});
