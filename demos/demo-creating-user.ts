import { runCLI, RunCLIServer } from '@wp-playground/cli';

let cliServer: RunCLIServer;
const userData = {
  firstName: 'John',
  lastName: 'Doe',
  nickname: 'Johny',
  description: 'This is the biographical info from John Doe.',
  adminColor: 'midnight',
  userId: 1,
};

cliServer = await runCLI({
  command: 'server',
  wp: 'latest',
  login: true,
  blueprint: {
    steps: [
      {
        step: 'updateUserMeta',
        meta: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          admin_color: userData.adminColor,
          nickname: userData.nickname,
          description: userData.description,
        },
        userId: userData.userId,
      },
    ],
  },
});
