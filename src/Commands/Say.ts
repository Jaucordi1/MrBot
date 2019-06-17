import Bot from '../Core/Bot'
import {Message} from 'discord.js'
import Command from '../Core/Command'

export default class Say extends Command {
	constructor(bot: Bot) {
		super(bot, 'say')
	}

	match(message: Message): boolean {
		return message.content.startsWith('!say ') || message.content.startsWith('!everyone ')
	}

	action(message: Message): Promise<string | string[] | null> {
		const msg = this.getArgs(message).join(' ')
		if (this.getAliasUsed(message) !== 'everyone')
			return Promise.resolve(msg)

		return message.channel.send(`@everyone ${msg}`).then(() => null)
	}
}