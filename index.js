const minimist = require('minimist')

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  const params = Object.assign({}, args);
  delete params._;

  const cmd = args._[0];
  const file = args._[1];
  const fileName = args._[2];

  const MAPPED_KEYS = [
    {
      name: 'generate',
      aliases: ['generate', 'gen', 'g', 'new']
    }, {
      name: 'delete',
      aliases: ['delete', 'del', 'd', 'destroy']
    }
  ];

  let command = MAPPED_KEYS.find((mappedKey) => {
    return mappedKey.aliases.includes(cmd);
  });

  switch (command.name) {
    case 'generate':
      require('./commands/generate')(file, fileName, params);
      break;
    case 'delete':
      require('./commands/delete')(file, fileName, params);
      break;
    default:
      console.error(`"${cmd}" is not a valid command!`)
      break;
  }
}
