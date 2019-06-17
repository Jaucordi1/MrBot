const LinkResolver = {
	isExternalUrl: (url: string) => {
		return url.startsWith('http://') || url.startsWith('https://')
	},
	isLocalUrl: (url: string) => {
		return url.startsWith('./') || url.startsWith('/' || url.startsWith('../'))
	},
	isValidUrl: (url: string) => {
		return LinkResolver.isExternalUrl(url) || LinkResolver.isLocalUrl(url)
	}
}

export default LinkResolver