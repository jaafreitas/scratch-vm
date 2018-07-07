const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');

// eslint-disable-next-line max-len
const blockIconURI = '';

// eslint-disable-next-line max-len
const menuIconURI = '';

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
                {
                    opcode: 'whenDataReceived',
                    text: 'when data received',
                    blockType: BlockType.HAT
                },

                // Cássia: bloco para leitura de dados de fontes distintas
                //         começando com uma leitura de dados escrita (ou via arduino leonardo)
                // Adriano: eu acho que dois blocos distintos (dado e url) ia deixar a interface mais amigável.
                {
                    opcode: 'addData',
                    text: 'add [DATATYPE] [NEWDATA] to data',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATATYPE: {
                            type: ArgumentType.STRING,
                            menu: 'dataSource',
                            defaultValue: 'text'
                        },
                        NEWDATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 0
                        }
                    }
                },

                '---',
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
                    opcode: 'getID',
                    text: 'ID',
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
                {
                    opcode: 'getDataLength',
                    text: 'data length',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'restartDataRead',
                    text: 'Restart data read',
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'clickToProgram',
                    text: 'Click to program',
                    blockType: BlockType.HAT
                },
                {
                    opcode: 'setReadPin',
                    text: 'Read analog pin [PIN] every [SEC] seconds [TIMES] times',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'analogPins',
                            defaultValue: 'A0'
                        },
                        SEC: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        },
                        TIMES: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                }/*,

                {
                    opcode: 'getDataJson',
                    text: 'teste',
                    blockType: BlockType.REPORTER
                }*/
            ],
            menus: {
                analogPins: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
                dataSource: ['text', 'url']
            }
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

    getID () {
        return this.dataIndex;
    }

    restartDataRead () {
        this.dataIndex = -1;
    }


    clickToProgram () {
    }

    setReadPin () {
    }

    // teste para leitura dos dados separados por vírgulas
    addData (args) {
        if (args.DATATYPE == 'text') {
            // salva o texto que foi inserido separado por vírgulas no campo em branco do bloco.
            // verificar necessidade de converter em número
            this.data = args.NEWDATA.split(',');
            this.dataIndex = -1;
        }
    }


}

module.exports = Scratch3DataViewerBlocks;
