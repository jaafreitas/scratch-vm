const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const nets = require('nets');
const formatMessage = require('format-message');
const Runtime = require('../../engine/runtime'); // INCLUINDO


// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,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';

const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

const parentClassStageHeader = 'stage-header_stage-size-row_1F3iv';

const IDViewDataButton = 'dataviewer-view-data-button';
const IDTableWindows = 'dataviewer-table-windows';

class Scratch3DataViewerBlocks {
    static get EXTENSION_INFO_COLOR1 () {
        return '#0FBD8C';
    }

    static get EXTENSION_INFO_COLOR2 () {
        return '#0DA57A';
    }

    static get EXTENSION_INFO_COLOR3 () {
        return '#0B8E69';
    }

    constructor (runtime) {
        this._runtime = runtime;

        // Always starts with the minimal-block version.
        this._runtime.DataviewerMinimalBlocks = true;

        this.scalex = 100;
        this.scaley = 100;

        this._runtime.on(Runtime.PROJECT_START, this.reset.bind(this));

        // When we are loading the extension automatically, there is no stage at this point.
        // The work-around is to wait for the BLOCKSINFO_UPDATE event.
        // But, if we are dynamically loading it, we won't get any BLOCKSINFO_UPDATE event soon,
        // so it's better to call _blocksInfoUpdate right now.
        this._runtime.on(Runtime.BLOCKSINFO_UPDATE, this._blocksInfoUpdate.bind(this));
        this._blocksInfoUpdate();
    }

    _zeros (size) {
        const zeros = [];
        for (let i = 0; i < size; i++) {
            zeros.push(0);
        }
        return zeros;
    }

    _showData () {
        if (!document.getElementById(IDTableWindows)) {
            const modalDiv = document.createElement('div');
            modalDiv.id = IDTableWindows;

            // creates the header of the div
            const header = document.createElement('div');
            const title = document.createTextNode('Data Viewer');
            const titleDiv = document.createElement('div');
            // appends the text to the header
            titleDiv.appendChild(title);
            header.appendChild(titleDiv);
            // creates the body
            const body = document.createElement('div');
            // close button
            const closeButtonDiv = document.createElement('div');
            const closeButton = document.createElement('button');
            const closeButtonText = document.createTextNode('x');
            // closes the modal when the button is clicked
            closeButton.onclick = function () {
                document.body.removeChild(modalDiv);
            };

            // appends the button to the header
            closeButton.appendChild(closeButtonText);
            closeButtonDiv.appendChild(closeButton);
            header.appendChild(closeButtonDiv);

            // creates the table with the lenght of data1
            const rows = 3;
            const table = document.createElement('table');
            let columns = 0;
            if (!this.data1) {
                columns = this.data1.length;
            }
            if (this.data2) {
                if (this.data2.length !== columns) {
                    this.data2 = this._zeros(columns);
                }
            } else {
                this.data2 = this._zeros(columns);
            }

            if (this.data3) {
                if (this.data3.length !== columns) {
                    this.data3 = this._zeros(columns);
                }
            } else {
                this.data3 = this._zeros(columns);
            }

            const dataset = [this.data1, this.data2, this.data3];
            const dtString = ['data1', 'data2', 'data3'];

            for (let r = 0; r < rows; r++) {
                const tabr = document.createElement('td');
                for (let c = 0; c < columns; c++) {
                    const tabDiv = document.createElement('div');

                    if (c === 0) {
                        const tabc = document.createElement('tr');
                        tabc.appendChild(document.createTextNode(dtString[r]));
                        tabr.appendChild(tabc);
                    }

                    const tabc = document.createElement('tr');
                    tabc.appendChild(document.createTextNode(dataset[r][c].toString()));
                    tabDiv.appendChild(tabc);
                    tabr.appendChild(tabDiv);

                }
                table.appendChild(tabr);
            }
            body.appendChild(table);

            // styles the header
            header.style.padding = '10px 15px';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.borderBottom = '1px solid black';
            header.style.backgroundColor = ' #2196f3';
            header.style.borderTopLeftRadius = '2px';
            header.style.borderTopRightRadius = '2px';
            body.style.maxWidth = '300px';
            body.style.height = '50px';

            // titleDiv css
            titleDiv.style.fontSize = '1.25rem';
            // title.style.fontWeight = "bold";
            titleDiv.style.color = 'white';

            // closeButton css
            closeButton.style.fontSize = '1.25rem';
            closeButton.style.fontWeight = 'bold';
            closeButton.style.cursor = 'pointer';
            closeButton.style.border = 'none';
            closeButton.style.outline = 'none';
            closeButton.style.background = 'none';
            closeButton.style.color = 'white';

            // modalBodyDiv css
            body.style.padding = '10px 15px';
            body.style.maxWidth = '300px';
            body.style.height = '250px';
            body.style.overflow = 'auto';

            // modal css
            modalDiv.style.top = '50%';
            modalDiv.style.left = '50%';
            modalDiv.style.maxWidth = '300px';
            modalDiv.style.height = '300px';
            modalDiv.style.position = 'absolute';
            modalDiv.style.border = '1px solid black';
            modalDiv.style.borderRadius = '4px';
            modalDiv.style.zIndex = '10';
            modalDiv.style.backgroundColor = 'white';

            // appends
            modalDiv.appendChild(header);
            modalDiv.appendChild(body);
            document.body.appendChild(modalDiv);

            // move window
            modalDiv.addEventListener('mousedown', this._mousedown);
        }
    }

