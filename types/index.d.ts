// Sounds
export type JSONSoundSource = {
	type: 'youtube' | 'local',
	url: string
}
export type JSONSound = {
	shortcut?: string,
	title: string,
	source: JSONSoundSource,
	volume?: number
}

// Config
export type Config = {
	name: string,
	token: string,
	yt_token: string,
	sounds: JSONSound[],
	humors: {
		good: string[],
		bad: string[]
	}
}