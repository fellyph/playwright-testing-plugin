import { runCLI, RunCLIArgs, RunCLIServer } from "@wp-playground/cli";

let cliServer: RunCLIServer;

cliServer = await runCLI({
    command: 'server',
    php: '8.3',
    wp: 'latest',
    login: true,
    mount: [
        {
            "hostPath": "./plugin-dependecies/",
            "vfsPath": "/wordpress/wp-content/plugins/playwright-test"
        }
    ],
    blueprint: {
        steps: [
            {   
            "step": "installPlugin",
                "pluginData": {
                    "resource": "wordpress.org/plugins",
                    "slug": "ai-services"
                },
                "options": {
                    "activate": true
                },
            },
            {
                "step": "activatePlugin",
                "pluginPath": "/wordpress/wp-content/plugins/playwright-test/plugin-playwright.php"
            },
            
        ],
    }
} as RunCLIArgs);
