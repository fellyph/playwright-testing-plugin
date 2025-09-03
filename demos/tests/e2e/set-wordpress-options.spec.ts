import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from '@wp-playground/cli';

test.describe('set-wordpress-options', () => {
  let cliServer: RunCLIServer;

  test.afterEach(async () => {
    if (cliServer) {
      await cliServer.server.close();
    }
  });

  test('should set WordPress site title to "blueprint test"', async () => {
    const expectedTitle = 'blueprint test';

    cliServer = await runCLI({
      command: 'server',
      blueprint: {
        steps: [
          {
            step: 'setSiteOptions',
            options: {
              blogname: expectedTitle,
              blogdescription: 'A great blog description',
            },
          },
        ],
      },
    } as RunCLIArgs);

    // Create a PHP file to check the site title
    await cliServer.playground.writeFile(
      '/wordpress/check-title.php',
      `<?php
            require_once '/wordpress/wp-load.php';
            echo get_option('blogname');
            ?>`
    );

    const response = await cliServer.playground.request({
      url: '/check-title.php',
      method: 'GET',
    });

    expect(response.httpStatusCode).toBe(200);
    expect(response.text.trim()).toBe(expectedTitle);
  });
});
