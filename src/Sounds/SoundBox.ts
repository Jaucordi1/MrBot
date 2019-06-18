import YT from 'ytdl-core'
import Bot from '../Core/Bot'
import LinkResolver from '../Core/LinkResolver'
import {JSONSound, JSONSoundSource} from '../../types'

export class SoundResolver {
	static find(box: SoundBox, shortcut: string): Sound | undefined {
		return box.soundList.get(shortcut)
	}
	static findByURL(box: SoundBox, url: string): Sound | undefined {
		return [...box.soundList.values()].find(s => s.source === url)
	}
	static async getByURL(box: SoundBox, url: string): Promise<Sound> {
		const sound = SoundResolver.findByURL(box, url)
		if (sound !== undefined) return sound

		if (!LinkResolver.isValidUrl(url)) return Promise.reject("Invalid URL !")

		if (LinkResolver.isExternalUrl(url)) {
			// YouTube
			const infos = await YT.getBasicInfo(url, {quality: 'highestaudio', filter: 'audioonly'})
			return new Sound(infos.title, {type: 'youtube', url: url}, 1)
		} else {
			// Local
			// TODO Think about it
			return Promise.reject('Not implemented')
		}
	}
}

export class Sound {

	private name: string
	private src: JSONSoundSource
	private vol: number

	constructor(name: string, source: JSONSoundSource, volume: number = 1) {
		this.name = name
		this.src = source
		this.vol = volume
	}

	// GETTERS
	get title(): string {
		return this.name
	}
	// SETTERS
	set title(title: string) {
		this.name = title
	}
	get type(): JSONSoundSource['type'] {
		return this.src.type
	}
	get source(): string {
		return this.src.url
	}
	get volume(): number {
		return this.vol
	}
	set volume(volume: number) {
		this.vol = volume
	}
	static fromJSON(json: JSONSound) {
		return new Sound(json.title, json.source, json.volume)
	}
	getStream() {
		if (this.type === 'local') return this.source
		if (this.type === 'youtube') return YT(this.source, {filter: 'audioonly', quality: 'highestaudio'})
		throw new Error(`Source type '${this.type}' not implemented !`)
	}
	// ACTIONS
	toJSON(): JSONSound {
		return {
			title: this.name,
			source: {
				type: this.type,
				url: this.source
			},
			volume: this.vol
		}
	}
}

export default class SoundBox {

	private bot: Bot
	private sounds: Map<string, Sound> = new Map
	private needSave: boolean = false

	constructor(bot: Bot) {
		this.bot = bot
		this.bot.config.sounds.forEach(json => {
			if (json.shortcut !== undefined)
				this.add(json.shortcut, Sound.fromJSON(json))
		})
		this.needSave = false
	}

	get soundList() {
		return this.sounds
	}
	get needToSave() {
		return this.needSave
	}
	set needToSave(need: boolean) {
		this.needSave = need
	}
	getBot() {
		return this.bot
	}

	add(alias: string, sound: Sound) {
		if (!this.sounds.has(alias)) {
			this.sounds.set(alias, sound)
			this.needSave = true
		}
	}
	remove(sound: Sound) {
		const nbBefore = this.sounds.size
		this.sounds.forEach((value, key) => (value === sound) ? this.sounds.delete(key) : undefined)
		if (this.sounds.size !== nbBefore)
			this.needSave = true
	}

	toJSON() {
		return [...this.sounds.values()].map(s => s.toJSON())
	}
}