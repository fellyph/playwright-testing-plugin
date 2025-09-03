import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from '@wp-playground/cli';

test.describe('set-wordpress-language', () => {
  let cliServer: RunCLIServer;

  test.afterEach(async () => {
    if (cliServer) {
      await cliServer.server.close();
    }
  });

  test('should set WordPress site language to Portuguese (Brazil)', async () => {
    const expectedLanguage = 'pt_BR';

    cliServer = await runCLI({
      command: 'server',
      blueprint: {
        steps: [
          {
            step: 'setSiteLanguage',
            language: 'pt_BR',
          },
        ],
      },
    } as RunCLIArgs);

    // Create a PHP file to check the site language
    await cliServer.playground.writeFile(
      '/wordpress/check-language.php',
      `<?php
            	require_once '/wordpress/wp-load.php';
            	echo get_locale();
            ?>`
    );

    const response = await cliServer.playground.request({
      url: '/check-language.php',
      method: 'GET',
    });

    expect(response.httpStatusCode).toBe(200);
    expect(response.text.trim()).toBe(expectedLanguage);
  });
});
