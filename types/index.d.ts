// Sounds
export type JSONSoundSource = {
	type: string,
	url: string
}
export type JSONSound = {
	name: string,
	source: JSONSoundSource,
	volume?: number
}

// Config
export type Config = {
	name: string,
	token: string,
	sounds: JSONSound[],
	humors: {
		good: string[],
		bad: string[]
	}
}