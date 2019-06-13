import Command from '../Core/Command'
import Bot from '../Core/Bot'
import {Message} from 'discord.js'

export default class Ping extends Command {
	constructor(bot: Bot) {
		super(bot, 'ping')
	}

	match(message: Message): boolean {
		return message.content.startsWith('!ping')
	}

	async action(message: Message): Promise<string | string[] | null> {
		const ping = await message.channel.send('Ping ?') as Message
		return ping.edit(`Pong ! (${ping.createdTimestamp - message.createdTimestamp}ms)`)
		  .then(() => null)
	}
}