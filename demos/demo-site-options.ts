import { runCLI, RunCLIServer } from "@wp-playground/cli";

let cliServer: RunCLIServer;

cliServer = await runCLI({
	command: 'server',
	blueprint: {
		steps: [
        {
            "step": "setSiteOptions",
            "options": {
              "blogname": "My first runCLI Website",
              "blogdescription": "A great blog description"
            }
        }
			],
		},
});
