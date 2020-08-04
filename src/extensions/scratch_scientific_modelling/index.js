/* eslint no-console: "warn" */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Motion = require('../../blocks/scratch3_motion');
const Looks = require('../../blocks/scratch3_looks');
const Sensing = require('../../blocks/scratch3_sensing');
const Data = require('../../blocks/scratch3_data');
const Control = require('../../blocks/scratch3_control');
const Runtime = require('../../engine/runtime');
const MonitorRecord = require('../../engine/monitor-record');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';
/**
 * Url of icon to be displayed in the toolbox menu for the extension category.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAUHSURBVFhHrZlnyB1FFIY/FVtsUTH2lh8BCxZiwYqIqGAhYokVFEtM7OWfiv4RsSFiQRSNFVQURVEsYDeixGAS6w977w0rij7Pzs7HZO/O7ny594WHe+7e3ZmzU845u3esUDvCIvgTXoeTYVko1XLgNQvANmxrBxiJVoUv4SLYHubA+/AKbAp98hzP/QBmw7ZgW5/DyjC0joBngzkuG74RvoGdPJCRv3nODTDJA4meB9seWlfChcEc0FnwE+xSfVtSu8HPcGb1bVCXwOXBHE5z4dRgtuoU+B62rL4Faf8A/paTS+W2YOY1kYWe081wDTwG69Y8DleDv3VpmfozqxIHHZ3Vg5nVpfASPAgP1LbHurQG/BLMvEoc/Bg2CmZW/4HTuSFsAIaUPrm7PwtmXiUOvgdbB7NTO8PasA507eyoreDtYA4n15TT3HUzq8GHMKtG2/iZk4HbHd43M8UyMKe7tKlr4Qlw0cuT9bGctoFPgjka3QpnBHNApkFHI80q2sbH6dW3QZ0DdwazW73bvNaRcCwcCO6+zcHpcfpPh5XAEUy1H5h3zSJfg6nNdOfNOMJ3w13QqT4HVwBHaAaYEb4CHfsDPgU3xV/wXP2pbNM1tjzsVX8atL3OFKmj68F18BC8Bn9DsdwM3r139yOYS++Ft+AysCOdcNR08gDI6SDwHB3zGsOQ6e0duA++BZeCfe0PnVHFBo4Cw8oXYA529OIonwiPBLPSedAsItrk6J4fzEpmnJg6bds+rgD7tG99iH2OyyG3s4/geHBamnLt/Qqeuwq4rtqKhKY8x5HyGoP4b7AmNGWf9m1ieAbsp/J0CrwMpqfT4HfIyYW9GP6FfWuinHI3klnlHnCDRJmbHUnXpvWgmy4nb8SNtTvs6gGrFRscGNYW7QkGYadDO5VO6Jxop7Izi15HZ28P9Ehf9EnfqkU6VaNQb8K8YI7LuBedi2wGqZwlU1vJQKgqlpbk4lQ27jU6kKr5fRQav5HbwbVVcmdOj9PkdDltqR6FOHru1FRLM8X6NFfDTeKUvQBmha5NYjxcCP/APmC8jHKTHBPMoTaJzy7Xg2u82iQqhhnv8ARoCzOGBkOEoWIiYcZOJhpm9GV9WEKO5tFgsHQ6rgJrvDj1llHp7jwXfDLrU1ugti1l29aOJgUjw7vQGqhT+WOa6rz7+8GLjfhpqvNuD4acLC4sq5qpzrZMdaZRo4jrzT4HHOv0FMVi4RCwWHBk02JhLXA9Okom/LibbddrXUcrggXvxqCjXudUWyw8DK9CtljoczDKDHEceJfNcsvs42haQqUy+btRXPCuV58/LLd8UHoKrAcduZHoDrDIbJNFqdOUBmZt677c+xfXb1HBWirX0XbBbJXPxU+DMyIWr10lv6FmZCW/U+loGMNyMoT43GIZ5eOntg9SOY30ocmC9MVgdmoPcH3ZsZV0nwxR7vJOleTiaWA13af5YEgyNLkz+2TRsUUw8ypxcBMoWS++hzHYGhtvgb4IYbjpneISByeD09alC8ApPhQOB1+95V7ZRVmd973zKXJQdZVTpi3DhmvVzCCurbMhprSlVomDdmjF0yZfYJr+fHpL16m2TprWPKdNZqHvgjmcDoNmUVD6Ctg06Tk3gdekMj3ODOZwsj7zYftiMFinL9FNeX2ydLfeNM15rW34Et28bvwciUxZb4C1nOHkJChdv8rA7DtD/8KwDdsq+BtibOx/114gI1bkSeoAAAAASUVORK5CYII=';
class Scratch3ScientificModellingBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this.vel = 0;
        this.collisionCounter = 0;
        this.motion = new Motion(this.runtime);
        this.looks = new Looks(this.runtime);
        this.sensing = new Sensing(this.runtime);
        this.data = new Data(this.runtime);
        this.control = new Control(this.runtime);
        this.temp = 'medium';
        this.runtime.on(Runtime.PROJECT_START, this._projectStart.bind(this));
        this.runtime.on(Runtime.PROJECT_RUN_START, this._projectRunStart.bind(this));
        this.runtime.on(Runtime.PROJECT_STOP_ALL, this._projectStopAll.bind(this));
        this._steppingInterval = null;
        this._temperatureVar();
        this.clonesList = [];
        this.compTemp = 0;
        this.counter = 0;
        this.stepsPerSecond = 30;
    }

    _particles () {
        return this.clonesList
    }

    _projectStart () {
        this._createStepInterval();
    }
    
    _projectRunStart () {
        this._createStepInterval();
    }

    _projectStopAll () {
        if (this._steppingInterval) {
            clearInterval(this._steppingInterval);
            this._steppingInterval = null;
            this.clonesList = [];
            this.collisionCounter = 0;
            this.counter = this.stepsPerSecond;
        }
    }

    _temperatureVar () {
        const args = {VARIABLE: {id: 'temperatureSlider', name: 'temperature'}, VALUE: 50};
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            this.data.setVariableTo(args, {target: stage});
            // Show the new variable on toolbox
            this.runtime.requestBlocksUpdate();

            // Show the new variable on monitor
            const monitor = MonitorRecord({
                id: args.VARIABLE.id,
                opcode: 'data_variable',
                value: args.VALUE,
                mode: 'slider',
                sliderMin: 0,
                sliderMax: 100,
                isDiscrete: true,
                visible: true,
                params: {VARIABLE: args.VARIABLE.name}
            });
            this.runtime.requestAddMonitor(monitor);
        }
    }

    _createStepInterval () {
        if (!this._steppingInterval) {
            this._steppingInterval = setInterval(() => {
                this._step();
            }, this.runtime.currentStepTime);
        }
    }
    _step () {
        // TODO: runtime.getTargetForStage() ao invés de targets[0]?
        // TODO: getVariable?
        if (this.runtime.currentStepTime === 33.333333333333336) {
            this.stepsPerSecond = 30;
        } else {
            this.stepsPerSecond = 60;
        }
        if (this.runtime.targets[0].variables.hasOwnProperty('temperatureSlider')) {
            const tsValue = this.runtime.targets[0].variables.temperatureSlider.value;
            if (tsValue != this.compTemp) {
                for (let i = 0; i < this.clonesList.length; i++) {
                    const util = {target: this.clonesList[i]};
                    util.target.temperature = tsValue;
                }
                if (tsValue >= 60) {
                    this.temp = 'high';
                }
                if (tsValue < 60 && tsValue >= 20) {
                    this.temp = 'medium';
                }
                if (tsValue < 20 && tsValue > 0) {
                    this.temp = 'low';
                }
                if (tsValue === 0) {
                    this.temp = 'zero';
                }
                this.compTemp = tsValue;
            }
        }
        if (this.counter === this.stepsPerSecond) {
            this.collisionCounter = 0;
            this.counter = 0;
        }
        if (this.counter % 3 === 0) {
            for (let i = 0; i< this.clonesList.length; i++) {
                if(this.clonesList[i].collide) {
                    this.clonesList[i].collide = false;
                }
               
            }
        }
        this.counter++;
        this._particles().forEach(target => {
            const util = {target: target};
            this.motion.moveSteps({STEPS: target.speed}, util);
            this.motion.ifOnEdgeBounce({}, util);
        });
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
            id: 'scientificModelling',
            color1: '#7bc7bc',
            color2: '#67827e',
            color3: '#67827e',
            name: formatMessage({
                id: 'scientificModelling.categoryName',
                default: 'Scientific Modelling',
                description: 'Label for the Scientific Modelling extension category'
            }),

            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [

                {
                    opcode: 'createParticlesOP',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.createParticlesOP',
                        default: 'create [NUMBERPARTICLE] particles [PARTICLEPOSITIONOP]'
                    }),
                    filter: [TargetType.SPRITE],
                    arguments: {
                        NUMBERPARTICLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '10'
                        },
                        /*
                        COLORMENUOP: {
                            type: ArgumentType.STRING,
                            menu: 'particlecolors',
                            defaultValue: this.runtime.getEditingTarget().getCurrentCostume().name
                        },
                        */
                        PARTICLEPOSITIONOP: {
                            type: ArgumentType.STRING,
                            menu: 'particleposition',
                            defaultValue: ''
                        }
                        
                    }
                },

                {
                    opcode: 'whenTemperatureIs',
                    blockType: BlockType.HAT,
                    shouldRestartExistingThreads: false,
                    text: formatMessage({
                        id: 'scientificModelling.whenTemperatureIs',
                        default: 'when temperature is [WHENTEMPMENU]',
                        description: 'checks if the temperature is equal to [WHENTEMPMENU]'
                    }),
                    arguments: {
                        WHENTEMPMENU: {
                            type: ArgumentType.STRING,
                            menu: 'whenparticletemperature',
                            defaultValue: ''
                            
                        }
                    }
                },

                {
                    opcode: 'setParticleSpeed',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.setParticleSpeed',
                        default: 'set particles speed to [PARTICLESPEED]',
                        description: 'sets particles speed to [PARTICLESPEED]'
                    }),
                    arguments: {
                        PARTICLESPEED: {
                            type: ArgumentType.STRING,
                            menu: 'particlespeed',
                            defaultValue: ''
                        }
                    }
                },

                {
                    opcode: 'go',
                    blockType: BlockType.HAT,
                    shouldRestartExistingThreads: false,
                    text: formatMessage({
                        id: 'scientificModelling.go',
                        default: 'behavior'
                    })
                },

                {
                    opcode: 'ifTouchingInvert',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.ifTouchingInvert',
                        default: 'if touching [TOUCHINGMENU] go to the oposite direction'
                    }),
                    filter: [TargetType.SPRITE],
                    arguments: {
                        TOUCHINGMENU: {
                            type: ArgumentType.STRING,
                            menu: 'touchingMenu',
                            defaultValue: this.runtime.getEditingTarget().sprite.name
                        }
                    }
                },

                {
                    opcode: 'touchingAnotherParticle',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'scientificModelling.touchingAnotherParticle',
                        default: 'touching [TOUCHINGMENU]?'

                    }),
                    filter: [TargetType.SPRITE],
                    arguments: {
                        TOUCHINGMENU: {
                            type: ArgumentType.STRING,
                            menu: 'touchingMenu',
                            defaultValue: this.runtime.getEditingTarget().sprite.name
                        }
                    }
                },
                
                {
                    opcode: 'opositeDirection',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.opositeDirection',
                        default: 'go to the oposite direction',
                        description: 'reverse sprites direction'
                    })
                },
            
                {
                    opcode: 'numberParticleReporter',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'scientificModelling.numberParticleReporter',
                        default: 'number of particles'
                    })
                },

                {
                    opcode: 'collisionReporter',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'scientificModelling.collisionReporter',
                        default: 'collisions per second'
                    })
                }
               
            ],
            menus: {
                particlecolors: {
                    // acceptReporters: true,
                    items: 'getParticleColors'
                },
                particleposition: {
                    // acceptReporters: true,
                    items: this.particlePosition
                },
                particletemperature: {
                    // acceptReporters: true,
                    items: this.particleTemperatureMenu
                },
                whenparticletemperature: {
                    // acceptReporters: true,
                    items: this.whenParticleTemperatureMenu
                },
                particlespeed: {
                    // acceptReporters: true,
                    items: this.particleSpeedMenu
                },

                touchingMenu: {
                    items: 'getTouchingMenu'
                }

            }
        };
    }

    getTouchingMenu () {
        const targetNames = this.runtime.targets
            .filter(target => !target.isStage && target.isOriginal)
            .map(target => ({text: target.sprite.name, value: target.sprite.name}));
        if (targetNames.length === 0) {
            targetNames.push({text: ''});
        }
        return targetNames;
    }

    getParticleColors () {
        const costumes = this.runtime.getEditingTarget().getCostumes()
            .map(costume => ({text: costume.name}));
        if (costumes.length === 0) {
            costumes.push({text: ''});
        }
        return costumes;
    }

    get particleTemperatureMenu () {
        return [
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuHigh',
                default: 'high'}),
            value: '100'},
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuMedium',
                default: 'medium'}),
            value: '50'},
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuLow',
                default: 'low'}),
            value: '0'}
        ];
    }

    get whenParticleTemperatureMenu () {
        return [
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuHigh',
                default: 'high'
            }),
            value: 'high'},
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuMedium',
                default: 'medium'
            }),
            value: 'medium'},
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuLow',
                default: 'low'
            }),
            value: 'low'},
            {text: formatMessage({
                id: 'scientificModelling.temperatureMenuZero',
                default: 'zero'
            }),
            value: 'zero'}
        ];
    }

    get particleSpeedMenu () {
        return [
            {text: formatMessage({
                id: 'scientificModelling.speedMenuHigh',
                default: 'high'
            }),
            value: '4'},
            {text: formatMessage({
                id: 'scientificModelling.speedMenuMedium',
                default: 'medium'
            }),
            value: '2'},
            {text: formatMessage({
                id: 'scientificModelling.speedMenuLow',
                default: 'low'
            }),
            value: '1'},
            {text: formatMessage({
                id: 'scientificModelling.speedMenuZero',
                default: 'zero'
            }),
            value: '0'}
        ];
    }

    get particlePosition () {
        return [
            {text: formatMessage({
                id: 'scientificModelling.positionMenuRandom',
                default: 'randomly'}),
            value: 'randomly'},
            {text: formatMessage({
                id: 'scientificModelling.positionMenuCenter',
                default: 'center'}),
            value: 'center'},
            {text: formatMessage({
                id: 'scientificModelling.positionMenuMouse',
                default: 'on mouse position'}),
            value: 'mouse'}
           
        ];
    }

    _checkNumberOfParticles (numberOfParticles) {
        // this.runtime._cloneCounter gives us the total of existing clones
        // total particles is the sum of the total of existing clones with the number of clones
        // we want to create
        const totalParticles = this._particles().length + numberOfParticles;
        let maxParticles = 100;
        // verifies if after the creation there will be more clones than the amount allowed
        if (totalParticles > maxParticles) {
            numberOfParticles = maxParticles - this._particles().length;
        }
        return numberOfParticles;
    }

    _createNParticlesRandomly (numberOfParticles, util, rm) {
        if (util.target.isOriginal === false) {
            return
        }
        this.looks.show({}, {target: util.target});
        let c = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            // moves the sprite to a random position
            // Based on scratch3_control.createClone()
            if (c > 600) {
                this.looks.hide({}, {target: util.target});
                return;
            }
            const newClone = util.target.makeClone();
            if (newClone) {
                this.runtime.addTarget(newClone);
                this.motion.pointTowards({TOWARDS: '_random_'}, {target: newClone});
                this.motion.goTo({TO: '_random_'}, {target: newClone});
                const r = Math.sqrt(((newClone.x) * (newClone.x)) + ((newClone.y) * (newClone.y)));
                // should be checking all targets, not only itself.
                if (newClone.isTouchingSprite(util.target.sprite.name) || r > rm){
                    this.control.deleteClone({}, {target: newClone});
                    i = i - 1;
                    c++;
                    continue;
                }
                newClone.speed = this.vel;
                newClone.temperature = this.temp;
                newClone.limiter = true;
                newClone.Collide = false;
                this.clonesList.push(newClone);
            }
        }
        this.looks.hide({}, {target: util.target});
    }
    
    _polarToCartesian (r,theta) {
        theta = (theta * Math.PI) / 180;
        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);
        return [x,y]
    }

    _createNParticlesMouse (numberOfParticles, mousePosition, util) {
        let mouseX = 0;
        let mouseY = 0;
        const stageWidth = this.runtime.constructor.STAGE_WIDTH;
        const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
        if (mousePosition) {
            mouseX =  util.ioQuery('mouse', 'getScratchX');
            mouseY = util.ioQuery('mouse', 'getScratchY');
        }
        // check if mouse is inside canvas
        if (Math.abs(mouseX) > stageWidth * 0.5 || Math.abs(mouseY) > stageHeight * 0.5) {
            return
        }
        if (util.target.isOriginal === false) {
            return
        }
        let r = 0;
        let theta = 0;
        let c = 0;
        let ifc = 0;
        let dt = 20;
        let dr = 15;
        for (let i = 0; i < numberOfParticles; i++) {
            this.looks.show({}, {target: util.target});
            const newClone = util.target.makeClone();
            this.looks.hide({}, {target: util.target});
            if (newClone) {
                this.runtime.addTarget(newClone);
                this.motion.pointTowards({TOWARDS: '_random_'}, {target: newClone});
                c = 0;
                if (newClone.isTouchingSprite(util.target.sprite.name) === false) {
                    if (ifc === 600) {
                        this.control.deleteClone({}, {target: newClone});
                        this.looks.hide({}, {target: util.target});
                        return
                    }
                    let x = mouseX + this._polarToCartesian(r,theta)[0];
                    let y = mouseY + this._polarToCartesian(r,theta)[1];
                    if (Math.abs(x) > stageWidth * 0.5 || Math.abs(y) > stageHeight * 0.5) {
                        this.control.deleteClone({}, {target: newClone});
                        i = i - 1;
                        ifc++;
                        continue
                    }
                    newClone.setXY(x,y);
                }
                while (newClone.isTouchingSprite(util.target.sprite.name)) {
                    if (c === 1000) {
                        this.looks.hide({}, {target: util.target});
                        this.control.deleteClone({}, {target: newClone});
                        return
                    }
                    let x = mouseX + this._polarToCartesian(r,theta)[0];
                    let y = mouseY + this._polarToCartesian(r,theta)[1];
                    if (Math.abs(x) > stageWidth * 0.5 || Math.abs(y) > stageHeight * 0.5) {
                        c++
                        continue
                    }
                    newClone.setXY(x,y);
                    theta+= dt;
                    if (theta === 360) {
                        theta = 0;
                        if (r <= 200) {
                            r+= dr;
                        }
                    }
                    c++
                }
                newClone.speed = this.vel;
                newClone.temperature = this.temp;
                newClone.limiter = true;
                newClone.Collide = false;
                this.clonesList.push(newClone);
            }
        }
    }

    _checkCollision (util) {
        let x = util.target.x;
        let y = util.target.y;
        let distanceArray = [];
        for (let i = 0; i < this.clonesList.length; i++) {
            let element = this.clonesList[i];
            let elementX = element.x;
            let elementY = element.y;
            let dx = x - elementX;
            let dy = y - elementY;
            let r = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
            if (r === 0 ) {
                r = 1000;
            }
            distanceArray.push(r);
        }
        let min = Math.min.apply(null,distanceArray);
        let touchingIndex = distanceArray.indexOf(min);
        return this.clonesList[touchingIndex]
    }

    _momentumUpdate (util, body2) {
        if(util.target.collide) {
            return
        }
        let body1 = util.target;
        let direct = body1.direction;
        body1.setDirection(body2.direction);
        body2.setDirection(direct);
        this.motion.moveSteps({STEPS: body1.speed}, {target: body1});
        this.motion.moveSteps({STEPS: body2.speed}, {target: body2});
        body1.collide = true;
        body2.collide = true;
        /*
        // mass and speed of first target
        let m1 = 1;
        let v0x1 = this.vel * Math.cos(body1.direction);
        let v0y1 = this.vel * Math.sin(body1.direction);
        // mas and speed of second target
        let m2 = 1;
        let v0x2 = this.vel * Math.cos(body2.direction);
        let v0y2 = this.vel * Math.sin(body2.direction);
        let vfx1 = (m1 - m2)*v0x1/(m1 + m2) + 2*m2*v0x2/(m1+m2);
        let vfy1 = (m1 - m2)*v0y1/(m1 + m2) + 2*m2*v0y2/(m1+m2);
        */
    }

    createParticlesOP (args, util) {
        if (!util.target) return;
        //  number of particles requested to create
        let numberOfParticles = Cast.toNumber(args.NUMBERPARTICLE);
        // where the particles will be created
        const chosenPosition = Cast.toString(args.PARTICLEPOSITIONOP);
        // const currentCostume = util.target.currentCostume;
        // const requestedCostume = args.COLORMENUOP;
        numberOfParticles = this._checkNumberOfParticles(numberOfParticles);
        //  switch costumes of the original sprite
        // this.looks.switchCostume({COSTUME: requestedCostume}, {target: util.target});
        // loop for creating particles ramdomly
        if (chosenPosition === 'randomly') {
            const rm = 300;
            this._createNParticlesRandomly(numberOfParticles, util, rm);
        }
        // loop for creating clones at the center
        if (chosenPosition === 'center') {
            this._createNParticlesMouse(numberOfParticles, false, util);
        }
        if (chosenPosition === 'mouse') {
            this._createNParticlesMouse(numberOfParticles, true, util);
        }
    }

    opositeDirection (args, util) {
        body2 = this._checkCollision(util);
        this._momentumUpdate(util, body2);
    }

    ifTouchingInvert (args, util) {
        if (this.touchingAnotherParticle(args, util)) {
            this.opositeDirection(args, util);
        }
    }

    setParticleSpeed (args) {
        const velocity = Cast.toString(args.PARTICLESPEED);
        this.vel = velocity;
        this._particles().forEach(target => {
            target.speed = velocity;
        });
    }

    whenTemperatureIs (args) {
        const checkTemperature = Cast.toString(args.WHENTEMPMENU);
        return checkTemperature === this.temp;
    }

    go (args, util) {
        if (util.target.limiter) {
            util.target.limiter = false;
            return true;
        }
        return false;
    }

    touchingAnotherParticle (args, util) {
        const name = Cast.toString(args.TOUCHINGMENU);
        if (util.target.isTouchingSprite(name)) {
            this.collisionCounter++;
            return true;
        }
        return false;
    }

    temperatureReporter () {
        return this.temp;
    }

    collisionReporter () {
        // 1 collision has 2 particles so we divide it by 2 to know the collision number
        if (this.counter === this.stepsPerSecond) {
            return Math.round(this.collisionCounter / 2);
        }
    }

    numberParticleReporter () { 
        return this._particles().length;
    }
}

module.exports = Scratch3ScientificModellingBlocks;
