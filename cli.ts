import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs(hideBin(process.argv))
  .scriptName('webScraper')
  .command('[url]', 'URL to download', (yargs) => {
    return yargs.positional
  })
  .options({
    e: {
      alias: 'encrypt',
      describe: 'Encrypt the file',
      string: true,
      requiresArg: true,
      example: ('$0 -e <filename>')
    }
  }).showHelpOnFail(true, 'Specify --help for available options').parse()
