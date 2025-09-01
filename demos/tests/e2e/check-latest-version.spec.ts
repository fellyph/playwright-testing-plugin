import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

test.describe('check-latest-version', () => {
    let cliServer: RunCLIServer;

    test.afterEach(async () => {
        if(cliServer) {
            await cliServer.server.close();
        }
    });

	const phpCode = `<?php
				require_once '/wordpress/wp-load.php';
				echo get_bloginfo("version");
			?>`;

	const wordpressVersions = ['6.4', '6.5', '6.6', '6.7', '6.8'];

	for (const wpVersion of wordpressVersions) {
		test(`should set WordPress site Version to ${wpVersion}`, async () => {
			cliServer = await runCLI({
				command: 'server',
				wp: wpVersion,
			} as RunCLIArgs);

			await cliServer.playground.writeFile(
				'/wordpress/version.php',
				phpCode
			);
			
			const response = await cliServer.playground.request({
				url: '/version.php',
				method: 'GET',
			});
			
			expect(response.httpStatusCode).toBe(200);
			expect(response.text.trim()).toContain(wpVersion);
		});
	}
});