const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const nets = require('nets');

// eslint-disable-next-line max-len
const blockIconURI = '';

// eslint-disable-next-line max-len
const menuIconURI = '';

const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

class DataViewer {
    constructor (runtime) {
        this._runtime = runtime;
    }
}

class Scratch3DataViewerBlocks {

    static get EXTENSION_NAME () {
        return 'DataViewer';
    }

    static get EXTENSION_ID () {
        return 'dataviewer';
    }

    constructor (runtime) {
        this.runtime = runtime;

        this.counter =0;

        this.clearData();

        this.connect();
    }

    getInfo () {
        return {
            id: Scratch3DataViewerBlocks.EXTENSION_ID,
            name: Scratch3DataViewerBlocks.EXTENSION_NAME,
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'setData',
                    text: 'set data to [DATA]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'addData',
                    text: 'add [DATA] to data',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'readCSVDataFromURL',
                    text: 'read CSV column [COLUMN] from [URL] starting from line [LINE]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        COLUMN: {
                            type: ArgumentType.NUMBER
                        },
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        },
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: 'readThingSpeakData',
                    text: 'read ThingSpeak field [FIELD] from channel [CHANNEL]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        FIELD: {
                            type: ArgumentType.NUMBER
                        },
                        CHANNEL: {
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                '---',
                {
                    opcode: 'dataLoop',
                    text: 'Read data until finished',
                    blockType: BlockType.LOOP,
                },
                {
                    opcode: 'whenDataReceived',
                    text: 'when data received',
                    blockType: BlockType.HAT
                },

                {
                    opcode: 'dataReadFinished',
                    text: 'data read finished',
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: 'getData',
                    text: 'data',
                    blockType: BlockType.REPORTER //talvez  esses reporter blocks possam ser 1 único em menu (com exceção do data [])
                },
                {
                    opcode: 'getIndex',
                    text: 'index',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getStatistic',
                    text: '[FNC]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        FNC: {
                            type: ArgumentType.STRING,
                            menu: 'statisticFunctions',
                            defaultValue: 'mean'
                        }
                    }
                },
                {
                    opcode: 'changeDataScale',
                    text: 'change data scale to [NEW_MIN] [NEW_MAX] ',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NEW_MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        NEW_MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                '---',
                {
                    opcode: 'mapDataValue',
                    text: 'map data value [VALUE] to [NEW_MIN] [NEW_MAX] ',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER
                        },
                        NEW_MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        NEW_MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'mapIndexValue',
                    text: 'map index value [VALUE] to [NEW_MIN] [NEW_MAX] ',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER
                        },
                        NEW_MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        NEW_MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                '---',
                {
                    opcode: 'getDataLength',
                    text: 'data length',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'clearData',
                    text: 'clear data',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'getDataIndex',
                    text: 'data [INDEX]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                '---',
                {
                    opcode: 'restartDataRead',
                    text: 'Restart data read',
                    blockType: BlockType.COMMAND
                }
            ],
            menus: {
                statisticFunctions: ['mean', 'min', 'max']
            }
        };
    }

    connect () {
        this._device = new DataViewer(this.runtime);
    }

    dataReadFinished(args) {
        if (this.dataIndex < this.getDataLength()) {
            this.dataIndex++;
        }
        return this.dataIndex >= this.getDataLength();
    }

    dataLoop (args, util) {
        if (this.dataIndex < this.getDataLength()) {
            this.dataIndex++;
        }
        if (this.dataIndex < this.getDataLength()) {
            util.startBranch(1, true);
        }
        else {
            this.dataIndex = -1;
        }
    }

    // Cassia: aqui não seria "Start receiving data? Pois não tem nenhuma condição para When, né?"
    //         na verdade não entendi muito bem esse bloco - depois podemos conversar!
    //         no futuro podemos juntar com o bloco de receber dados
    // Adriano: Este bloco serve para lermos os dados em forma de streaming.
    //          A gambi com counter % 2 é que temos que ficar alternando entre verdadeiro e falso
    //          para o bloco ser chamado.
    whenDataReceived (args) {
        this.counter += 1;
        if ((this.counter % 2 == 0) && (this.dataIndex < this.getDataLength() - 1)) {
            this.dataIndex++;
            return true;
        }
        else {
            return false;
        }
    }

    getDataIndex (args) {
        if (args.INDEX < this.getDataLength()) {
            return this.data[args.INDEX];
        }
    }

    getData (args) {
        if (this.dataIndex < this.getDataLength()) {
            return this.data[this.dataIndex];
        }
    }

    getDataLength (args) {
        return this.data.length;
    }

    getIndex (args) {
        if (this.getDataLength() > 0 && this.dataIndex >= 0) {
            return this.dataIndex;
        }
    }

    getStatistic (args) {
        switch(args.FNC) {
            case "mean":
                if (this.getDataLength() > 0) {
                    var total = 0.0;
                    for (var i = 0; i < this.getDataLength(); i += 1) {
                        total = total + this.data[i];
                    }
                    return total / this.getDataLength();
                }
                break;
            case "min":
                if (this.getDataLength() > 0) {
                    return this.data.reduce(function(a, b) {
                        return Math.min(a, b);
                    });
                }
                break;
            case "max":
                if (this.getDataLength() > 0) {
                    return this.data.reduce(function(a, b) {
                        return Math.max(a, b);
                    });
                }
                break;
            default:
                return "error";
        }
    }

    restartDataRead (args) {
        this.dataIndex = -1;
    }

    setData (args) {
        if (args.DATA.trim()) {

            const data = [];
            var dataIndex = 0;
            const splitedComma = args.DATA.split(',');
            for (var i = 0; i < splitedComma.length; i += 1) {
                if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                    data[dataIndex] = Cast.toNumber(splitedComma[i]);
                    dataIndex++;
                } else {
                    const splitedSpace = splitedComma[i].trim().split(' ');
                    for (var j = 0; j < splitedSpace.length; j += 1) {
                        if (splitedSpace[j].trim() && !isNaN(splitedSpace[j])) {
                            data[dataIndex] = Cast.toNumber(splitedSpace[j]);
                            dataIndex++;
                        }
                    }
                }
            }

            this.data = data;
            this.dataIndex = -1;
        }
    }

    addData (args) {
        if (args.DATA) {
           this.data.push(Cast.toNumber(args.DATA));
        }
    }

    clearData (args) {
        this.data = [];
        this.dataIndex = -1;
    }

    mapValue (value, old_min, old_max, new_min, new_max) {
        return new_min + (value - old_min) * (new_max - new_min) / (old_max - old_min);
    }

    mapIndexValue (args) {
        if (this.getDataLength() > 0) {
            return Cast.toNumber(this.mapValue(
                Cast.toNumber(args.VALUE), 0, this.getDataLength() - 1, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
        }
    }

    mapDataValue (args) {
        if (this.getDataLength() > 0) {
            return Cast.toNumber(this.mapValue(
                 Cast.toNumber(args.VALUE), this.getMin(), this.getMax(), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
        }
    }

    changeDataScale (args) {
        const old_min = this.getMin();
        const old_max = this.getMax();
        for (var i = 0; i < this.getDataLength(); i += 1) {
            this.data[i] = Cast.toNumber(this.mapValue(
                this.data[i], old_min, old_max, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
        }
    }

    readCSVDataFromURL (args) {
        if (args.URL.trim() && args.COLUMN && args.LINE) {
            const urlBase = args.URL;
            const column = args.COLUMN - 1;
            const line = args.LINE;

            return new Promise((resolve, reject) => {
                nets({url: urlBase, timeout: serverTimeoutMs}, (err, res, body) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.statusCode !== 200) {
                        return reject('statusCode != 200');
                    }

                    const lines = body.toString().split('\n');
                    const data = [];
                    var dataIndex = 0;
                    for (var i = (line - 1); i < lines.length; i += 1) {
                        const columns = lines[i].trim().split(',');
                        if (columns[column]) {
                            // Just to make sure we are getting only numbers.
                            /// ToDo: cover more cases...
                            columns[column] = columns[column].replace(/\D*(\d+)/, '$1');
                            if (!isNaN(columns[column])) {
                                data[dataIndex] = Cast.toNumber(columns[column]);
                                dataIndex++;
                            }
                        }
                    }

                    return resolve(data.join(','));
                });
            });
        }
    }

    readThingSpeakData (args) {
        if (args.CHANNEL && args.FIELD) {
            const channel = args.CHANNEL;
            const field = args.FIELD;
            const urlBase = 'https://thingspeak.com/channels/' + channel + '/field/' + field + '.json';

            return new Promise((resolve, reject) => {
                nets({url: urlBase, timeout: serverTimeoutMs}, (err, res, body) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.statusCode !== 200) {
                        return reject('statusCode != 200');
                    }

                    const feeds = JSON.parse(body).feeds;
                    const data = [];
                    var dataIndex = 0;
                    for (const idx in feeds) {
                        if (feeds[idx].hasOwnProperty('field' + field)) {
                            const value = feeds[idx]['field' + field].trim();
                            if (value && !isNaN(value)) {
                                data[dataIndex] = Cast.toNumber(value);
                                dataIndex++;
                            }
                        }
                    }

                    return resolve(data.join(','));
                });
            });
        }
    }
}

module.exports = Scratch3DataViewerBlocks;
