import Bot from '../Core/Bot'
import {Message} from 'discord.js'
import Command from '../Core/Command'

export default class Say extends Command {
	constructor(bot: Bot) {
		super(bot, 'say')
	}

	match(message: Message): boolean {
		return message.content.startsWith('!say ') || message.content.startsWith('!everyone ') || message.content.startsWith('!tts ')
	}

	async action(message: Message): Promise<string | string[] | null> {
		const {alias, args} = this.split(message)

		switch (alias) {
			case 'say':
				return args.join(' ')
			case 'tts':
				return message.channel.send(args.join(' '), {tts: true})
				  .catch(o_O => console.error("Can't send tts message because:", o_O))
				  .then(() => null)
			case 'everyone':
				return message.channel.send(`@everyone ${args.join(' ')}`)
				  .then(() => null)
		}

		return "WTF ! o_O"
	}
}