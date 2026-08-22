import os from 'node:os'

export const getLocalIp = () => {
	const interfaces = os.networkInterfaces()
	for (const name of Object.keys(interfaces)) {
		for (const net of interfaces[name]) {
			// Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
			if (net.family === 'IPv4' && !net.internal) {
				return net.address
			}
		}
	}
	return '127.0.0.1' // Fallback
}
