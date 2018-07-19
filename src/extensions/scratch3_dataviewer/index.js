const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
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

        this.dataIndex = -1;

        this.data = [];

        this.connect();
    }

    getInfo () {
        return {
            id: Scratch3DataViewerBlocks.EXTENSION_ID,
            name: Scratch3DataViewerBlocks.EXTENSION_NAME,
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                // Bloco para leitura de dados de fontes distintas,
                // começando com uma leitura de dados escrita (ou via arduino leonardo)
                {
                    opcode: 'addData',
                    text: 'add data [DATA]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'readCSVDataFromURL',
                    text: 'read CSV data from [URL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'readThingSpeakData',
                    text: 'read ThingSpeak field [FIELD] from channel [CHANNEL]',
                    blockType: BlockType.COMMAND,
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
                    opcode: 'getMean',
                    text: 'mean',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getMax',
                    text: 'max',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getMin',
                    text: 'min',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'mapValues',
                    text: 'change scale to [NEW_MIN] [NEW_MAX] ',
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
                    opcode: 'getDataLength',
                    text: 'data length',
                    blockType: BlockType.REPORTER
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
            ]
        };
    }

    connect () {
        this._device = new DataViewer(this.runtime);
    }

    dataReadFinished() {
        if (this.dataIndex < this.data.length) {
            this.dataIndex++;
        }
        return this.dataIndex >= this.data.length;
    }

    // Cassia: aqui não seria "Start receiving data? Pois não tem nenhuma condição para When, né?"
    //         na verdade não entendi muito bem esse bloco - depois podemos conversar!
    //         no futuro podemos juntar com o bloco de receber dados
    // Adriano: Este bloco serve para lermos os dados em forma de streaming.
    //          A gambi com counter % 2 é que temos que ficar alternando entre verdadeiro e falso
    //          para o bloco ser chamado.
    whenDataReceived () {
        this.counter += 1;
        if ((this.counter % 2 == 0) && (this.dataIndex < this.data.length - 1)) {
            this.dataIndex++;
            return true;
        }
        else {
            return false;
        }
    }

    getDataIndex (args) {
        if (args.INDEX < this.data.length) {
            return this.data[args.INDEX];
        }
    }

    getData () {
        if (this.dataIndex < this.data.length) {
            return this.data[this.dataIndex];
        }
    }

    getDataLength () {
        return this.data.length;
    }

    getIndex () {
        return this.dataIndex;
    }

    getMean () {   
        var total = 0, i;
        for (i = 0; i < this.data.length; i += 1) {
            total = total + parseInt(this.data[i], 10);
        }
        return total / this.data.length;
    }

   getMax () {   
        var max = this.data.reduce(function(a, b) {
            return Math.max(a, b);
        });
        return max;
    }

   getMin () {   
        var min = this.data.reduce(function(a, b) {
            return Math.min(a, b);
        });
        return min;
    }

    restartDataRead () {
        this.dataIndex = -1;
    }

    addData (args) {
        this.data = args.DATA.split(',');
        this.dataIndex = -1;
    }

    mapValues (args) {
        //adicionar aviso se o conjunto de dados estiver vazio
        var new_min = Number(args.NEW_MIN);
        var new_max = Number(args.NEW_MAX);
        for (var i = 0; i < this.data.length; i += 1) {
            this.data[i] = (this.data[i]-this.getMin())*(new_max - new_min)/(this.getMax() - this.getMin())+new_min;
        }
    }
    readCSVDataFromURL (args) {
        nets({url: args.URL, timeout: serverTimeoutMs}, (err, res, body) => {
            if (err) {
                log.warn('error fetching result! ${res}');
            }
            // Estamos assumindo que o dado está em apenas uma linha e tem apenas um campo.
            this.data = body.toString().split(',');
            this.dataIndex = -1;
        });
    }
    readThingSpeakData (args) {
        const urlBase = 'https://thingspeak.com/channels/' + args.CHANNEL + '/field/' + args.FIELD + '.json'
        nets({url: urlBase, timeout: serverTimeoutMs}, (err, res, body) => {
            if (err) {
                log.warn('error fetching result! ${res}');
            }
            let feeds = JSON.parse(body).feeds;
            let data = [];
            for (const idx in feeds) {
                if (feeds[idx].hasOwnProperty('field' + args.FIELD)) {
                    data[idx] = feeds[idx]['field' + args.FIELD].trim();
                }
            }
            this.data = data;
            this.dataIndex = -1;
        });
    }
}

module.exports = Scratch3DataViewerBlocks;
