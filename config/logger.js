var winston = require('winston');

// Setting up custom logging
var WARMDLogLevels = {
  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
  },
  colors: {
    trace: 'white',
    debug: 'blue',
    info: 'green',
    warn: 'orange',
    error: 'red',
    fatal: 'red'
  }
};

var warmdLog = winston.createLogger({
  levels: WARMDLogLevels.levels,

  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: './logs/error.log', name: 'file.error', level: 'error' }),
    new (winston.transports.File)({ filename: './logs/info.log', name: 'file.info', level: 'info' })
  ]
});
winston.addColors(WARMDLogLevels.colors);

module.exports = warmdLog;
