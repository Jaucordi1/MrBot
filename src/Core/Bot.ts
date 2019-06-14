import Command from './Command'
import {Config} from '../../types'
import Ping from '../Commands/Ping'
import Help from '../Commands/Help'
import Info from '../Commands/Info'
import Discord, {Client, Message} from 'discord.js'

export default class Bot {

	/** Bot config */
	private config: Config
	/** Discord Client */
	private client: Client

	/**
	 * Bot constructor
	 * @param {Config} config
	 */
	constructor(config: Config) {
		this.config = config
		this.client = new Discord.Client()
		this.init()
	}

	// INITALISATION
	private init() {
		this.initCommands()

		this.client.on('ready', this.greetings.bind(this))
		this.client.on('message', this.onMessage.bind(this))

		this.client.login(this.config.token).catch(reason => console.error("Client login failed because:", reason))
	}
	private initCommands() {
		new Ping(this)
		new Help(this)
		new Info(this)
	}

	// EVENTS
	private onMessage(message: Message) {
		// Avoid parsing bots
		if (message.author === null || message.author.bot) return

		// Message is command
		if (message.content.startsWith('!') && message.content.length > 1) return this.onCommand(message)

		// Do other things if you want
	}
	private onCommand(message: Message) {
		// Getting Command[]
		const commands = [...Command.list.values()]
		// Searching for matching command
		const cmd = commands.find(cmd => cmd.parse(message))
		// No commands match
		if (cmd === undefined) return message.reply("J'ai pas compris, tu parles de quoi ?")
	}

	// ACTIONS
	private greetings() {
		/*const channel = this.client.channels.find(channel => channel.type === 'text' && (channel as TextChannel).members.size > 0) as TextChannel
		if (channel === undefined) {
			console.error("Aucune channel textuel pour dire bonjour ? o_O")
			return false
		}
		channel.send("Me revoilà !").catch(reason => console.error("Can't say hello because: ", reason))*/
	}
}