import Ping from '../Commands/Ping'
import {DiscordAPIError, DMChannel, Message, TextChannel} from 'discord.js'

type Cmd = Ping

export default class CommandExecutor {
	private cmd: Cmd
	private response: Message[] = []

	constructor(command: Cmd) {
		this.cmd = command
	}

	execute(from: TextChannel | DMChannel, message: Message): boolean {
		this.cmd.action(message)
		  .then(res => {
			if (res !== null) {
				from.send(res, {code: true}).then(response => {
					if (this.cmd.isDelCmdRequired) {
						message.delete().catch(reason => {
							if (reason instanceof DiscordAPIError) {
								console.error('Deleting command message failed with error: ', reason.message)
							} else {
								console.error('Deleting command message failed with error: ', reason.toString())
							}
						})
					}
					if (!this.cmd.isDelResRequired) return

					if (response instanceof Message)
						response = [response]

					this.response = response
					from.bulkDelete(this.response)
					  .catch(reason => console.error("Can't delete command answers because: ", reason))
				})
			} else {
				if (this.cmd.isDelCmdRequired) {
					message.delete().catch(reason => {
						if (reason instanceof DiscordAPIError) {
							console.error('Deleting command message failed with error: ', reason.message)
						} else {
							console.error('Deleting command message failed with error: ', reason.toString())
						}
					})
				}
			}
		})
		  .catch(o_O => console.error("Command failed with error:", o_O))
		return true
	}
}