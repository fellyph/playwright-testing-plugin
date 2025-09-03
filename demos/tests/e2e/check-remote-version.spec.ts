import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from '@wp-playground/cli';

test.describe('check-remote-version', () => {
  let cliServer: RunCLIServer;
  const wpVersion = '6.2.1';
  test.afterEach(async () => {
    if (cliServer) {
      await cliServer.server.close();
    }
  });

  const phpCode = `<?php
				require_once '/wordpress/wp-load.php';
				echo get_bloginfo("version");
			?>`;

  test(`should set WordPress site Version to ${wpVersion}`, async () => {
    cliServer = await runCLI({
      command: 'server',
      wp: `https://playground.wordpress.net/plugin-proxy.php?url=https://wordpress.org/wordpress-${wpVersion}.zip`,
    } as RunCLIArgs);

    await cliServer.playground.writeFile('/wordpress/version.php', phpCode);

    const response = await cliServer.playground.request({
      url: '/version.php',
      method: 'GET',
    });

    expect(response.httpStatusCode).toBe(200);
    expect(response.text.trim()).toContain(wpVersion);
  });
});
