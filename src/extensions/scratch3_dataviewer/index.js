const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const RenderedTarget = require('../../sprites/rendered-target');
const Cast = require('../../util/cast');
const nets = require('nets');
const formatMessage = require('format-message');
const Runtime = require('../../engine/runtime');
const Variable = require('../../engine/variable');
const Data = require('../../blocks/scratch3_data');
const extTranslations = require('./locales.json');

const Clone = require('../../util/clone');
const Scratch3PenBlocks = require('../scratch3_pen/index.js');

// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABICAYAAAAAjFAZAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAEUNAABFDQGDN27CAAAAB3RJTUUH4gkWEAEloQM8bQAADSxJREFUeNrtmmtwVed1hp+lKwJLIBAyAmRDhGwDjrFMkGNjx07iXJzETlpP4jYtYzfN1J22aTv+0XYynUlnkj/90XbazrRNO5M2Tj1uM63Txq4Tx04AO/iKcQFfBOYuwIibhAAhocvXH312+o2KHQGS4073mjlzztlnn2+vtd613rW+tTeUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZTy/0VSSv8n9Uspxc/CnpgqIyMi/15xjmsW72MRMfZOg3AO/SqA3NuNwAlgLNN1NCLSudZ4VwKSK5kZCbAEqAJqgCZgJjAfOAzsALYCwz9RKmL0rZw3ifpFBsJSoAPo1SehPiNALVDv9y3ATiAVwLzrMyQD4r3ACmAx8ALQBtwMbAfmCNAeo3C6x4eB08Bzfh7NDb9QcMYBUenhBQLRbGDsMhsuEYgzBs02gUrADf63B9gdESOTHTgxWVFnxFUBVwN3a1A30Gn0VQM/FIAW4KCRF2bMCLDf43cA3wFeBnb728g4mjkvBxgolcD7zNITwKU6erYAVRgIs9TrMmAG8KrgHQT+03WGgb8HRtVtbDKAiUkCo8Jo+qKK7wfqpKrdRthZYKPHW8yWdg261qirBo4J5oMCtQz4J+AZ4JDn89PqTqYbOnAZ8DlgvWA0A9dLmdt08EoBawb61Pc2aarPrD8M7ANOSWcNwL8Br0xErykDZFxmXG1U9+jcFuCoNHVcpRNwwOhc5fFe4Fmj8Diw3OicJo3tBf4daAU+CTwAPA0MCPTbOsBAmQ3c6qE+Qdim7aeA1cCvu96LwMe0o9FsOAIsArrUcR3wEVmgG/h6Viu7fF1wjbnoDAHeD9wpKKfk4H7rw25pocNsOGY9+SAw6DldOqVJmrrELGj3WKuR+Hf+1iwws3TIqzpgbJxulUb0R4HN6jfLjOgQ4EsFfZPZMWRWD1lPtpsxPVmtGVTnPQZhH7BB8NYZjK8B/ReSLXERQISGtQE3quwcC18XcNLU/qKFerM1ZD7wHov9ELDQdG/XuGMe6/XcaWZYi5H4TaP+KPAPRnC14I/qyBnAx9XvOUGplrpWAFf5/wPqMUNwq/z8nMcH1XHQ9ZukvrAzrDQgnzIIa4A/8LyzQPf5ZsrFUNZyo+mXNKBN5WeraK/OfNr0H7O+7My6l3ojvFajq3RYGLmflyYade4WqW+hEbkY+AbwmGuecJ2PSDNDOnAz8NtmxCHX3+D3k8C/SKNbgCfMigUW9T7tDJuMFu2rFYAOA/EPpbt+PzdbCw9KrVMDSFY7Pimd/JqRujyrGQ8DdwHP65x/9lqHjPItEbE3pbTQNWaaYU2COF/DBwSx0ShM8v10DT1qhpzxmj3A/V5nyHM+bRRXeWyd1IefKz2vx3XDIBmIiD0ppSvU624B3wxcDtwumAMCdwx4xGyuj4ivppSuAbZHxOBUU9YqP/6yRvRaONdp9LAK3g38htH2ktn0gJFZr5O6I2J/SqnG42c93gzMNWN22u2cVef3GNGHPXerx2t8f8N6docAX2Um1QCvm30D0lO/teZN7Rjz1Zu15v1+v196/iuzYgT4FYG6weNH1XNbRKxPKd0UET+eqG+rLnCD1aoTknRxv5nRnaX09cA/Zq1qJ/AjnTJg774jpbQ0pdQGnI6I7uxyB3z/QUrpZuvPqIV5ZpYZnTpnh5H8pJl62u/VUtIKM7XYd4zpuJusda9KT9O87jZtOZNl84Ne8zeBhwyI513zMqmtFfhj4M6U0lPA4ZTSXODIRGjrQiirFbjSiFluh7XQ7mmfBfQVKWB9xt8PR8QbKaUmnTFd43dku+j/xbUZRc4GvuB+pN6u6Ergs+5t+mwmrvOcVXZJVXL/t9Wz2IyeNvPmukt/n1S0wQyapR2ndPIhr3GloHzdNbtsNLabUSuBP5UhGiPioZTSyoh4aSL+rbgAxroVWGvkndSphbJ9FtNNZsFx4F7gQcG43OxZBJyIiB05AOeKoOJYRBwH/kyOrjYgmo3QInOuMVpX6ZxkgX3BOjJPZ++Sbmr83m9m/Y2X7VTHDxr1XdJbu/TUJ/XeGRHPun/pcM1Gg60pY6DhqaKsuv/2TYymlKap8PPAr5riqzT2RuC7Al5njajUqDkRsWncmDsPjHSOzA33GqMppSeA35emdks53dap6Vmgvern35Iqz/i+D6iJiD2ZDs3SYLUUXCUo9TYn0yPi2ZRSlUC1uNYafdIP/Njzdwn0lcBfpJQ6zsfPVedTP0zHDR7aY4ofMsrWAn/tq9ZO6XVb4uK/JyNikyDU6vw6nVn062f8nLLfASKl1Gt302fUfdwi2ipF1Ged0meALxsElcCfGDANBs9P7m1ExGHrQUGNlwPrDYBK4LMppWPS646U0pqIeDmltM568hhwn7XpLPAps/KoWds1UT9PmLKkjtOmZeHgdXLnEeAef1soN68quijPXw7sM7Nm2QF9VIVPSH/F2r3+b7/r79KxX9boNuAT0uVqDX/DDm+/oJ6wRX5M+vqKQJ4G2lNKlW9Rr45HxMvANSml5oh4GPhzu8WrrIEbbUR6gS+p30xt+I6BMRIRA9bLuZMOiFKtM8nG0xtNz+VmTY17hy06ryKl1GIWXS8IrcC/RsQjEfFUROyPiO6I2B4Ru7M6s9TZ2D0OIzdatK917UXy9wl/+6bAfF9wh90j1TnO6LAmDABtBShZpuTAvAzUp5TmR8Re4I9scW+PiNf13Vnr5Qrb+ku8fgswK6W0ICIeswObEkByft+qYcWg8JSGF3OqpqxFvc//dkXEdyNiyzlmT/nXfrl+usV4riB9SWCqLNB9BsAZr/2ktaNC6pxrIb5f8A7aTbUL1pKUUkUOSgGMoOwEGlJKDRHRJ80+l1K6xbUvdcPabtZWSIlbs3EPQN9Eb/2eLyBtwN6U0hw7nPVSyZM6cFD+7TV9l5g5ZyNibUQczBU7hxMqU0q1Ov0u/1vvKb8oCIMW9NecBFdaq4rI/B0/L7N+nTEo1tjxvWjB7pTyWlNKVW8DSpdUVeF1OiJivROAV2z7T9pqX5sxSBfQmFK6DnhtoqOTivMs6i8ZvYssgsVQb59c3+rs6isW6vucNz2UUmosonGc0RUCUWE9+ZTOKmZinVlnUycgz9qifsYIfdH3zXZ4D9j1PO15BSjJUU6La15lm7piPH3l+rlJXS093ZBSWm0QrnStOwSkQf8UA8tt2bUnt8vSkW84NhmOiG47kls1/DZnOVcIVqU15i75fRHweEqpZxz9tRpV9daMuWbfvGyiXGfjMGRWdDs+f8Qd+n9YrK/QQfusJ79rwd+r8z+hkw5Z/BfowCpgWkppY0QMGYDV2a5+hlk/mt2D3+Sau8yG24FvyQpbzJomA3balMyyjJ7LMgUrjMjiJs512fh7hcX1Xjl1cwbUId+bstu+DTYFC3RCH3CL1+n1/92uW4wxtkfE47amt/mfHuDD0slJz68FPuQsbZtgVKj3ETPgiHp/Q6cXtwdOR8SbDhnf78zqa47ZO+zA1mjPC9a0Orut14HFEfHiVA8XO4GqiHjGOdM8I3GNxg8JRL8gHMjavzDK36tjG6XCQaO71kZh2GZhp87a72/hLVOcby1049aVjXbmucY6QR8RkJ/P9iq9Rveoe5hLzaxD6vxt6aa4f/454OfMyg8I2F/6/gX3Z29qQz3wewbbcacSUz5+X21EPSF9VAtEh4be6/ptAnFYRXdY+LfaJg5LW/1+P+o6ZwVhg9nTDHxP4BqsGauAITeb41vXy93Fn3C9GYJ/pxRZNAinstrYIN8vyWZxsz02U10+rM6Pyg6d/neXGXGzYD4DtEXEhnfkjqGgLHMU/pIOWyyX32jEXScAS4yeazSwx7Qe8H9FTXk0K55PuPZJ1/i+XUxx06ehyIqf8tjPTTrxoADPck9xzIxbquPr5P6mbPyOQXSPNm71+iMCtNQMmAn8rXYXs60TEbHvfJ9CmYyHHOqMimNG2wfk0Q9p4Olsmvp5eT6ZURVOTX/BaN2vgYstho9q4BIddgyojYitE3nkJtOx3np0vXcaP2bD0a7OQ37eaTtdFOnOrJs8bFZ9S9tmCNw8p8mPWwOHIuKRC30kaNIelEspLbGb6IqIEQd2n7bYj9ppnZS/Z2hgcZdxq1F31o6ouIcy107miADtyR9OuwAdGw2eJg/dIu1dwf88tVinjrs8p1Xawyybb9AkbdojiGuB1oh44WKezYpJAiOniDap4LQRdJs0tUzHL8zuR2zKOrZXpIcGz6+Rqnoc/k2mjg3Wl8Ve82qBr7LOVGeDzWkef9NAqTfzewVhrb+3FLXsZ/ag3NsZnR2riIgxqa3YY9T4814zo3i6ZJa01BUR/W+37iTrvdKG4oDU1W5732STMcdA6ZFGe8zs4mbZ7ogYnAw9p87Ki3TkVIPwFtdsybI7meEzgX35A+ClvDNglE4opZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllHex/Be06ni8Xeb5XwAAAABJRU5ErkJggg==';

// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,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';

const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

class Scratch3DataViewerBlocks {
    static get EXTENSION_INFO_COLOR1 () {
        // rgb(10,186,181)
        return '#0ABAB5';
    }

    static get EXTENSION_INFO_COLOR2 () {
        // rgb(255,255,255)
        return '#FFFFFF';
    }

    static get EXTENSION_INFO_COLOR3 () {
        // rgb(7,138,134)
        return '#078A86';
    }

    get READ_ALL_LISTS_ID () {
        return 'dataviewer#read#all#lists';
    }

    get MY_LIST_ID () {
        return 'dataviewer#my#list';
    }

    get DATA_TYPE_INDEX () {
        return 'index';
    }

    get DATA_TYPE_VALUE () {
        return 'value';
    }

    get ORDER_ASC () {
        return 'ASC';
    }

    get ORDER_DESC () {
        return 'DESC';
    }

    get READ_ALL_LISTS_VALUE () {
        return formatMessage({
            id: 'dataviewer.allLists',
            default: 'all lists'});
    }

    get STATISTIC_AVERAGE () {
        return 'average';
    }

    get STATISTIC_LENGTH () {
        return 'length';
    }

    get STATISTIC_COUNT () {
        return 'count';
    }

    get STATISTIC_SUM () {
        return 'sum';
    }

    get STATISTIC_MIN () {
        return 'min';
    }

    get STATISTIC_MAX () {
        return 'max';
    }

    constructor (runtime) {
        this._runtime = runtime;

        // Variable names needs translation and they are created on _blocksInfoUpdate().
        this._setupTranslations();

        // Always starts with the minimal-block version.
        this._runtime.DataviewerMinimalBlocks = true;

        this.dataBlocks = new Data(this._runtime);

        this._pen = new Scratch3PenBlocks(this._runtime);

        // If we have any visual change, we might have to apply the scale property again.
        this._eventTargetVisualChange = this._eventTargetVisualChange.bind(this);

        // If clones are created, we have to apply the scale property to them.
        this._onTargetCreated = this._onTargetCreated.bind(this);
        this._runtime.on('targetWasCreated', this._onTargetCreated);

        // When we are loading the extension automatically, there is no stage at this point.
        // The work-around is to wait for the BLOCKSINFO_UPDATE event.
        // But, if we are dynamically loading it, we won't get any BLOCKSINFO_UPDATE event soon,
        // so it's better to call _blocksInfoUpdate right now.
        this._runtime.on(Runtime.BLOCKSINFO_UPDATE, this._blocksInfoUpdate.bind(this));
        this._blocksInfoUpdate();
    }