    /* eslint-disable */
    _mousedown (e) {
        window.addEventListener('mousemove', mousemove);
        window.addEventListener('mouseup', mouseup);
        const modalDiv = document.getElementById(IDTableWindows);

        // eslint-disable-next-line require-jsdoc
        function mousemove (e) {
            modalDiv.style.left = `${e.clientX}px`;
            modalDiv.style.top = `${e.clientY}px`;
            return;
        }

        function mouseup () {
            window.removeEventListener('mousemove', mousemove);
            window.removeEventListener('mouseup', mouseup);
            return;
        }
        return;
    }
    /* eslint-enable */

    _blocksInfoUpdate (initial = true) {
        if (!document.getElementById(IDViewDataButton)) {
            // There should be only one element by this class.
            const stageHeader = document.getElementsByClassName(parentClassStageHeader);
            if (stageHeader && stageHeader[0]) {
                const div = document.createElement('div');
                stageHeader[0].prepend(div);
                div.id = IDViewDataButton;
                div.style.marginRight = '.3rem';
                div.onclick = () => {
                    this._showData();
                };
                div.innerHTML = `
<div>
    <span class="button_outlined-button_2f510 stage-header_stage-button_4qxON"
        style="width: 42px; background: ${Scratch3DataViewerBlocks.EXTENSION_INFO_COLOR1}" role="button">
        <div class="button_content_3y79K">
            <img title="View Data" class="stage-header_stage-button-icon_1SHv0" draggable="false" src="${blockIconURI}">
        </div>
    </span>
</div>
`;
                // Work-around: the icon will disapear when on full screen or language is changed.
                if (initial) {
                    setInterval(() => this._blocksInfoUpdate(false), 1000);
                }
            }
        }
    }

    reset () {
        this.scalex = 100;
        this.scaley = 100;
    }


    _setupTranslations () {
        const localeSetup = formatMessage.setup();
        const extTranslations = require('./locales.json');
        for (const locale in extTranslations) {
            if (!localeSetup.translations[locale]) {
                localeSetup.translations[locale] = {};
            }
            Object.assign(localeSetup.translations[locale], extTranslations[locale]);
        }
    }

