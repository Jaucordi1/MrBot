import Discord, {DMChannel, Message} from 'discord.js'

const config = require('../config.json')

function extractCommandString(msg: string): { command: string, args: string[] } {
	const parts = msg.substring(1).split(' ')
	const cmd = parts.shift()
	return {
		command: cmd!,
		args: parts
	}
}

function isValidCommand(message: Message): boolean {
	return message.member !== null
}

function parseCommand(message: Message) {
	if (!isValidCommand(message)) return

	const member = message.member!
	const channel = message.channel
	const {command, args} = extractCommandString(message.content)

	const channelName = (channel instanceof DMChannel) ? 'DM' : channel.name
	console.info(`${member.displayName} send command in ${channelName}: !${command} ${args}`)
}

function parseMessage(message: Message) {
	if (message.content.startsWith('!') && message.content.length > 1) return parseCommand(message)

	// Do other things ig you want
}

const client = new Discord.Client()

// Ready & Exit bindings
client.on('ready', () => console.info('I am ready !'))

// Message sent binding
client.on('message', parseMessage)

// Log bot in
client.login(config.token).catch(reason => console.error("Client login failed because:", reason))