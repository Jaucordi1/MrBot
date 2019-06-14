import Command from '../Core/Command'
import Bot from '../Core/Bot'
import {Message} from 'discord.js'

export default class Info extends Command {
	constructor(bot: Bot) {
		super(bot, 'info')
	}

	match(message: Message): boolean {
		return message.content.startsWith('!info')
	}

	action(message: Message): Promise<string | string[] | null> {
		return message
		  .reply("Tu m'as pris pour Jean-Pierre Pernaut ? Va chercher tes infos sur google poto !")
		  .catch(o_O => console.error("Can't reply to info command because:", o_O))
		  .then(() => null)
	}
}