    getInfo () {
        this._setupTranslations();

        return {
            id: 'dataviewer',
            color1: Scratch3DataViewerBlocks.EXTENSION_INFO_COLOR1,
            color2: Scratch3DataViewerBlocks.EXTENSION_INFO_COLOR2,
            color3: Scratch3DataViewerBlocks.EXTENSION_INFO_COLOR3,
            // Default values from Runtime > defaultExtensionColors.
            // Colors should be synced with documentation.
            // color1: '#444444',
            // color2: '#000000',
            // color3: '#BBBBBB',
            name: formatMessage({
                id: 'dataviewer.categoryName',
                default: 'Data Viewer',
                description: 'Label for the Data Viewer extension category'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: this.addBlocks(),
            menus: this.addMenus()
        };
    }

    addBlocks () {
        const allBlocks = {
            showMoreBlocks: {
                func: 'DATAVIEWER_SHOW_MORE_LESS_BLOCKS',
                text: formatMessage({
                    id: 'dataviewer.showMoreBlocks',
                    default: 'Show More Blocks'
                }),
                blockType: BlockType.BUTTON
            },
            showLessBlocks: {
                func: 'DATAVIEWER_SHOW_MORE_LESS_BLOCKS',
                text: formatMessage({
                    id: 'dataviewer.showLessBlocks',
                    default: 'Show Less Blocks'
                }),
                blockType: BlockType.BUTTON
            },
            setData: {
                opcode: 'setData',
                text: formatMessage({
                    id: 'dataviewer.setData',
                    default: 'set [DATA_ID] to [DATA]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    },
                    DATA: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    }
                }
            },
            addValueToData: {
                opcode: 'addValueToData',
                text: formatMessage({
                    id: 'dataviewer.addValueToData',
                    default: 'add value [VALUE] to [DATA_ID]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        dafaultValue: 'data1'
                    },
                    VALUE: {
                        type: ArgumentType.NUMBER,
                        defaultValue: ' '
                    }
                }
            },
            readCSVDataFromURL: {
                opcode: 'readCSVDataFromURL',
                text: formatMessage({
                    id: 'dataviewer.readCSVDataFromURL',
                    default: 'read .csv file [URL] column: [COLUMN] starting from line: [LINE]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    COLUMN: {
                        type: ArgumentType.NUMBER,
                        defaultValue: ' '
                    },
                    URL: {
                        type: ArgumentType.STRING,
                        defaultValue: formatMessage({
                            id: 'dataviewer.readCSVDataFromURL.default',
                            default: 'spreadsheet link'
                        })
                    },
                    LINE: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 2
                    }
                }
            },
            readThingSpeakData: {
                opcode: 'readThingSpeakData',
                text: formatMessage({
                    id: 'dataviewer.readThingSpeakData',
                    default: 'read ThingSpeak channel: [CHANNEL] field: [FIELD]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    FIELD: {
                        type: ArgumentType.NUMBER,
                        defaultValue: ' '
                    },
                    CHANNEL: {
                        type: ArgumentType.NUMBER,
                        defaultValue: ' '
                    }
                }
            },
            dataLoop: {
                opcode: 'dataLoop',
                text: formatMessage({
                    id: 'dataviewer.dataLoop',
                    default: 'read all values from [DATA_ID]'
                }),
                blockType: BlockType.LOOP,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    }
                }
            },
            getValue: {
                opcode: 'getValue',
                text: formatMessage({
                    id: 'dataviewer.getValue',
                    default: 'value from [DATA_ID]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    }
                }
            },
            getIndex: {
                opcode: 'getIndex',
                text: formatMessage({
                    id: 'dataviewer.getIndex',
                    default: 'index from [DATA_ID]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    }
                }
            },
            getStatistic: {
                opcode: 'getStatistic',
                text: formatMessage({
                    id: 'dataviewer.getStatistic',
                    default: '[FNC] [DATA_ID]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    },
                    FNC: {
                        type: ArgumentType.STRING,
                        menu: 'statisticFunctions',
                        defaultValue: 'mean'
                    }
                }
            },
            changeDataScale: {
                opcode: 'changeDataScale',
                text: formatMessage({
                    id: 'dataviewer.changeDataScale',
                    default: 'change [DATA_ID] scale to [NEW_MIN] [NEW_MAX]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
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
            mapData: {
                opcode: 'mapData',
                text: formatMessage({
                    id: 'dataviewer.mapData',
                    default: 'map [DATA_ID] [DATA_TYPE] to [NEW_MIN] [NEW_MAX]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    },
                    DATA_TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'dataType',
                        defaultValue: 'value'
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
            getDataLength: {
                opcode: 'getDataLength',
                text: formatMessage({
                    id: 'dataviewer.getDataLength',
                    default: 'data length of [DATA_ID]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    }
                }
            },
            getDataIndex: {
                opcode: 'getDataIndex', // ESTÁ COM ERRO NESSE BLOCO
                text: formatMessage({
                    id: 'dataviewer.getDataIndex',
                    default: 'value in [DATA_ID] index [INDEX]'
                }),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataId',
                        defaultValue: 'data1'
                    },
                    INDEX: { // AQUI ESSE INDEX TERIA QUE SER ESPECÍFICO PARA CADA DATASET?
                        type: ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                }
            },
            setScaleX: {
                opcode: 'setScaleX',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'dataviewer.setSizeX',
                    default: 'set size X to [SCALEX] %'
                }),

                arguments: {
                    SCALEX: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100

                    }
                }
            },
            setScaleY: {
                opcode: 'setScaleY',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'dataviewer.setSizeY',
                    default: 'set size Y to [SCALEY] %'
                }),

                arguments: {
                    SCALEY: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100

                    }
                }
            }
        };
        const blocks = [];
        if (this._runtime.DataviewerMinimalBlocks) {
            blocks.push(
                allBlocks.setData,
                allBlocks.dataLoop,
                allBlocks.changeDataScale,
                allBlocks.getValue,
                allBlocks.getIndex,
                allBlocks.getStatistic,
                allBlocks.addValueToData,
                allBlocks.setScaleX,
                allBlocks.setScaleY,
                allBlocks.showMoreBlocks);
        } else {
            blocks.push(
                allBlocks.setData,
                allBlocks.addValueToData,
                allBlocks.readCSVDataFromURL,
                allBlocks.readThingSpeakData,
                '---',
                allBlocks.dataLoop,
                allBlocks.getValue,
                allBlocks.getIndex,
                allBlocks.getStatistic,
                allBlocks.changeDataScale,
                allBlocks.mapData,
                allBlocks.getDataLength,
                allBlocks.getDataIndex,
                '---',
                allBlocks.setScaleX,
                allBlocks.setScaleY,
                '---',
                allBlocks.showLessBlocks);
        }
        // if we try load a project with the extra blocks using the minimal-block version,
        // those extra blocks won't appear in the coding area.
        for (const [opcode, block] of Object.entries(allBlocks)) {
            const searchBlocks = blocks.filter(searchBlock => (
                (searchBlock.opcode === opcode) || (block.blockType === BlockType.BUTTON)
            ));
            if (!searchBlocks.length) {
                block.hideFromPalette = true;
                blocks.push(block);
            }
        }
        return blocks;
    }

    addMenus () {
        return {
            statisticFunctions: [
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.mean',
                        default: 'mean'
                    }),
                    value: 'mean'
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.min',
                        default: 'min'
                    }),
                    value: 'min'
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.max',
                        default: 'max'
                    }),
                    value: 'max'
                }
            ],
            dataType: [
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataType.value',
                        default: 'value'
                    }),
                    value: 'value'
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataType.index',
                        default: 'index'
                    }),
                    value: 'index'
                }
            ],
            dataId: [ // INCLUINDO
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataId.data1',
                        default: 'data1'
                    }),
                    value: 'data1'
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataId.data2',
                        default: 'data2'
                    }),
                    value: 'data2'
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataId.data3',
                        default: 'data3'
                    }),
                    value: 'data3'
                }
            ]
        };
    }

    getDataLength (args) {
        // SE DEIXAR O SWITCH, FUNCIONA PARA O BLOCO DE TAMANHO, MAS NÃO PARA O DE LOOP - E VICE VERSA.
        switch (args.DATA_ID) {
        case 'data1':
            if (this.data1) {
                return this.data1.length;
            }
            break;
        case 'data2':
            if (this.data2) {
                return this.data2.length;
            }
            break;
        case 'data3':
            if (this.data3) {
                return this.data3.length;
            }
            break;
        default:
            return 0;
        }
    }

    getValue (args) {
        switch (args.DATA_ID) {
        case 'data1':
            if (this.getDataLength(args) > 0 && this.dataIndex1 >= 0) {
                return this.data1[this.dataIndex1];
            }
            break;
        case 'data2':
            if (this.getDataLength(args) > 0 && this.dataIndex2 >= 0) {
                return this.data2[this.dataIndex2];
            }
            break;
        case 'data3':
            if (this.getDataLength(args) > 0 && this.dataIndex3 >= 0) {
                return this.data3[this.dataIndex3];
            }
            break;
        default:
            return '';

        }
    }


    _getInternalIndex (args) {
        // FIX: missing this.data3.
        if (this.data1) {
            if (this.getDataLength(args) > 0 && this.dataIndex1 >= 0) {
                return this.dataIndex1;
            }
        }
        if (this.data2) {
            if (this.getDataLength(args) > 0 && this.dataIndex2 >= 0) {
                return this.dataIndex2;
            }
        } else {
            return 0;
        }
    }

    getIndex (args) {
        switch (args.DATA_ID) {
        case 'data1':
            if (this._getInternalIndex(args) >= 0) {
                return this._getInternalIndex(args) + 1; // ARRUMAR TODOS INTERNALINDEX
            }
            break;
        case 'data2':
            if (this._getInternalIndex(args) >= 0) {
                return this._getInternalIndex(args) + 1; // ARRUMAR TODOS INTERNALINDEX
            }
            break;
        case 'data3':
            if (this._getInternalIndex(args) >= 0) {
                return this._getInternalIndex(args) + 1; // ARRUMAR TODOS INTERNALINDEX
            }
            break;
        default:
            return '';
        }
    }

    _mapValue (value, oldMin, oldMax, newMin, newMax) {
        return newMin + ((value - oldMin) * (newMax - newMin) / (oldMax - oldMin));
    }

    _getMean (args) {
        if (this.getDataLength(args) > 0) {
            let total = 0.0;
            for (let i = 0; i < this.getDataLength(args); i += 1) {
                total = total + this.data[i];
            }
            return total / this.getDataLength();
        }
    }

    _getMin (args) {
        switch (args.DATA_ID) {
        case 'data1':
            if (this.getDataLength(args) > 0) {
                return this.data1.reduce((a, b) => Math.min(a, b));
            }
            break;
        case 'data2':
            if (this.getDataLength(args) > 0) {
                return this.data2.reduce((a, b) => Math.min(a, b));
            }
            break;
        case 'data3':
            if (this.getDataLength(args) > 0) {
                return this.data3.reduce((a, b) => Math.min(a, b));
            }
            break;
        default:
            return 'error';
        }
    }

    _getMax (args) {
        switch (args.DATA_ID) {
        case 'data1':
            if (this.getDataLength(args) > 0) {
                return this.data1.reduce((a, b) => Math.max(a, b));
            }
            break;
        case 'data2':
            if (this.getDataLength(args) > 0) {
                return this.data2.reduce((a, b) => Math.max(a, b));
            }
            break;
        case 'data3':
            if (this.getDataLength(args) > 0) {
                return this.data3.reduce((a, b) => Math.max(a, b));
            }
            break;
        default:
            return 'error';
        }
    }

    setData (args) {

        switch (args.DATA_ID) {
        case 'data1':
            if (args.DATA.trim()) {
                const data = [];
                let dataIndex1 = 0;
                const splitedComma = args.DATA.split(',');
                for (let i = 0; i < splitedComma.length; i += 1) {
                    if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                        data[dataIndex1] = Cast.toNumber(splitedComma[i]);
                        dataIndex1++;
                    } else {
                        const splitedSpace = splitedComma[i].trim().split(' ');
                        for (let j = 0; j < splitedSpace.length; j += 1) {
                            if (splitedSpace[j].trim() && !isNaN(splitedSpace[j])) {
                                data[dataIndex1] = Cast.toNumber(splitedSpace[j]);
                                dataIndex1++;
                            }
                        }
                    }
                }

                this.data1 = data;
                this.dataIndex1 = -1;
            }
            break;
        case 'data2':
            if (args.DATA.trim()) {
                const data = [];
                let dataIndex2 = 0;
                const splitedComma = args.DATA.split(',');
                for (let i = 0; i < splitedComma.length; i += 1) {
                    if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                        data[dataIndex2] = Cast.toNumber(splitedComma[i]);
                        dataIndex2++;
                    } else {
                        const splitedSpace = splitedComma[i].trim().split(' ');
                        for (let j = 0; j < splitedSpace.length; j += 1) {
                            if (splitedSpace[j].trim() && !isNaN(splitedSpace[j])) {
                                data[dataIndex2] = Cast.toNumber(splitedSpace[j]);
                                dataIndex2++;
                            }
                        }
                    }
                }

                this.data2 = data;
                this.dataIndex2 = -1;
            }
            break;
        case 'data3':
            if (args.DATA.trim()) {
                const data = [];
                let dataIndex3 = 0;
                const splitedComma = args.DATA.split(',');
                for (let i = 0; i < splitedComma.length; i += 1) {
                    if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                        data[dataIndex3] = Cast.toNumber(splitedComma[i]);
                        dataIndex3++;
                    } else {
                        const splitedSpace = splitedComma[i].trim().split(' ');
                        for (let j = 0; j < splitedSpace.length; j += 1) {
                            if (splitedSpace[j].trim() && !isNaN(splitedSpace[j])) {
                                data[dataIndex3] = Cast.toNumber(splitedSpace[j]);
                                dataIndex3++;
                            }
                        }
                    }
                }

                this.data3 = data;
                this.dataIndex3 = -1;
            }
            break;


        default:
            return 'error';
        }
    }

    addValueToData (args) {
        switch (args.DATA_ID) {
        case 'data1':
            if (args.VALUE) {
                if (this.getDataLength(args) > 0) {
                    this.data1.push(Cast.toNumber(args.VALUE));
                } else {
                    args.DATA = Cast.toString(args.VALUE);
                    this.setData(args);
                }
            }
            break;
        case 'data2':
            if (args.VALUE) {
                if (this.getDataLength(args) > 0) {
                    this.data2.push(Cast.toNumber(args.VALUE));
                } else {
                    args.DATA = Cast.toString(args.VALUE);
                    this.setData(args);
                }
            }
            break;
        case 'data3':
            if (args.VALUE) {
                if (this.getDataLength(args) > 0) {
                    this.data3.push(Cast.toNumber(args.VALUE));
                } else {
                    args.DATA = Cast.toString(args.VALUE);
                    this.setData(args);
                }
            }
            break;
        default:
            return 'error';
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
                    let dataIndex = 0;
                    for (let i = (line - 1); i < lines.length; i += 1) {
                        const columns = lines[i].trim().split(',');
                        if (columns[column]) {
                            // Just to make sure we are getting only numbers.
                            // ToDo: cover more cases...
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
            const urlBase = `https://thingspeak.com/channels/${channel}/field/${field}.json`;

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
                    let dataIndex = 0;
                    for (const idx in feeds) {
                        if (feeds[idx].hasOwnProperty(`field${field}`)) {
                            const value = feeds[idx][`field${field}`].trim();
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

    // PROBLEMA: DOIS BLOCOS IGUAIS RODANDO AO MESMO TEMPO. PODERIA TER UMA VARIÁVEL QUE CHECA SE ESTÁ RODANDO.
    // SE SIM, NÃO DEIXA RODAR DE NOVO
    dataLoop (args, util) {
        switch (args.DATA_ID) {
        case 'data1':
            // FARIA SENTIDO JÁ TER UMA VARIÁVEL CONSTANTE PARA CADA TAMANHO DE DADO?
            if (this.dataIndex1 < this.getDataLength(args)) {
                this.dataIndex1++;
            }
            if (this.dataIndex1 < this.getDataLength(args)) {
                util.startBranch(1, true);
            } else {
                this.dataIndex1 = -1;
            }
            break;
        case 'data2':
            if (this.dataIndex2 < this.getDataLength(args)) {
                this.dataIndex2++;
            }
            if (this.dataIndex2 < this.getDataLength(args)) {
                util.startBranch(1, true);
            } else {
                this.dataIndex2 = -1;
            }
            break;
        case 'data3':
            if (this.dataIndex3 < this.getDataLength(args)) {
                this.dataIndex3++;
            }
            if (this.dataIndex3 < this.getDataLength(args)) {
                util.startBranch(1, true);
            } else {
                this.dataIndex3 = -1;
            }
            break;
        default:
            return 'error';
        }
    }

    getStatistic (args) {
        switch (args.FNC) {
        case 'mean':
            return this._getMean(args);
        case 'min':
            return this._getMin(args);
        case 'max':
            return this._getMax(args);
        default:
            return 0;
        }
    }

    changeDataScale (args) {
        switch (args.DATA_ID) {
        case 'data1':
            for (let i = 0; i < this.getDataLength(args); i += 1) {
                this.data1[i] = Cast.toNumber(this._mapValue(this.data1[i],
                    this._getMin(args), this._getMax(args), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
            }
            break;

        case 'data2':
            for (let i = 0; i < this.getDataLength(args); i += 1) {
                this.data2[i] = Cast.toNumber(this._mapValue(this.data2[i],
                    this._getMin(args), this._getMax(args), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
            }
            break;

        case 'data3':
            for (let i = 0; i < this.getDataLength(args); i += 1) {
                this.data3[i] = Cast.toNumber(this._mapValue(this.data3[i],
                    this._getMin(args), this._getMax(args), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
            }
            break;

        default:
            return;
        }
    }

    mapData (args) {
        switch (args.DATA_TYPE) {
        case 'index':
            if (this.getDataLength(args) > 0) {
                return Cast.toNumber(this._mapValue(
                    this._getInternalIndex(args),
                    0, this.getDataLength(args) - 1,
                    Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
            }
            break;
        case 'value':
            if (this.getDataLength(args) > 0) {
                return Cast.toNumber(this._mapValue(
                    this.getValue(args),
                    this._getMin(args), this._getMax(args),
                    Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
            }
            break;
        default:
            break;
        }
    }

    getDataIndex (args) {
        switch (args.DATA_ID) {
        case 'data1':
            if (args.INDEX > 0 && args.INDEX <= this.getDataLength(args)) {
                return this.data1[args.INDEX - 1];
            }
            break;
        case 'data2':
            if (args.INDEX > 0 && args.INDEX <= this.getDataLength(args)) {
                return this.data2[args.INDEX - 1];
            }
            break;
        case 'data3':
            if (args.INDEX > 0 && args.INDEX <= this.getDataLength(args)) {
                return this.data3[args.INDEX - 1];
            }
            break;
        default:
            return 'error';
        }
    }

    setScaleX (args, util) {
        util.target.scalex = Cast.toString(args.SCALEX) / 100;
        if (!util.target.scaley) {
            util.target.scaley = 1;
        }
        const finalScale = [util.target.size * util.target.scalex, util.target.size * util.target.scaley];
        this._runtime.renderer.updateDrawableProperties(
            util.target.drawableID, {direction: util.target.direction, scale: finalScale});
    }

    setScaleY (args, util) {
        util.target.scaley = Cast.toString(args.SCALEY) / 100;
        if (!util.target.scalex) {
            util.target.scalex = 1;
        }
        const finalScale = [util.target.size * util.target.scalex, util.target.size * util.target.scaley];
        this._runtime.renderer.updateDrawableProperties(
            util.target.drawableID, {direction: util.target.direction, scale: finalScale});
    }
}

module.exports = Scratch3DataViewerBlocks;