    _blocksInfoUpdate () {
        // Create the initial list.
        const stage = this._runtime.getTargetForStage();
        if (stage) {
            const varName = formatMessage({
                id: 'dataviewer.list',
                default: 'my list'});
            const variable = stage.lookupOrCreateList(this.MY_LIST_ID, varName);
            variable._monitorUpToDate = false;

            // Show the new variable on toolbox
            this._runtime.requestBlocksUpdate();
        }
    }

    _setupTranslations () {
        const localeSetup = formatMessage.setup({missingTranslation: 'ignore'});
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
            name: formatMessage({
                id: 'dataviewer.categoryName',
                default: 'PlayData',
                description: 'Label for the PlayData extension category'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: this.addBlocks(),
            menus: this.addMenus(),
            customFieldTypes: {}
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
            createListsFromURL: {
                opcode: 'createListsFromURL',
                text: formatMessage({
                    id: 'dataviewer.createListsFromURL',
                    default: 'create lists from [URL]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    URL: {
                        type: ArgumentType.STRING,
                        defaultValue: formatMessage({
                            id: 'dataviewer.createListsFromURL.default',
                            default: 'link'
                        })
                    }
                }
            },
            setData: {
                opcode: 'setData',
                text: formatMessage({
                    id: 'dataviewer.setData',
                    default: 'set [LIST_ID] to [DATA]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    },
                    DATA: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    }
                }
            },
            deleteAllLists: {
                opcode: 'deleteAllLists',
                text: formatMessage({
                    id: 'dataviewer.deleteAllLists',
                    default: 'delete all lists'
                }),
                blockType: BlockType.COMMAND
            },
            readCSVDataFromURL: {
                opcode: 'readCSVDataFromURL',
                text: formatMessage({
                    id: 'dataviewer.readCSVDataFromURL',
                    default: 'read CSV data from column [COLUMN] at [URL] starting from line [LINE]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    COLUMN: {
                        type: ArgumentType.NUMBER,
                        defaultValue: ' '
                    },
                    URL: {
                        type: ArgumentType.STRING,
                        defaultValue: formatMessage({
                            id: 'dataviewer.readCSVDataFromURL.default',
                            default: 'link'
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
                disableMonitor: true,
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
                    default: 'for each value of [LIST_ID]'
                }),
                blockType: BlockType.LOOP,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataLoopMenu',
                        defaultValue: this.getDataMenuDefaultValue(true)
                    }
                }
            },
            dataLoopAllLists: {
                opcode: 'dataLoopAllLists',
                text: formatMessage({
                    id: 'dataviewer.dataLoopAllLists',
                    default: 'for each value'
                }),
                blockType: BlockType.LOOP
            },
            getValue: {
                opcode: 'getValue',
                text: formatMessage({
                    id: 'dataviewer.getValue',
                    default: 'value of [LIST_ID]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    }
                }
            },
            getIndex: {
                opcode: 'getIndex',
                text: formatMessage({
                    id: 'dataviewer.getIndex',
                    default: 'index of [LIST_ID]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    }
                }
            },
            getValueIndex: {
                opcode: 'getValueIndex',
                text: formatMessage({
                    id: 'dataviewer.getValueIndex',
                    default: '[DATA_TYPE] of [LIST_ID]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    DATA_TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'dataType',
                        defaultValue: this.DATA_TYPE_VALUE
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    }
                }
            },
            getStatistic: {
                opcode: 'getStatistic',
                text: formatMessage({
                    id: 'dataviewer.getStatistic',
                    default: '[FNC] of [LIST_ID]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    },
                    FNC: {
                        type: ArgumentType.STRING,
                        menu: 'statisticFunctions',
                        defaultValue: this.STATISTIC_AVERAGE
                    }
                }
            },
            deleteOfList: {
                opcode: 'deleteOfList',
                text: formatMessage({
                    id: 'dataviewer.deleteOfList',
                    default: 'delete [DATA_TYPE] [OP] [VALUE] of [LIST_ID] from [DATASET]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    DATA_TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'dataType',
                        defaultValue: 'value'
                    },
                    OP: {
                        type: ArgumentType.STRING,
                        menu: 'deleteListOpMenu',
                        defaultValue: '='
                    },
                    VALUE: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue(false)
                    },
                    DATASET: {
                        type: ArgumentType.STRING,
                        menu: 'dataLoopMenu',
                        defaultValue: this.getDataMenuDefaultValue(true)
                    }
                }
            },
            deleteOfListAllLists: {
                opcode: 'deleteOfListAllLists',
                text: formatMessage({
                    id: 'dataviewer.deleteOfListAllLists',
                    default: 'delete values [OP] [VALUE] of [LIST_ID]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    OP: {
                        type: ArgumentType.STRING,
                        menu: 'deleteListOpMenu',
                        defaultValue: '='
                    },
                    VALUE: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue(false)
                    }
                }
            },
            selectListAllLists: {
                opcode: 'selectListAllLists',
                text: formatMessage({
                    id: 'dataviewer.selectListAllLists',
                    default: 'select values [OP] [VALUE] of [LIST_ID]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    OP: {
                        type: ArgumentType.STRING,
                        menu: 'selectListOpMenu',
                        defaultValue: '<'
                    },
                    VALUE: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue(false)
                    }
                }
            },
            orderList: {
                opcode: 'orderList',
                text: formatMessage({
                    id: 'dataviewer.orderList',
                    default: 'order values of [LIST_ID] [ORDER] from [DATASET]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    ORDER: {
                        type: ArgumentType.STRING,
                        menu: 'orderListMenu',
                        defaultValue: this.ORDER_ASC
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue(false)
                    },
                    DATASET: {
                        type: ArgumentType.STRING,
                        menu: 'dataLoopMenu',
                        defaultValue: this.getDataMenuDefaultValue(true)
                    }
                }
            },
            orderListAllLists: {
                opcode: 'orderListAllLists',
                text: formatMessage({
                    id: 'dataviewer.orderListAllLists',
                    default: 'order values of [LIST_ID] [ORDER]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    ORDER: {
                        type: ArgumentType.STRING,
                        menu: 'orderListMenu',
                        defaultValue: this.ORDER_ASC
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue(false)
                    }
                }
            },
            changeDataScale: {
                opcode: 'changeDataScale',
                text: formatMessage({
                    id: 'dataviewer.changeDataScale',
                    default: 'change [LIST_ID] to scale from [NEW_MIN] to [NEW_MAX]'
                }),
                blockType: BlockType.COMMAND,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
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
                    default: '[DATA_TYPE] of [LIST_ID] to [NEW_MIN] ⇔ [NEW_MAX]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    DATA_TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'dataType',
                        defaultValue: this.DATA_TYPE_VALUE
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
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
            mapDataFromTo: {
                opcode: 'mapDataFromTo',
                text: formatMessage({
                    id: 'dataviewer.mapDataFromTo',
                    default: '[DATA_TYPE] of [LIST_ID] from [OLD_MIN] ⇔ [OLD_MAX] to [NEW_MIN] ⇔ [NEW_MAX]'
                }),
                blockType: BlockType.REPORTER,
                disableMonitor: true,
                arguments: {
                    DATA_TYPE: {
                        type: ArgumentType.STRING,
                        menu: 'dataType',
                        defaultValue: this.DATA_TYPE_VALUE
                    },
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    },

                    OLD_MIN: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    OLD_MAX: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100
                    },
                    NEW_MIN: {
                        type: ArgumentType.NUMBER,
                        defaultValue: -240
                    },
                    NEW_MAX: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 240
                    }
                }
            },
            groupBy: {
                opcode: 'groupBy',
                text: formatMessage({
                    id: 'dataviewer.groupBy',
                    default: 'calculate [FNC] group by [LIST_ID]'
                }),
                blockType: BlockType.COMMAND,
                disableMonitor: true,
                arguments: {
                    LIST_ID: {
                        type: ArgumentType.STRING,
                        menu: 'dataMenu',
                        defaultValue: this.getDataMenuDefaultValue()
                    },
                    FNC: {
                        type: ArgumentType.STRING,
                        menu: 'statisticFunctions',
                        defaultValue: this.STATISTIC_AVERAGE
                    }
                }
            },
            setScaleX: {
                opcode: 'setScaleX',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'dataviewer.setSizeX',
                    default: 'set width to [SCALEX] %'
                }),
                filter: [TargetType.SPRITE],
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
                    default: 'set height to [SCALEY] %'
                }),
                filter: [TargetType.SPRITE],
                arguments: {
                    SCALEY: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 100
                    }
                }
            },
            stampText: {
                opcode: 'stampText',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'dataviewer.stampText',
                    default: 'stamp text [TEXT] with color [COLOR]'
                }),
                arguments: {
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: 'PlayData'
                    },
                    COLOR: {
                        type: ArgumentType.COLOR,
                        defaultValue: Scratch3DataViewerBlocks.EXTENSION_INFO_COLOR3
                    }
                }
            },
            clearText: {
                opcode: 'clearText',
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: 'dataviewer.clearText',
                    default: 'erase all texts'
                })
            }
        };
        const blocks = [
            allBlocks.createListsFromURL,
            allBlocks.deleteAllLists,
            '---',
            allBlocks.dataLoopAllLists,
            '---',
            allBlocks.getValueIndex,
            allBlocks.mapData,
            allBlocks.getStatistic,
            '---',
            allBlocks.stampText,
            allBlocks.clearText,
            '---',
            allBlocks.setScaleX,
            allBlocks.setScaleY,
            '---'
        ];
        if (this._runtime.DataviewerMinimalBlocks) {
            blocks.push(
                allBlocks.showMoreBlocks
            );
        } else {
            blocks.push(
                allBlocks.showLessBlocks,
                '---',
                allBlocks.groupBy,
                allBlocks.selectListAllLists,
                allBlocks.orderListAllLists,
                '---',
                allBlocks.mapDataFromTo,
                allBlocks.setData
            );
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
                        id: 'dataviewer.menu.statisticFunctions.average',
                        default: this.STATISTIC_AVERAGE
                    }),
                    value: this.STATISTIC_AVERAGE
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.count',
                        default: this.STATISTIC_COUNT
                    }),
                    value: this.STATISTIC_COUNT
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.sum',
                        default: this.STATISTIC_SUM
                    }),
                    value: this.STATISTIC_SUM
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.min',
                        default: this.STATISTIC_MIN
                    }),
                    value: this.STATISTIC_MIN
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.statisticFunctions.max',
                        default: this.STATISTIC_MAX
                    }),
                    value: this.STATISTIC_MAX
                }
            ],
            deleteListOpMenu: [
                {
                    text: '>', value: '>'
                },
                {
                    text: '≥', value: '>='
                },
                {
                    text: '<', value: '<'
                },
                {
                    text: '≤', value: '<='
                },
                {
                    text: '=', value: '='
                },
                {
                    text: '≠', value: '!='
                }
            ],
            selectListOpMenu: [
                {
                    text: '>', value: '<='
                },
                {
                    text: '≥', value: '<'
                },
                {
                    text: '<', value: '>='
                },
                {
                    text: '≤', value: '>'
                },
                {
                    text: '=', value: '!='
                },
                {
                    text: '≠', value: '='
                }
            ],
            orderListMenu: [
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.orderList.ascendant',
                        default: 'ascendanting'
                    }),
                    value: this.ORDER_ASC
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.orderList.descendent',
                        default: 'descendenting'
                    }),
                    value: this.ORDER_DESC
                }
            ],

            dataType: [
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataType.value',
                        default: 'value'
                    }),
                    value: this.DATA_TYPE_VALUE
                },
                {
                    text: formatMessage({
                        id: 'dataviewer.menu.dataType.index',
                        default: 'index'
                    }),
                    value: this.DATA_TYPE_INDEX
                }
            ],
            dataMenu: {
                items: 'getDataMenu'
            },
            dataLoopMenu: {
                items: 'getDataLoopMenu'
            }

        };
    }

    getDataLoopMenu () {
        const items = [{text: this.READ_ALL_LISTS_VALUE, value: this.READ_ALL_LISTS_ID}];
        this.getDataMenu().forEach(item => items.push(item));
        return items;
    }

    getDataMenu () {
        const stage = this._runtime.getTargetForStage();
        const items = [];
        if (stage) {
            for (const varId in stage.variables) {
                const currVar = stage.variables[varId];
                if (currVar.type === Variable.LIST_TYPE && currVar.name) {
                    items.push(({text: currVar.name, value: currVar.id}));
                }
            }
            // Parece melhor não ordenar para que as variáves apareçam na mesma ordem
            // das colunas no dropdown.
            // items.sort((a, b) => {
            //     const _a = a.text.toUpperCase();
            //     const _b = b.text.toUpperCase();
            //     return _a > _b ? 1 : -1;
            // });
        }
        return items;
    }

    getDataMenuDefaultValue (isDataLoopMenu = false) {
        let items;
        if (isDataLoopMenu) {
            items = this.getDataLoopMenu();
        } else {
            items = this.getDataMenu();
        }
        if (items.length > 0) {
            return items[0].value;
        }
    }

    _listsToDataset () {
        const dataset = [];

        const maxDataLengthReadAll = this._getMaxDataLengthReadAll();
        const items = this.getDataMenu().filter(item => this._data(item.value).value.length);
        
        for (let i = 0; i < maxDataLengthReadAll; i++) {
            const data = {};
            items.forEach(item => {
                data[item.value] = this._data(item.value).value[i];
            });
            dataset.push(data);
        }

        return dataset;
    }

    _datasetToLists (dataset) {
        const lists = {};
        dataset.forEach((item, index) => {
            Object.keys(dataset[0]).forEach(listID => {
                if (index === 0) {
                    lists[listID] = [];
                }
                lists[listID].push(dataset[index][listID]);
            });
        });

        return lists;
    }

    _data (varID) {
        const stage = this._runtime.getTargetForStage();
        if (stage) {
            const variable = stage.lookupOrCreateList(varID, varID);
            return variable;
        }
    }

    _getMaxDataLengthReadAll () {
        const items = this.getDataMenu();
        const datasets = items.map(item => this._data(item.value).value);
        const length = datasets.reduce((a, b) => {
            const aLength = a ? a.length : 0;
            const bLength = b ? b.length : 0;
            return aLength > bLength ? a : b;
        }).length;
        return length;
    }

    getDataLength (args) {
        if (args.LIST_ID === this.READ_ALL_LISTS_ID) {
            return this._getMaxDataLengthReadAll();
        }
        return this.dataBlocks.lengthOfList(
            {LIST: {id: args.LIST_ID, name: args.LIST_ID}},
            {target: this._runtime.getTargetForStage()}
        );
    }

    _getValue (args, util) {
        const data = this._data(args.LIST_ID);
        const index = this._getInternalIndex(args, util);

        if (this.getDataLength(args) > 0 && index >= 0) {
            return data.value[index];
        }
    }

    getValue (args, util) {
        const value = this._getValue(args, util);
        if (typeof value !== 'undefined') {
            return value;
        }
        return '';
    }

    // 0-based list
    _getInternalIndex (args, util) {
        // Suports nested data loops
        for (let i = util.thread.stackFrames.length - 1; i >= 0; i -= 1) {
            const stackFrame = util.thread.stackFrames[i].executionContext;
            if (stackFrame &&
                (stackFrame.dataviewerListID === args.LIST_ID ||
                    stackFrame.dataviewerListID === this.READ_ALL_LISTS_ID) &&
                typeof stackFrame.loopCounter !== 'undefined' &&
                stackFrame.loopLength - stackFrame.loopCounter > 0 &&
                stackFrame.loopCounter < this.getDataLength(args)) {
                const dataviewerIndex = stackFrame.loopCounter;
                return dataviewerIndex;
            }
        }
    }

    // 1-based list
    _getIndex (args, util) {
        if (this._getInternalIndex(args, util) >= 0) {
            return this._getInternalIndex(args, util) + 1;
        }
    }

    getIndex (args, util) {
        const index = this._getIndex(args, util);
        if (typeof index !== 'undefined') {
            return index;
        }
        return '';
    }

    _getValueIndex (args, util) {
        if (typeof args.DATA_TYPE === 'undefined') {
            args.DATA_TYPE = this.DATA_TYPE_VALUE;
        }
        if (args.DATA_TYPE === this.DATA_TYPE_INDEX) {
            return this._getIndex(args, util);
        } else {
            return this._getValue(args, util);
        }
    }

    getValueIndex (args, util) {
        const valueIndex = this._getValueIndex(args, util);
        if (typeof valueIndex !== 'undefined') {
            return valueIndex;
        }
        return '';
    }

    // Apesar de ser convertido para Number, é esperado que os dados sejam tratados antes
    // de chamar a função para evitar um retorno NaN.
    _mapValue (value, oldMin, oldMax, newMin, newMax) {
        return Number(newMin) + Number((value - oldMin) * (newMax - newMin) / (oldMax - oldMin));
    }

    _getSum (args) {
        if (this.getDataLength(args) > 0) {
            let total = 0.0;
            for (let i = 0; i < this.getDataLength(args); i += 1) {
                total = total + Number(this._data(args.LIST_ID).value[i]);
            }
            if (!isNaN(total)) {
                return total;
            }
        }
    }

    _getAverage (args) {
        if (this.getDataLength(args) > 0) {
            const total = this._getSum(args);
            if (!isNaN(total)) {
                return total / this.getDataLength(args);
            }
        }
    }

    _getMin (args) {
        if (this.getDataLength(args) > 0) {
            const value = this._data(args.LIST_ID).value
                .filter(i => i !== '')
                .reduce((a, b) => Math.min(a, b));
            if (!isNaN(value)) {
                return value;
            }
        }
    }

    _getMax (args) {
        if (this.getDataLength(args) > 0) {
            const value = this._data(args.LIST_ID).value
                .filter(i => i !== '')
                .reduce((a, b) => Math.max(a, b));
            if (!isNaN(value)) {
                return value;
            }
        }
    }

    _textToData (text) {
        // Accept comma or space separated values
        // Accept strings, but try to keep numbers as numbers
        return text.split(/[\s|,]/)
            .filter(i => i !== '')
            .map(i => {
                if (!isNaN(i)) {
                    return Cast.toNumber(i);
                }
                return i;
            });
    }

    setData (args) {
        const data = this._data(args.LIST_ID);
        if (data) {
            if (Array.isArray(args.DATA)) {
                data.value = args.DATA;
            } else {
                data.value = this._textToData(args.DATA);

            }
            data._monitorUpToDate = false;
        }
    }

    _resolveURLBase (URL) {
        const googleSheets = URL.match('docs.google.com/spreadsheets/d/(.*)/edit') || false;
        let urlBase = URL;
        if (googleSheets) {
            const spreadsheetId = googleSheets[1];
            // Prod
            const googleAPIkey = 'AIzaSyA-P95wQTOv1exXluKxZBOb-3jGmUvYiFE';
            // Dev
            // const googleAPIkey = 'AIzaSyCc2PwRrUNwXwCvQ-7cjkqeMcWcsoPlt5Q';
            urlBase = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=true&key=${googleAPIkey}`;
        }
        return [urlBase, googleSheets && googleSheets.length > 0];
    }

    readCSVDataFromURL (args) {
        if (args.URL.trim() && args.COLUMN && args.LINE) {
            const [urlBase, isGoogleSpreadsheet] = this._resolveURLBase(args.URL.trim());
            const column = args.COLUMN - 1;
            // const line = args.LINE;
            return new Promise((resolve, reject) => {
                nets({url: urlBase, timeout: serverTimeoutMs}, (err, res, body) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.statusCode !== 200) {
                        return reject('statusCode != 200');
                    }

                    let lists;
                    if (isGoogleSpreadsheet) {
                        lists = this._convertGoogleSheetsToLists(body);
                    } else {
                        lists = this._convertCSVToLists(body);
                    }
                    const data = lists[Object.keys(lists)[column]];
                    if (typeof data === 'undefined' || data.length === 0) {
                        return resolve('');
                    }

                    return resolve(data);
                });
            });
        }
    }

    _convertGoogleSheetsToLists (body) {
        const json = JSON.parse(body.toString());

        const rows = json.sheets[0].data[0].rowData;
        let maxColumns = rows[0].values.length;
        const lists = {};
        for (let row = 0; row < rows.length; row++) {
            for (let col = 0; col < maxColumns; col++) {
                let value;
                const colValue = rows[row].values[col];
                if (typeof colValue !== 'undefined' && colValue.effectiveValue) {
                    if (colValue.effectiveValue.hasOwnProperty('numberValue')) {
                        value = colValue.effectiveValue.numberValue;
                        if (colValue.hasOwnProperty('userEnteredFormat') && 
                            colValue.userEnteredFormat.hasOwnProperty('numberFormat')) {
                            if (colValue.userEnteredFormat.numberFormat.hasOwnProperty('type') && 
                                colValue.userEnteredFormat.numberFormat.type === 'DATE_TIME') {
                                    value = colValue.formattedValue;
                            } else if (colValue.userEnteredFormat.numberFormat.hasOwnProperty('pattern')) {
                                let numberFormat = colValue.userEnteredFormat.numberFormat.pattern;
                                let dotPosition = numberFormat.search(/[.]/) + 1;
                                if (dotPosition > 0) {
                                    let decimals = numberFormat.length - dotPosition;
                                    value = value.toFixed(decimals);
                                }
                            }
                        }
                    } else if (colValue.effectiveValue.hasOwnProperty('errorValue')) {
                        value = colValue.formattedValue;
                    } else {
                        value = colValue.effectiveValue.stringValue;
                    }
                } else {
                    value = '';
                }
                if (row === 0) {
                    // eslint-disable-next-line no-negated-condition
                    if (value !== '') {
						// Adding a space if the key is numeric to keep the order of the keys
                        lists[!isNaN(value) ? ` ${value}` : value] = [];
                    // Ignore values starting from the first unamed column
                    } else {
                        maxColumns = col;
                    }
                } else {
                    lists[Object.keys(lists)[col]][row - 1] = value;
                }
            }
        }
        return lists;
    }

    _convertCSVToLists (body) {
        const lines = body.toString().split('\n');
        const lists = {};
        let maxColumns;
        for (let line = 0; line < lines.length; line += 1) {
            const columns = lines[line].trim().split(',');
            // maxColumns might be overwrite if there are any unamed column.
            if (line === 0) {
                maxColumns = columns.length;
            }
            for (let column = 0; column < maxColumns; column += 1) {
                if (line === 0) {
                    // eslint-disable-next-line no-negated-condition
                    if (columns[column] !== '') {
                        lists[columns[column]] = [];
                    // Ignore values starting from the first unamed column
                    } else {
                        maxColumns = column;
                    }
                } else {
                    lists[Object.keys(lists)[column]][line - 1] = columns[column];
                }
            }
        }

        return lists;
    }

    createListsFromURL (args) {
        if (args.URL.trim()) {
            const [urlBase, isGoogleSpreadsheet] = this._resolveURLBase(args.URL.trim());
            return new Promise((resolve, reject) => {
                nets({url: urlBase, timeout: serverTimeoutMs}, (err, res, body) => {
                    if (err) {
                        return reject(err);
                    }
                    if (res.statusCode !== 200) {
                        return reject('statusCode != 200');
                    }

                    let lists;
                    if (isGoogleSpreadsheet) {
                        lists = this._convertGoogleSheetsToLists(body);
                    } else {
                        lists = this._convertCSVToLists(body);
                    }
                    for (const [key, value] of Object.entries(lists)) {
                        this._data(key).value = value;
                        this._data(key)._monitorUpToDate = false;
                    }

                    // Show new variables on toolbox.
                    this._runtime.requestToolboxExtensionsUpdate();

                    return resolve();
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

                    return resolve();
                });
            });
        }
    }

    dataLoop (args, util) {
        // Initialize loop
        if (typeof util.stackFrame.loopCounter === 'undefined') {
            util.stackFrame.loopLength = this.getDataLength(args);
            util.stackFrame.loopCounter = -1;
            util.stackFrame.dataviewerListID = args.LIST_ID;
        }

        util.stackFrame.loopCounter++;
        // If we still have some left, start the branch.
        if (util.stackFrame.loopLength - util.stackFrame.loopCounter > 0) {
            util.startBranch(1, true);
        }
    }

    dataLoopAllLists (args, util) {
        args.LIST_ID = this.READ_ALL_LISTS_ID;
        this.dataLoop(args, util);
    }

    getStatistic (args) {
        let value;
        switch (args.FNC) {
        case this.STATISTIC_AVERAGE:
            value = this._getAverage(args);
            break;
        case this.STATISTIC_LENGTH:
        case this.STATISTIC_COUNT:
            value = this.getDataLength(args);
            break;
        case this.STATISTIC_SUM:
            value = this._getSum(args);
            break;
        case this.STATISTIC_MIN:
            value = this._getMin(args);
            break;
        case this.STATISTIC_MAX:
            value = this._getMax(args);
            break;
        }
        if (typeof value !== 'undefined') {
            return value;
        }
        return '';
    }

    _deleteValueInList (value, deleteValue, OP) {
        switch (OP) {
        case '>':
            return (value > deleteValue);
        case '>=':
            return (value >= deleteValue);
        case '<':
            return (value < deleteValue);
        case '<=':
            return (value <= deleteValue);
        case '=':
            return (value == deleteValue);
        case '!=':
            return (value != deleteValue);
        default:
            return false;
        }
    }

    deleteAllLists () {
        const lists = this.getDataMenu();
        const stage = this._runtime.getTargetForStage();

        // BUG: We need to wait for the changeMonitorVisibility event to finish before delete variables
        // that are monitored, otherwise the thread that list monitor content will recreate
        // the lists for the sprite.
        lists.forEach(item => {
            if (item.value === this.MY_LIST_ID) {
                this._data(item.value).value = [];

            } else {
                this.dataBlocks.hideList({LIST: {id: item.value}});
                stage.deleteVariable(item.value);
            }
        });
        // Show new variables on toolbox.
        this._runtime.requestToolboxExtensionsUpdate();
    }

    deleteOfList (args) {
        let deleteValue = args.VALUE.trim();
        if (deleteValue !== '' && !isNaN(args.VALUE)) {
            deleteValue = Cast.toNumber(args.VALUE);
        }
        if (typeof args.DATASET === 'undefined') {
            args.DATASET = args.LIST_ID;
        }

        const deleteValueIndex = [];
        this._data(args.LIST_ID).value.forEach((item, index) => {
            let currentValue;
            if (args.DATA_TYPE === this.DATA_TYPE_INDEX) {
                currentValue = index + 1;
            } else {
                currentValue = item;
            }
            if (this._deleteValueInList(currentValue, deleteValue, args.OP)) {
                deleteValueIndex.push(index);
            }
        });

        const lists = [];
        if (args.DATASET === this.READ_ALL_LISTS_ID) {
            const items = this.getDataMenu();
            items.forEach(item => lists.push(this._data(item.value)));
        } else {
            lists.push(this._data(args.DATASET));
        }

        lists.forEach(list => {
            deleteValueIndex.forEach(index => delete list.value[index]);
            const newValues = list.value.filter(value => typeof value !== 'undefined');

            list.value = newValues;
            list._monitorUpToDate = false;
        });
    }

    deleteOfListAllLists (args) {
        args.DATA_TYPE = this.DATA_TYPE_VALUE;
        args.DATASET = this.READ_ALL_LISTS_ID;
        this.deleteOfList(args);
    }

    selectListAllLists (args) {
        // Same implementation of delete, but using inverted operators (selectListOpMenu)
        this.deleteOfListAllLists(args);
    }

    orderList (args) {
        if (args.DATASET === this.READ_ALL_LISTS_ID) {
            const dataset = this._listsToDataset();
            const collator = new Intl.Collator(undefined, {
                numeric: true,
                sensitivity: 'base'
            });
            dataset.sort((a, b) => {
                let x;
                // collator.compare does not work for decimals, so we compare numbers first.
                if (!isNaN(a[args.LIST_ID]) && !isNaN(b[args.LIST_ID])) {
                    x = a[args.LIST_ID] - b[args.LIST_ID];
                } else {
                    x = collator.compare(a[args.LIST_ID], b[args.LIST_ID]);
                }
                if (args.ORDER === 'DESC') {
                    x = x * -1;
                }
                return x;
            });
            const lists = this._datasetToLists(dataset);
            Object.keys(lists).forEach(listID => {
                this._data(listID).value = lists[listID];
                this._data(listID)._monitorUpToDate = false;
            });
        } else {
            const collator = new Intl.Collator(undefined, {
                numeric: true,
                sensitivity: 'base'
            });
            this._data(args.LIST_ID).value.sort((a, b) => {
                let x;
                if (!isNaN(a) && !isNaN(b)) {
                    x = a - b;
                } else {
                    x = collator.compare(a, b);
                }
                if (args.ORDER === 'DESC') {
                    x = x * -1;
                }
                return x;
            });
            this._data(args.LIST_ID)._monitorUpToDate = false;
        }
    }

    orderListAllLists (args) {
        args.DATASET = this.READ_ALL_LISTS_ID;
        this.orderList(args);
    }

    changeDataScale (args) {
        const oldMin = this._getMin(args);
        const oldMax = this._getMax(args);
        if (!isNaN(oldMin) && !isNaN(oldMax)) {
            const newMin = Cast.toNumber(args.NEW_MIN);
            const newMax = Cast.toNumber(args.NEW_MAX);
            let monitorUpToDate = true;
            for (let i = 0; i < this.getDataLength(args); i += 1) {
                let oldValue = this._data(args.LIST_ID).value[i];
                if (typeof oldValue === 'string') {
                    oldValue = oldValue.trim();
                }
                if (oldValue !== null && oldValue !== '' && !isNaN(oldValue)) {
                    const newValue = this._mapValue(oldValue, oldMin, oldMax, newMin, newMax);
                    if (oldValue !== newValue) {
                        // Two decimal points is a trade-off between precision and legibility
                        this._data(args.LIST_ID).value[i] = Cast.toNumber(newValue.toFixed(2));
                        monitorUpToDate = false;
                    }
                }
            }
            this._data(args.LIST_ID)._monitorUpToDate = monitorUpToDate;
        }
    }

    _mapData (args, util) {
        let oldMin;
        let oldMax;
        let oldValue;
        const newMin = Cast.toNumber(args.NEW_MIN);
        const newMax = Cast.toNumber(args.NEW_MAX);
        if (typeof args.DATA_TYPE === 'undefined') {
            args.DATA_TYPE = this.DATA_TYPE_VALUE;
        }
        switch (args.DATA_TYPE) {
        case this.DATA_TYPE_INDEX:
            oldMin = 0;
            oldMax = this.getDataLength(args) - 1;
            oldValue = this._getInternalIndex(args, util);
            break;
        case this.DATA_TYPE_VALUE:
            oldMin = this._getMin(args);
            oldMax = this._getMax(args);
            oldValue = this._getValue(args, util);
            break;
        }
        if (typeof args.OLD_MIN !== 'undefined') {
            oldMin = Cast.toNumber(args.OLD_MIN);
        }
        if (typeof args.OLD_MAX !== 'undefined') {
            oldMax = Cast.toNumber(args.OLD_MAX);
        }
        if (!isNaN(oldValue)) {
            return this._mapValue(oldValue, oldMin, oldMax, newMin, newMax);
        }
    }

    mapData (args, util) {
        const value = this._mapData(args, util);
        if ((typeof value !== 'undefined') && (typeof value === 'number')) {
            return Cast.toNumber(value.toFixed(2));
        }
        return '';
    }

    mapDataFromTo (args, util) {
        return this.mapData(args, util);
    }

    groupBy (args) {
        const dataset = this._listsToDataset();

        const datasetGroupBy = dataset.reduce((groups, data) => {
            const key = data[args.LIST_ID];
            const group = groups[key] ?? [];
            return {...groups, [key]: [...group, data]};
        }, {});

        const newDataset = [];
        for (const [group, items] of Object.entries(datasetGroupBy)) {
            const data = {};
            newDataset.push(data);
            data[args.LIST_ID] = group;
            switch (args.FNC) {
            case this.STATISTIC_AVERAGE:
                items.forEach(item => {
                    for (const [key, value] of Object.entries(item)) {
                        if (!isNaN(value) && key !== args.LIST_ID) {
                            if (!data[key]) {
                                data[key] = 0;
                            }
                            data[key] += Number(value);
                        }
                    }
                });
                for (const [key, value] of Object.entries(data)) {
                    // is the if necessary here?
                    if ((typeof value === 'number') && (key !== args.LIST_ID)) {
                        data[key] = (data[key] / items.length).toFixed(6);
                    }
                }
                break;
            case this.STATISTIC_LENGTH:
            case this.STATISTIC_COUNT:
                data[args.FNC] = items.length;
                break;
            case this.STATISTIC_SUM:
                items.forEach(item => {
                    for (const [key, value] of Object.entries(item)) {
                        if (!isNaN(value) && key !== args.LIST_ID) {
                            if (!data[`${key} ${args.FNC}`]) {
                                data[`${key} ${args.FNC}`] = 0;
                            }
                            data[`${key} ${args.FNC}`] += Number(value);
                        }
                    }
                });
                for (const [key, value] of Object.entries(data)) {
                    // is the if necessary here?
                    if ((typeof value === 'number') && (key !== args.LIST_ID)) {
                        data[key] = data[key].toFixed(6);
                    }
                }
                break;
            case this.STATISTIC_MIN:
                items.forEach(item => {
                    for (const [key, value] of Object.entries(item)) {
                        if (!isNaN(value) && key !== args.LIST_ID) {
                            if (!data[`${key} ${args.FNC}`]) {
                                data[`${key} ${args.FNC}`] = value;
                            }
                            data[`${key} ${args.FNC}`] = Math.min(value, data[`${key} ${args.FNC}`]);
                        }
                    }
                });
                break;
            case this.STATISTIC_MAX:
                items.forEach(item => {
                    for (const [key, value] of Object.entries(item)) {
                        if (!isNaN(value) && key !== args.LIST_ID) {
                            if (!data[`${key} ${args.FNC}`]) {
                                data[`${key} ${args.FNC}`] = value;
                            }
                            data[`${key} ${args.FNC}`] = Math.max(value, data[`${key} ${args.FNC}`]);
                        }
                    }
                });
                break;
            }
        }

        const lists = this._datasetToLists(newDataset);
        this.deleteAllLists();
        Object.keys(lists).forEach(listID => {
            this._data(listID).value = lists[listID];
            this._data(listID)._monitorUpToDate = false;
        });

        // Show new variables on toolbox.
        this._runtime.requestToolboxExtensionsUpdate();
    }

    getDataIndex (args) {
        return this.dataBlocks.getItemOfList(
            {LIST: {id: args.LIST_ID}, INDEX: args.INDEX},
            {target: this._runtime.getTargetForStage()}
        );
    }

    _getEditingTargetScale () {
        const scale = {x: 100, y: 100};
        const target = this._runtime.getEditingTarget();
        if (target) {
            scale.x = target.scalex ? target.scalex : 100;
            scale.y = target.scaley ? target.scaley : 100;
        }
        return scale;
    }

    _eventTargetVisualChange (target) {
        this._setScale(target);
    }

    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            newTarget.scalex = sourceTarget.scalex;
            newTarget.scaley = sourceTarget.scaley;
            this._setScale(newTarget);
        }
    }

    _setScale (target) {
        if (typeof target.scalex === 'undefined') {
            target.scalex = 100;
        }
        if (typeof target.scaley === 'undefined') {
            target.scaley = 100;
        }
        // We shouldn't allow targets to shrink below 5% size.
        target.scalex = Math.max(target.scalex * target.size, 500) / target.size;
        target.scaley = Math.max(target.scaley * target.size, 500) / target.size;
        const finalScale = [
            target.size * target.scalex / 100,
            target.size * target.scaley / 100
        ];
        target.removeListener(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this._eventTargetVisualChange);
        target.addListener(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this._eventTargetVisualChange);
        // Only update the target if we have a full renderer set up.
        if (this._runtime.renderer && typeof this._runtime.renderer.updateDrawableProperties === 'function') {
            this._runtime.renderer.updateDrawableProperties(
                target.drawableID, {direction: target.direction, scale: finalScale});
        }
    }

    setScaleX (args, util) {
        util.target.scalex = Cast.toNumber(args.SCALEX);
        this._setScale(util.target);
    }

    setScaleY (args, util) {
        util.target.scaley = Cast.toNumber(args.SCALEY);
        this._setScale(util.target);
    }

    static get STATE_KEY () {
        return 'Scratch.dataviewerText';
    }

    static get DEFAULT_TEXT_STATE () {
        return {
            skinId: null,
            text: 'PlayData',
            font: 'Helvetica',
            color: 'black',
            // GUI's text-primary color
            size: 14,
            maxWidth: 480,
            align: 'center',
            strokeWidth: 0,
            strokeColor: 'black',
            rainbow: false,
            visible: false,
            targetSize: null,
            fullText: null
        };
    }

    _formatText (text) {
        if (text === '') return text;

        // Non-integers should be rounded to 2 decimal places (no more, no less), unless they're small enough that
        // rounding would display them as 0.00. This matches 2.0's behavior:
        // https://github.com/LLK/scratch-flash/blob/2e4a402ceb205a042887f54b26eebe1c2e6da6c0/src/scratch/ScratchSprite.as#L579-L585
        if (!isNaN(text) && typeof text !== 'number') {
            text = Number(text);
        }
        if (typeof text === 'number' && Math.abs(text) >= 0.01 && text % 1 !== 0) {
            text = text.toFixed(2);
        }

        text = Cast.toString(text);
        return text;
    }

    _getTextState (target) {
        let textState = target.getCustomState(Scratch3DataViewerBlocks.STATE_KEY);

        if (!textState) {
            textState = Clone.simple(Scratch3DataViewerBlocks.DEFAULT_TEXT_STATE);
            target.setCustomState(Scratch3DataViewerBlocks.STATE_KEY, textState);
        }

        return textState;
    }

    _renderText (target) {
        if (!this._runtime.renderer) return;

        const textState = this._getTextState(target);

        if (!textState.visible) return; // Resetting to costume is done in clear block, early return here is for clones

        textState.skinId = this._runtime.renderer.updateTextCostumeSkin(textState);
        this._runtime.renderer.updateDrawableSkinId(target.drawableID, textState.skinId);
    }

    clearText (args, util) {
        this._pen.clear(args, util);
    }

    stampText (args, util) {
        const textState = this._getTextState(util.target);

        textState.text = this._formatText(args.TEXT);
        textState.color = args.COLOR;
        textState.visible = true;
        textState.animating = true;

        // Target must be visible to render correctly.
        const targetVisible = util.target.visible;
        util.target.setVisible(true);

        this._renderText(util.target);

        // Text must be rendered before calling stamp.
        const resolve = Promise.resolve();
        resolve.then(() => {
            this._pen.stamp(args, util);
            textState.visible = false;
            const costume = util.target.getCostumes()[util.target.currentCostume];
            this._runtime.renderer.updateDrawableSkinId(util.target.drawableID, costume.skinId);
            util.target.setVisible(targetVisible);
        });

        // It's necessary to return a resolved promise to be sure that this block will work correctly.
        return resolve;
    }
}

module.exports = Scratch3DataViewerBlocks;
