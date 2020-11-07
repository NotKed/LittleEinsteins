const fs = require("fs");

class Logger {
    static timestamp() {
        const date = new Date;
        const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const formattedDate = `${m[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`
        const formattedDateLog = `${date.getDate()}-${m[date.getMonth()]}-${date.getFullYear()}`
    
        return [
          `\x1b[96m${formattedDate} | ${formattedTime}:\x1b[0m`,
          `${formattedDateLog}`,
          `${formattedDate} | ${formattedTime}:`
        ];
    };

    static type(type) {
        const types = {
            LOG: ['\x1b[92mLOG\x1b[0m', 'LOG'],
            DEBUG: [ '\x1b[94mDEBUG\x1b[0m', 'DEBUG' ],
            WARN: [ '\x1b[33mWARN\x1b[0m', 'WARN' ],
            ERROR: [ '\x1b[91mERROR\x1b[0m', 'ERROR' ]
        };

        return types[type];
    };

    static log(message) {
        const tm = this.timestamp();
        console.log(this.type("LOG")[0], '-', tm[0], message);
        if (!fs.existsSync(`./data/logs/`)) fs.mkdirSync(`./data/logs/`, { recursive: true });
        fs.appendFileSync(`./data/logs/${tm[1]}.log`, `${'Log - ' + tm[2] + message}\n`);
    };
};

module.exports = Logger;