import fs from 'fs'
import Command from './Command'
import Say from '../Commands/Say'
import {Config} from '../../types'
import Ping from '../Commands/Ping'
import Help from '../Commands/Help'
import Info from '../Commands/Info'
import SoundboxCommand from '../Commands/SoundboxCommand'
import Discord, {ActivityOptions, Client, Guild, Message, VoiceChannel} from 'discord.js'

export default class Bot {

	/** Discord Client */
	private _client: Client
	private soundboxCmd: SoundboxCommand
	/**
	 * Bot constructor
	 * @param {Config} config
	 */
	constructor(config: Config) {
		this._config = config
		this._client = new Discord.Client()
		this.init()
		this.soundboxCmd = new SoundboxCommand(this)
	}
	/** Bot config */
	private _config: Config
	// GETTERS
	get config(): Config {
		return this._config
	}
	getVoiceChannel(guild: Guild): VoiceChannel | undefined {
		if (this._client.voice === null) return
		const conn = this._client.voice.connections.find(conn => conn.channel.guild.id === guild.id)
		if (conn === undefined) return
		return conn.channel
	}
	setActivity(options?: ActivityOptions) {
		this._client.user!.setActivity(options).catch(o_O => console.error("Can't set activity because:", o_O))
	}
	quit() {
		console.info('Quitting bot !')
		if (this.soundboxCmd.getSoundBox().needToSave)
			this.saveConfig()
		this._client.guilds.forEach(guild => {
			if (guild.voice !== null && guild.voice.channel !== null)
				guild.voice.channel.leave()
		})
	}
	// INITIALISATION
	private init() {
		this.initCommands()

		this._client.on('ready', this.greetings.bind(this))
		this._client.on('message', this.onMessage.bind(this))
		this._client.setInterval(this.saveConfig.bind(this), 1000 * 30)

		this._client.login(this._config.token).catch(reason => console.error("Client login failed because:", reason))
	}
	private initCommands() {
		new Ping(this)
		new Help(this)
		new Info(this)
		new Say(this)
	}
	// ACTIONS
	private greetings() {
		console.info('Je suis prêt !')
		this.setActivity()
		/*const channel = this.client.channels.find(channel => channel.type === 'text' && (channel as TextChannel).members.size > 0) as TextChannel
		if (channel === undefined) {
			console.error("Aucune channel textuel pour dire bonjour ? o_O")
			return false
		}
		channel.send("Me revoilà !").catch(reason => console.error("Can't say hello because: ", reason))*/
	}
	private saveConfig() {
		const soundbox = (Command.list.get('soundbox')! as SoundboxCommand).getSoundBox()
		if (!soundbox.needToSave) return

		soundbox.needToSave = false

		console.info('Saving config…')
		this._config.sounds = soundbox.toJSON()
		const json = JSON.stringify(this._config)
		fs.writeFile(
		  './config.json', json, 'utf8',
		  err => err !== null && console.error("Can't save config file because:", err.message)
		)
	}
	// EVENTS
	private onMessage(message: Message) {
		// Avoid parsing bots
		if (message.author === null || message.author.bot) return

		// Message is command
		if (message.content.startsWith('!') && message.content.length > 1) return this.onCommand(message)

		// React to @ mention of bot
		if (message.mentions.has(this._client.user!)) return this.onMention(message)

		// React to mention of bot's name
		if (message.content.toLocaleLowerCase().search('mrbot') > -1) return this.onFalseMention(message)

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
	private onMention(message: Message) {
		message.reply("Me mentionnes pas stp j'ai autre chose à faire là..")
		  .catch(o_O => console.error("Can't answer to mention because:", o_O))
	}
	private onFalseMention(message: Message) {
		message.reply("Parles pas des gens sans les mentionner stp, c'est malpoli !")
		  .catch(o_O => console.error("Can't answer to false mention because:", o_O))
	}
}