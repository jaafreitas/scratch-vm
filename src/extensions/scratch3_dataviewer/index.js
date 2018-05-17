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

        this.counter = 0;

        this.dataSampleID = 0;

        this.dataSample = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 17, 17, 18, 18, 19, 20, 20, 21, 22, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 32, 33, 34, 35, 36, 37, 39, 40, 41, 43, 44, 46, 47, 49, 51, 52, 54, 56, 58, 60, 62, 64, 66, 68, 71, 73, 76, 78, 81, 84, 87, 90, 93, 96, 99, 102, 106, 109, 113, 117, 121, 125, 129, 134, 138, 143, 148, 153, 158, 164, 169, 175, 181, 187, 193, 200, 207, 214, 221, 228, 236, 244];

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
                {
                    opcode: 'getData',
                    text: 'data',
                    blockType: BlockType.REPORTER
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
                }
            ],
            menus: {
                analogPins: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7']
            }
        };
    }

    connect () {
        this._device = new DataViewer(this.runtime);
    }

    whenDataReceived () {
        this.counter += 1;
        if (this.counter % 2 == 0) {
            this.dataSampleID++;
            return this.dataSampleID < this.dataSample.length;
        }
    }

    getDataIndex (args) {
        if (args.INDEX < this.dataSample.length) {
            return this.dataSample[args.INDEX];
        }
    }

    getData () {
        if (this.dataSampleID < this.dataSample.length) {
            return this.dataSample[this.dataSampleID];
        }
    }

    getDataLength () {
        return this.dataSample.length;
    }

    getID () {
        return this.dataSampleID;
    }

    restartDataRead() {
        this.dataSampleID = 0;
    }

    clickToProgram () {
    }

    setReadPin () {
    }

}

module.exports = Scratch3DataViewerBlocks;
