import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

test.describe('check-wp-cli', () => {
    let cliServer: RunCLIServer;

    test.afterEach(async () => {
        if(cliServer) {
            await cliServer.server.close();
        }
    });

	test('should set create a post with wp-cli', async () => {
		const expectedTitle = 'Welcome to Playground';

		cliServer = await runCLI({
			command: 'server',
			blueprint: {
				steps: [
					{
						"step": "wp-cli",
						"command": `wp post create --post_title='${expectedTitle}' --post_status='published' --post_type='post' --post_content='This is a test post created by the blueprint'`
					},
				],
			},
		} as RunCLIArgs);
		
		const response = await cliServer.playground.request({
			url: '/',
			method: 'GET',
		});
		
		expect(response.httpStatusCode).toBe(200);
		expect(response.text.trim()).toContain(expectedTitle);
	});
});