import Bot from '../Core/Bot'
import Command from '../Core/Command'
import {GuildMember, Message} from 'discord.js'
import SoundBox, {Sound, SoundResolver} from '../Sounds/SoundBox'

export default class SoundboxCommand extends Command {

	private soundbox: SoundBox

	constructor(bot: Bot) {
		super(bot, 'soundbox')

		this.soundbox = new SoundBox(bot)
	}

	match(message: Message): boolean {
		if (message.content.startsWith('!stop')) return true
		if (message.content.startsWith('!soundbox')) return true

		if (this.soundbox.soundList.has(this.getAliasUsed(message))) return true
		return this.getArgs(message).length > 0
	}

	async action(message: Message): Promise<string | string[] | null> {
		if (message.member === null) return null
		const member = message.member
		const {alias, args} = this.split(message)

		if (alias === 'stop') return this.stop(member)
		if (alias === 'soundbox') {
			if (args[0] === 'list') return ["Liste des sons enregistrés:", [...this.soundbox.soundList.entries()].map(entry => `!${entry[0]} -- ${entry[1].title}`).join('\n')]
			if (args[0] === 'help') return [
				"Différents usages de la SoundBox:\n",
				"!<nom_du_son> -- Jouer un son",
				"!<nom_du_son> <lien_du_son> -- Ajouter un son",
				"!<nom_du_son> remove -- Supprimer un son",
				"!soundbox list -- Lister les sons",
				"!soundbox help -- Afficher cette aide"
			]
		}

		let sound = SoundResolver.find(this.soundbox, alias)
		if (args.length === 0) {
			if (sound === undefined) return `Le son '${alias}' n'existe pas, tu peux le rajouter à la SoundBox en renvoyant la commande avec le lien de la vidéo après (!${alias} <link>)`
			return this.play(sound, member)
		}

		if (args[0] === 'remove') {
			if (sound !== undefined) {
				this.soundbox.remove(sound)
				return `[SOUNDBOX] ${alias} supprimé !`
			} else return `[SOUNDBOX] Pas de son '${alias}' enregistré !`
		}

		if (sound !== undefined) return "Ce nom est déjà pris, choisis-en un autre :)"

		sound = await SoundResolver.getByURL(this.soundbox, args[0])
		if (args[1] !== undefined) sound.volume = parseFloat(args[1])

		this.soundbox.add(alias, sound)
		return `[SOUNDBOX] ${alias} ajouté !`
	}

	getSoundBox() {
		return this.soundbox
	}

	private async play(sound: Sound, whoAsked: GuildMember): Promise<string | string[] | null> {
		if (whoAsked.voice.channel === null) return "Vas dans un channel vocal !"

		const channel = whoAsked.voice.channel
		return channel
		  .join()
		  .then(connection => {
			  const dispatcher = connection.play(sound.getStream(), {volume: sound.volume})
			  dispatcher.on('start', () => this.bot.setActivity({
				  type: 'LISTENING',
				  name: sound.title,
				  url: sound.source
			  }))
			  dispatcher.on('end', () => this.stop(whoAsked))
			  dispatcher.on('error', err => console.error("StreamDispatcher error: ", err.message))
			  return null
		  })
		  .catch(o_O => {
			  console.error("Can't connect to voice channel because:", o_O)
			  whoAsked.send("J'arrive pas à me connecter à ton channel =/")
				.catch(O_o => console.error("Can't warn about voice channel join error because:", O_o))
		  })
		  .then(() => null)
	}
	private async stop(whoAsked: GuildMember): Promise<string | string[] | null> {
		this.bot.setActivity()

		const channel = this.bot.getVoiceChannel(whoAsked.guild)
		if (channel === undefined) return "Toi fermes la, j'ai rien dis !"

		channel.leave()
		return null
	}
}