const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const nets = require('nets');
const formatMessage = require('format-message');
const Runtime = require('../../engine/runtime'); //INCLUINDO


// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,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';

const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

class Scratch3DataViewerBlocks {

    constructor (runtime) {
        this._runtime = runtime;

        this.scalex = 100;
        this.scaley = 100;

        this._runtime.on(Runtime.PROJECT_START, this.reset.bind(this));
    }

    reset() {
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
            blocks: [
                {
                    opcode: 'setData',
                    text: formatMessage({
                        id: 'dataviewer.setData',
                        default: 'set [DATA_ID] to [DATA]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    	DATA_ID: { 					//INCLUINDO
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
                
				{
                    opcode: 'setScaleX',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.setSizeX',
                        default: 'set SizeX to [SCALEX]'
                    }),

                    arguments: {
                        SCALEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100

                        }
                    }
                },
                {
                    opcode: 'setScaleY',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.setSizeY',
                        default: 'set SizeY to [SCALEY]'
                    }),

                    arguments: {
                        SCALEY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100

                        }
                    }
                },
                {
                    opcode: 'addValueToData',
                    text: formatMessage({
                        id: 'dataviewer.addValueToData',
                        default: 'add value [VALUE] to [DATA_ID]'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    	DATA_ID: {				//INCLUINDO 4
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
                {
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
                {
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
                '---',
                {
                    opcode: 'dataLoop',
                    text: formatMessage({
                        id: 'dataviewer.dataLoop',
                        default: 'read all values from [DATA_ID]'
                    }),
                    blockType: BlockType.LOOP,
                    arguments: {
                    	DATA_ID: { 					//INCLUINDO 3
                            type: ArgumentType.STRING,
                            menu: 'dataId2',
                            defaultValue: 'data1'
                        	}
                        }
                },

                {
                    opcode: 'getValue', 
                    text: formatMessage({
                        id: 'dataviewer.getValue',
                        default: 'value from [DATA_ID]' //ao incluir o parâmetro DATA_ID deixa de ser possível usar o chekbox para mostrar o valor no palco
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                    	DATA_ID: { 					//INCLUINDO 5
                            type: ArgumentType.STRING,
                            menu: 'dataId',
                            defaultValue: 'data1'
                        	}
                        }
                },
                {
                    opcode: 'getIndex',
                    text: formatMessage({
                        id: 'dataviewer.getIndex',
                        default: 'index from [DATA_ID]'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                    	DATA_ID: { 					//INCLUINDO 5
                            type: ArgumentType.STRING,
                            menu: 'dataId',
                            defaultValue: 'data1'
                        	}
                        }
                },
                {
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
                {
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
                {
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
                {
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
                {
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
                        INDEX: { //AQUI ESSE INDEX TERIA QUE SER ESPECÍFICO PARA CADA DATASET?
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                }
            ],
            menus: {
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
                dataId: [ //INCLUINDO
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
                ], 

				dataId2: [ //INCLUINDO
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
                    },
					{
                        text: formatMessage({
                            id: 'dataviewer.menu.dataId.data1and2',
                            default: 'all data'
                        }),
                        value: 'data1and2'	//ARRUMAR
                    }
                ]
            }
        };
    }

    getDataLength (args) { 
    	switch(args.DATA_ID) {	//SE DEIXAR O SWITCH, FUNCIONA PARA O BLOCO DE TAMANHO, MAS NÃO PARA O DE LOOP - E VICE VERSA.
    		case "data1":
        		if (this.data1) {		//DÚVIDA: O QUE SIGNIFICA ISSO? - SE ESTÁ DEFINIDO
            		return this.data1.length;
        		} else {
            		return 0;
        		}
        		break;
        	case "data2":
        		if (this.data2) {
            		return this.data2.length;
        		} else {
            		return 0;
        		}
        		break;
        	case "data3":
        		if (this.data3) {
            		return this.data3.length;
        		} else {
            		return 0;
        		}
        		break;
        	case "data1and2":   // ADICIONANDO SÓ PARA TESTES - CORRIGIR DEPOIS
        		if (this.data2) {
            		return this.data2.length;
        		} else {
            		return 0;
        		}
        		break;
        	default:
        		return "error";
        }
    }


 /*   getDataLength (args) {  //COM ESSA OPÇÃO, FUNCIONA O LOOP (ERRADO), MAS NÃO O REPORTER BLOCK
        if (this.data1) {			//CHECA SE DEFINIU
            return this.data1.length;
        }
        if (this.data2) {
            return this.data2.length;
        } else {
            return 0;
        }
    }

*/


   /* getValue (args) { //OLD
        if (this.getDataLength() > 0 && this.dataIndex >= 0) {
            return this.data[this.dataIndex];
        } else {
            return '';
        }
    } */


    getValue (args) { // INCLUINDO 6
    	switch(args.DATA_ID) {
    	 	case "data1":
        		if (this.getDataLength(args) > 0 && this.dataIndex1 >= 0) {
            		return this.data1[this.dataIndex1];
        		} 
        		else {
            		return '';
         		}
         		break;
         	case "data2":
        		if (this.getDataLength(args) > 0 && this.dataIndex2 >= 0) {
            		return this.data2[this.dataIndex2];
        		} 
        		else {
            		return '';
         		}
         		break;
         	case "data3":
        		if (this.getDataLength(args) > 0 && this.dataIndex3 >= 0) {
            		return this.data3[this.dataIndex3];
        		} 
        		else {
            		return '';
         		}
         		break;
         	default:
                return "error";

        }
    }


   _getInternalIndex (args) { //ISSO FAZ SENTIDO?
   	   	//switch(args.DATA_ID) {
    	// 	case "data1":
    		if (this.data1) {
        		if (this.getDataLength(args) > 0 && this.dataIndex1 >= 0) {
            		return this.dataIndex1;
        		}
        	}
        //		break;
        //	case "data2":
       		if (this.data2) {
        		if (this.getDataLength(args) > 0 && this.dataIndex2 >= 0) {
            		return this.dataIndex2;
        		}
        	}
        	else {
            		return 0;
        		}
        //		break;
        //	default:
        //	return "error";
        //}
    }

    getIndex (args) {
		switch(args.DATA_ID) {
			case "data1":
        		const internalIndex1 = this._getInternalIndex(args);
        		if (internalIndex1 >= 0) {
            		return internalIndex1 + 1; //ARRUMAR TODOS INTERNALINDEX
        		} else {
            		return '';
        		}
        		break;
        	case "data2":
        		const internalIndex2 = this._getInternalIndex(args);
        		if (internalIndex2 >= 0) {
            		return internalIndex2 + 1; //ARRUMAR TODOS INTERNALINDEX
        		} else {
            		return '';
        		}
        		break;
        	case "data3":
        		const internalIndex3 = this._getInternalIndex(args);
        		if (internalIndex3 >= 0) {
            		return internalIndex3 + 1; //ARRUMAR TODOS INTERNALINDEX
        		} else {
            		return '';
        		}
        		break;
        	default: 
        		return "error";
    	}    
    }

    _mapValue (value, old_min, old_max, new_min, new_max) {
        return new_min + (value - old_min) * (new_max - new_min) / (old_max - old_min);
    }

    _getMean (args) {
        if (this.getDataLength(args) > 0) {
            var total = 0.0;
            for (var i = 0; i < this.getDataLength(args); i += 1) {
                total = total + this.data[i];
            }
            return total / this.getDataLength();
        }
    }

    _getMin (args) { 
    	switch (args.DATA_ID) {
    		case "data1":
        		if (this.getDataLength(args) > 0) {
            		return this.data1.reduce(function(a, b) {
                		return Math.min(a, b);
            		});            	
        		}
			break;
			case "data2":
        		if (this.getDataLength(args) > 0) {
            		return this.data2.reduce(function(a, b) {
                		return Math.min(a, b);
            		});            	
        		}
        	break;
			case "data3":
        		if (this.getDataLength(args) > 0) {
            		return this.data3.reduce(function(a, b) {
                		return Math.min(a, b);
            		});            	
        		}
        	break;
        	default:
        		return "error";
    	}
    }

    _getMax (args) {
		switch (args.DATA_ID) {
    		case "data1":
        		if (this.getDataLength(args) > 0) {
            		return this.data1.reduce(function(a, b) {
                		return Math.max(a, b);
            		});
        		}
        	break;
        	case "data2":
        		if (this.getDataLength(args) > 0) {
            		return this.data2.reduce(function(a, b) {
                		return Math.max(a, b);
            		});
        		}
        	break;
        	case "data3":
        		if (this.getDataLength(args) > 0) {
            		return this.data3.reduce(function(a, b) {
                		return Math.max(a, b);
            		});
        		}
        	break;
        	default:
        		return "error";
    	}
    }

    setData (args) { 				//ALTERADO PARA INCLUIR DATA1 E DATA2 - ARRUMAR IDENTAÇÃO

      switch(args.DATA_ID) {

		case "data1":
		    if (args.DATA.trim()) {
            	const data = [];
            	var dataIndex1 = 0;
            	const splitedComma = args.DATA.split(',');
            	for (var i = 0; i < splitedComma.length; i += 1) {
                	if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                    	data[dataIndex1] = Cast.toNumber(splitedComma[i]);
                    	dataIndex1++;
                	} else {
                    	const splitedSpace = splitedComma[i].trim().split(' ');
                    	for (var j = 0; j < splitedSpace.length; j += 1) {
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
        case "data2":
		    if (args.DATA.trim()) {
            	const data = [];
            	var dataIndex2 = 0;
            	const splitedComma = args.DATA.split(',');
            	for (var i = 0; i < splitedComma.length; i += 1) {
                	if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                    	data[dataIndex2] = Cast.toNumber(splitedComma[i]);
                    	dataIndex2++;
                	} else {
                    	const splitedSpace = splitedComma[i].trim().split(' ');
                    	for (var j = 0; j < splitedSpace.length; j += 1) {
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
        case "data3":
		    if (args.DATA.trim()) {
            	const data = [];
            	var dataIndex3 = 0;
            	const splitedComma = args.DATA.split(',');
            	for (var i = 0; i < splitedComma.length; i += 1) {
                	if (splitedComma[i].trim() && !isNaN(splitedComma[i])) {
                    	data[dataIndex3] = Cast.toNumber(splitedComma[i]);
                    	dataIndex3++;
                	} else {
                    	const splitedSpace = splitedComma[i].trim().split(' ');
                    	for (var j = 0; j < splitedSpace.length; j += 1) {
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
             return "error";
    }
    }


	
   /* setData (args) {  				ANTIGO - APAGAR
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

            this.data = data;				 //aqui define o this.data
            this.dataIndex = -1;
        }
    }
*/




    addValueToData (args) { //ALTERADO - ARRUMAR IDENTAÇÃO
     switch(args.DATA_ID) {
     	case "data1":
        if (args.VALUE) {
            if (this.getDataLength(args) > 0) {
                this.data1.push(Cast.toNumber(args.VALUE));
            } else {
                args.DATA = Cast.toString(args.VALUE);
                this.setData(args);
            }
        }
        break;
        case "data2":
        if (args.VALUE) {
            if (this.getDataLength(args) > 0) {
                this.data2.push(Cast.toNumber(args.VALUE));
            } else {
                args.DATA = Cast.toString(args.VALUE);
                this.setData(args);
            }
        }
        break;
        case "data3":
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
             return "error";
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

    dataLoop (args, util) {		
    	switch(args.DATA_ID) { //ADICIONANDO, ARRUMAR IDENTAÇÃO --- PROBLEMA: DOIS BLOCOS IGUAIS RODANDO AO MESMO TEMPO. PODERIA TER UMA VARIÁVEL QUE CHECA SE ESTÁ RODANDO. SE SIM, NÃO DEIXA RODAR DE NOVO
     	case "data1":
        	if (this.dataIndex1 < this.getDataLength(args)) { //FARIA SENTIDO JÁ TER UMA VARIÁVEL CONSTANTE PARA CADA TAMANHO DE DADO?
            	this.dataIndex1++;
        	}
        	if (this.dataIndex1 < this.getDataLength(args)) {
            	util.startBranch(1, true);
        	}
        	else {
            	this.dataIndex1 = -1;
       		}
       		break;
      	case "data2":
        	if (this.dataIndex2 < this.getDataLength(args)) { 
            	this.dataIndex2++;
        	}
        	if (this.dataIndex2 < this.getDataLength(args)) {
            	util.startBranch(1, true);
        	}
        	else {
            	this.dataIndex2 = -1;
       		}
       		break;
      	case "data3":
        	if (this.dataIndex3 < this.getDataLength(args)) { 
            	this.dataIndex3++;
        	}
        	if (this.dataIndex3 < this.getDataLength(args)) {
            	util.startBranch(1, true);
        	}
        	else {
            	this.dataIndex3 = -1;
       		}
       		break;
      	case "data1and2":
        	if (this.dataIndex2 < this.getDataLength(args)) { 
            	this.dataIndex2++;
            	this.dataIndex1++;
        	}
        	if (this.dataIndex2 < this.getDataLength(args)) {
            	util.startBranch(1, true);
        	}
        	else {
            	this.dataIndex2 = -1;
            	this.dataIndex1 = -1;
       		}
       		break;
       	default:
            return "error";
    	}
    }



    getStatistic (args) {
        switch(args.FNC) {
            case "mean":
                return this._getMean(args);
                break;
            case "min":
                return this._getMin(args);
                break;
            case "max":
                return this._getMax(args);
                break;
            default:
                return "error";
        }
    }

    changeDataScale (args) {
    	switch(args.DATA_ID) {

    		case "data1":
        		const old_min1 = this._getMin(args);
        		const old_max1 = this._getMax(args);
        		for (var i = 0; i < this.getDataLength(args); i += 1) {
            		this.data1[i] = Cast.toNumber(this._mapValue(
                		this.data1[i], old_min1, old_max1, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
        		}
        		break;

			case "data2":
        		const old_min2 = this._getMin(args);
        		const old_max2 = this._getMax(args);
        		for (var i = 0; i < this.getDataLength(args); i += 1) {
            		this.data2[i] = Cast.toNumber(this._mapValue(
                		this.data2[i], old_min2, old_max2, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
        		}
        		break;

			case "data3":
        		const old_min3 = this._getMin(args);
        		const old_max3 = this._getMax(args);
        		for (var i = 0; i < this.getDataLength(args); i += 1) {
            		this.data3[i] = Cast.toNumber(this._mapValue(
                		this.data3[i], old_min3, old_max3, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
        		}
        		break;

        	default:
        		return "error";
        }
    }


/* 
 	mapData (args) {	//OLD
        switch(args.DATA_TYPE) {
            case "index":
                if (this.getDataLength() > 0) {
                    return Cast.toNumber(this._mapValue(
                        this._getInternalIndex(), 0, this.getDataLength() - 1, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            case "value":
                if (this.getDataLength() > 0) {
                    return Cast.toNumber(this._mapValue(
                        this.getValue(), this._getMin(), this._getMax(), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            default:
                return "error";
        }
    }

*/


    mapData (args) { //TESTANDO
    switch(args.DATA_ID) {

    	case "data1":
        switch(args.DATA_TYPE) {
            case "index":
                if (this.getDataLength(args) > 0) {
                    return Cast.toNumber(this._mapValue(
                        this._getInternalIndex(args), 0, this.getDataLength(args) - 1, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            case "value":
                if (this.getDataLength(args) > 0) {
                    return Cast.toNumber(this._mapValue(
                        this.getValue(args), this._getMin(args), this._getMax(args), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            default:
                return "error";
        	break;
    		}

        case "data2":
            switch(args.DATA_TYPE) {
            case "index":
                if (this.getDataLength(args) > 0) {
                    return Cast.toNumber(this._mapValue(
                        this._getInternalIndex(args), 0, this.getDataLength(args) - 1, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            case "value":
                if (this.getDataLength(args) > 0) {
                    return Cast.toNumber(this._mapValue(
                        this.getValue(args), this._getMin(args), this._getMax(args), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            default:
                return "error";
        	break;
		}

       case "data3":
            switch(args.DATA_TYPE) {
            case "index":
                if (this.getDataLength(args) > 0) {
                    return Cast.toNumber(this._mapValue(
                        this._getInternalIndex(args), 0, this.getDataLength(args) - 1, Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            case "value":
                if (this.getDataLength(args) > 0) {
                    return Cast.toNumber(this._mapValue(
                        this.getValue(args), this._getMin(args), this._getMax(args), Cast.toNumber(args.NEW_MIN), Cast.toNumber(args.NEW_MAX)));
                }
                break;
            default:
                return "error";
        	break;
        
        //default:
        //	return "error";
		}

    }
	}

    getDataIndex (args) {  
    	switch(args.DATA_ID) {
        	case "data1":
        		if (args.INDEX > 0 && args.INDEX <= this.getDataLength(args)) {
            		return this.data1[args.INDEX - 1]; 
        		}
        		break;
			case "data2":
        		if (args.INDEX > 0 && args.INDEX <= this.getDataLength(args)) {
            		return this.data2[args.INDEX - 1]; 
        		}
        		break;
			case "data3":
        		if (args.INDEX > 0 && args.INDEX <= this.getDataLength(args)) {
            		return this.data3[args.INDEX - 1]; 
        		}
        		break;
        	default:
        		return "error";
        }
    }

/* ORIGINAL
    getDataIndex (args) {
        if (args.INDEX > 0 && args.INDEX <= this.getDataLength()) {
            return this.data[args.INDEX - 1];
        }
    }
*/

    setScaleX(args, util) {
        util.target.scalex = Cast.toString(args.SCALEX) / 100;
        if (util.target.scaley === undefined) {
            util.target.scaley = 1;
        }
        const finalScale = [util.target.size * util.target.scalex, util.target.size * util.target.scaley];
        this._runtime.renderer.updateDrawableProperties(util.target.drawableID, { direction: util.target.direction, scale: finalScale });
    }

    setScaleY(args, util) {
        util.target.scaley = Cast.toString(args.SCALEY) / 100;
        console.log(util.target.scalex);
        if (util.target.scalex === undefined) {
            util.target.scalex = 1;
        }
        const finalScale = [util.target.size * util.target.scalex, util.target.size * util.target.scaley];
        this._runtime.renderer.updateDrawableProperties(util.target.drawableID, { direction: util.target.direction, scale: finalScale })
	}
}

module.exports = Scratch3DataViewerBlocks;
