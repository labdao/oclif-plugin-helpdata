import {Command, Flags} from '@oclif/core'
import HelpData from '../helpdata'

export default class HelpDataCommand extends Command {
  static description = 'Emit help as structured data.'

  static flags = {
    'nested-commands': Flags.boolean({
      description: 'Include all nested commands in the output.',
      char: 'n',
    }),
  }

  static args = [
    {name: 'command', required: false, description: 'Command to show help for.'},
  ]

  static strict = false

  async run(): Promise<void> {
    const {flags, argv} = await this.parse(HelpDataCommand)
    const help = new HelpData(this.config, {all: flags['nested-commands']})
    await help.showHelp(argv)
  }
}
