const fs = require('fs');
const path = require('path')

class Logger {
    constructor(logFilePath, level = "error") {
        this.logFilePath = logFilePath;
        this.logLevels = ['info', 'warn', 'error', 'critical'];
        this.currentLogLevelIndex = this.logLevels.indexOf(level);

        const logPath = path.dirname(logFilePath);

        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath, { recursive: true })
        }

    }

    formatMessage(level, message, meta) {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            level,
            message,
            meta,
        }) + "\n\n"
    }


    getDailyLogFileName() {
        const date = new Date().toISOString().split("T")[0];
        return `${this.logFilePath.replace(".log", "")}-${date}.log`
    }

    writeLog(level, message) {
        const logFile = this.getDailyLogFileName();
        const levelIndex = this.logLevels.indexOf(level)

        if (levelIndex >= this.currentLogLevelIndex) {
            fs.appendFile(logFile, message, (err) => {
                if (err) {
                    console.error('Failed to write to log file:', err);
                }
            })
        }

    }

    log(level, message, meta) {
        const logMessage = this.formatMessage(level, message, meta);
        this.writeLog(level, logMessage)
    }

    info(message, meta) {
        this.log('info', message, meta)
    }

    warn(message, meta) {
        this.log("warn", message, meta)
    }

    error(message, meta) {
        this.log("error", message, meta);
    }

    critical(message, meta) {
        this.log("critical", message, meta)
    }

}


module.exports = Logger;