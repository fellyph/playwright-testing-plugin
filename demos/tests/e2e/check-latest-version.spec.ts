import { test, expect } from '@playwright/test';
import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

test.describe('set-wordpress-language', () => {
    let cliServer: RunCLIServer;

    test.afterEach(async () => {
        if(cliServer) {
            await cliServer.server.close();
        }
    });

	test('should set WordPress site language to Portuguese (Brazil)', async () => {
		const expectedLanguage = 'pt_BR';
		
		cliServer = await runCLI({
			command: 'server',
			wp: 'latest',
			blueprint: {
				steps: [
					{
						"step": "setSiteLanguage",
						"language": "pt_BR"
					},
				],
			},
		} as RunCLIArgs);
		
		const response = await cliServer.playground.request({
			url: '/',
			method: 'GET',
		});
		
		expect(response.httpStatusCode).toBe(200);
		expect(response.text.trim()).toBe(expectedLanguage);
	});
});
