import Bot from './Bot'
import {Message} from 'discord.js'
import CommandExecutor from './CommandExecutor'

export default class Command {

	static list: Map<string, Command> = new Map()
	readonly name: string
	protected readonly bot: Bot
	protected removeCommand: boolean = true
	protected removeAnswer: boolean = false
	protected removeAnswerAfter: number = 3000

	constructor(bot: Bot, name: string) {
		this.bot = bot
		this.name = name

		Command.list.set(name, this)
	}

	get isDelCmdRequired(): boolean {
		return this.removeCommand
	}
	get isDelResRequired(): boolean {
		return this.removeAnswer
	}
	set delResTimeout(timeout: number | undefined) {
		this.removeAnswer = timeout !== undefined
		this.removeAnswerAfter = timeout || this.removeAnswerAfter
	}
	protected static getAliasUsed(message: Message): string {
		const idx = message.content.indexOf(' ')
		if (idx > -1)
			return message.content.substring(1, idx)
		else
			return message.content.substring(1)
	}
	parse(message: Message): boolean {
		if (this.match(message)) {
			const executor = new CommandExecutor(this)
			return executor.execute(message.channel, message)
		}
		return false
	}
	match(message: Message): boolean {
		return false
	}
	action(message?: Message): Promise<string | string[] | null> {
		return Promise.reject('Not implemented !')
	}
	protected getArgs(message: Message): string[] {
		if (message.content === `!${this.name}`) return []
		const str = message.content.substring(this.name.length + 2)
		return str.split(' ')
	}
}