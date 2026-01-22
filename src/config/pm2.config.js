import packagejson from '../../package.json' with { type: 'json' }
import os from 'os'
export const apps = [
	{
		name: packagejson.name,
		script: 'src/index.js',
		instances: os.cpus().length, //a number, 0 to disable,
		exec_mode: 'cluster', // Run in cluster mode for better performance
		autorestart: true,
		watch: true,
		ignore_watch: ['node_modules', 'logs', 'backups', 'uploads', 'docs'], // Ignore specific directories during watch
		max_memory_restart: '8G',
		env: {
			NODE_ENV: 'production'
		},
		env_local: {
			NODE_ENV: 'local'
		}
	}
]
export default {
	apps
}
