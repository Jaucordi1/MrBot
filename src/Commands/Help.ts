import Bot from '../Core/Bot'
import {Message} from 'discord.js'
import Command from '../Core/Command'

export default class Help extends Command {
	constructor(bot: Bot) {
		super(bot, 'help')
	}

	match(message: Message): boolean {
		return message.content.startsWith('!help')
	}

	action(message: Message): Promise<string | string[] | null> {
		const commands = [...Command.list.values()]
		return message
		  .reply(`Voici les commandes que je connais: \n\n${commands.map(cmd => '- ' + cmd.name).join('\n')}`)
		  .catch(o_O => console.error("Can't help because: ", o_O))
		  .then(() => null)
	}
}