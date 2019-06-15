import Bot from '../Core/Bot'
import {Message} from 'discord.js'
import Command from '../Core/Command'

export default class Say extends Command {
	constructor(bot: Bot) {
		super(bot, 'say')
	}

	match(message: Message): boolean {
		return message.content.startsWith('!say ')
	}

	action(message: Message): Promise<string | string[] | null> {
		return Promise.resolve(this.getArgs(message).join(' '))
	}
}