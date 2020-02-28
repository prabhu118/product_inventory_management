const loggerConfig = {
	'appenders': {
		'access': {
			'type': 'dateFile',
			'filename': 'logs/access.log',
			'pattern': '-yyyy-MM-dd',
			'category': 'http'
		},
		'app': {
			'type': 'file',
			'filename': 'logs/info.log',
			'maxLogSize': 10485760,
			'pattern': '-yyyy-MM-dd',
			'numBackups': 3
		},
		'errorFile': {
			'type': 'dateFile',
			'filename': 'logs/errors.log',
			'pattern': '-yyyy-MM-dd'
		},
		'errors': {
			'type': 'logLevelFilter',
			'level': 'ERROR',
			'appender': 'errorFile'
		}
	},
	'categories': {
		'default': { 'appenders': [ 'app', 'errors'], 'level': 'DEBUG' },
		'http': { 'appenders': [ 'access'], 'level': 'DEBUG' }
	}
};

export default loggerConfig;
  