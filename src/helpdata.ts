import {Help, Interfaces} from '@oclif/core'

const helpFlags = ['--help']

export function getHelpFlagAdditions(config: Interfaces.Config): string[] {
  const additionalHelpFlags = config.pjson.oclif.additionalHelpFlags ?? []
  return [...new Set([...helpFlags, ...additionalHelpFlags]).values()]
}

export default class HelpData extends Help {
  protected async showRootHelp(): Promise<any> {
    let rootTopics = this.sortedTopics
    let rootCommands = this.sortedCommands

    const state = this.config.pjson?.oclif?.state
    if (state) console.log(`${this.config.bin} is in ${state}.\n`)

    if (!this.opts.all) {
      rootTopics = rootTopics.filter(t => !t.name.includes(':'))
      rootCommands = rootCommands.filter(c => !c.id.includes(':'))
    }

    if (rootCommands.length > 0) {
      rootCommands = rootCommands.filter(c => c.id)
    }

    console.log(JSON.stringify({
      type: 'root',
      // help: roothelp,
      topics: rootTopics,
      commands: rootCommands,
    }))
  }

  protected async showTopicHelp(topic: Interfaces.Topic): Promise<any> {
    const name = topic.name
    const depth = name.split(':').length

    const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1)
    const commands = this.sortedCommands.filter(c => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1)

    const state = this.config.pjson?.oclif?.state

    console.log(JSON.stringify({
      type: 'topics',
      name,
      depth,
      topic,
      subTopics,
      commands,
      state,
    }))
  }

  public async showCommandHelp(command: Interfaces.Command): Promise<any> {
    const name = command.id
    const depth = name.split(':').length

    const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1)
    const subCommands = this.sortedCommands.filter(c => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1)
    const plugin = this.config.plugins.find(p => p.name === command.pluginName)

    const state = this.config.pjson?.oclif?.state || plugin?.pjson?.oclif?.state || command.state

    const summary = this.summary(command)

    console.log(JSON.stringify({
      type: 'command',
      name,
      summary,
      depth,
      subTopics,
      subCommands,
      plugin,
      state,
    }))
  }
}
