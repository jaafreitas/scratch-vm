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
                    text: 'read .csv file [URL]: column [COLUMN] starting from line [LINE]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        COLUMN: {
                            type: ArgumentType.NUMBER
                        },
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'spreadsheet link'
                        },
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: 'readThingSpeakData',
                    text: 'read ThingSpeak: channel [CHANNEL], field [FIELD]',
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
                    text: 'read all values from data',
                    blockType: BlockType.LOOP,
                },
                {
                    opcode: 'getValue',
                    text: 'value',
                    blockType: BlockType.REPORTER //talvez  esses reporter blocks possam ser 1 único em menu (com exceção do data [])
                },
                {
                    opcode: 'getIndex',
                    text: 'index',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getDataLength',
                    text: 'data length',
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
                '---',
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
                {
                    opcode: 'getDataIndex',
                    text: 'value in data index [INDEX]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
            ],
            menus: {
                statisticFunctions: ['mean', 'min', 'max']
            }
        };
    }

    connect () {
        this._device = new DataViewer(this.runtime);
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

    getDataIndex (args) {
        if (args.INDEX < this.getDataLength()) {
            return this.data[args.INDEX];
        }
    }

    getValue (args) {
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


    _getMean () {
        if (this.getDataLength() > 0) {
            var total = 0.0;
            for (var i = 0; i < this.getDataLength(); i += 1) {
                total = total + this.data[i];
            }
            return total / this.getDataLength();
        }
    }

    _getMin () {
        if (this.getDataLength() > 0) {
            return this.data.reduce(function(a, b) {
                return Math.min(a, b);
            });
        }
    }

    _getMax () {
        if (this.getDataLength() > 0) {
            return this.data.reduce(function(a, b) {
                return Math.max(a, b);
            });
        }
    }

    getStatistic (args) {
        switch(args.FNC) {
            case "mean":
                return this._getMean();
                break;
            case "min":
                return this._getMin();
                break;
            case "max":
                return this._getMax();
                break;
            default:
                return "error";
        }
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
        const old_min = this._getMin();
        const old_max = this._getMax();
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
