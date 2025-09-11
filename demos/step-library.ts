import { runCLI, RunCLIServer } from '@wp-playground/cli';
import PlaygroundStepLibrary from 'playground-step-library';

const compiler = new PlaygroundStepLibrary();

let cliServer: RunCLIServer;

cliServer = await runCLI({
  command: 'server',
  wp: 'latest',
  login: true,
  blueprint: compiler.compile(
    {
      steps: [
        {
          step: 'addPost',
          postTitle: 'Welcome to Playground',
          postStatus: 'publish',
          postType: 'post',
          postContent: 'This is a test post created by the blueprint',
        },
      ],
    }
  ),
});
