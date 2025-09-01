import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

test.describe('set-wordpress-logged', () => {
    let cliServer: RunCLIServer;

    test.afterEach(async () => {
        if(cliServer) {
            await cliServer.server.close();
        }
    });

	test('should check if user is logged in to WordPress', async () => {
		cliServer = await runCLI({
			command: 'server',
			login: true,
		} as RunCLIArgs);

		// Check if we're logged in by accessing wp-admin
		const response = await cliServer.playground.request({
			url: '/wp-admin/index.php',
			method: 'GET',
		});
		
		// If logged in, we should be redirected to wp-admin/index.php
		// If not logged in, we should be redirected to wp-login.php
		expect(response.httpStatusCode).toBe(302);
		
		// Check if we're actually in the admin area (not login page)
		const location = response.headers.location[0];

		expect(location).toContain('/wp-admin/');
		expect(location).not.toContain('wp-login.php');
	});

	test('should redirect to wp-login.php if user is not logged in to WordPress', async () => {
		cliServer = await runCLI({
			command: 'server',
			login: false,
		} as RunCLIArgs);

		// Check if we're logged in by accessing wp-admin
		const response = await cliServer.playground.request({
			url: '/wp-admin/index.php',
			method: 'GET',
		});
		
		// If logged in, we should be redirected to wp-admin/index.php
		// If not logged in, we should be redirected to wp-login.php
		expect(response.httpStatusCode).toBe(302);
		
		// Check if we're actually in the admin area (not login page)
		const location = response.headers.location[0];
		expect(location).toContain('wp-login.php');
		expect(location).not.toContain('/wp-admin/');
	});
});