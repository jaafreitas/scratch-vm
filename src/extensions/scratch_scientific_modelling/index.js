/* eslint no-console: "warn" */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Motion = require('../../blocks/scratch3_motion');
const Looks = require('../../blocks/scratch3_looks');
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
const menuIconURI = 'data:image/png;base64,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';

class Scratch3ScientificModellingBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this.vel = 0;
        this.motion = new Motion(this.runtime);
        this.looks = new Looks(this.runtime);
        this.data = new Data(this.runtime);
        this.control = new Control(this.runtime);
        this.temp = 'medium';
        this.runtime.on(Runtime.PROJECT_START, this._projectStart.bind(this));
        this.runtime.on(Runtime.PROJECT_RUN_START, this._projectRunStart.bind(this));
        this.runtime.on(Runtime.PROJECT_RUN_STOP, this._projectRunStop.bind(this));
        this.runtime.on(Runtime.PROJECT_STOP_ALL, this._projectStopAll.bind(this));
        this._steppingInterval = null;
        this._temperatureVar();
        this.limiter = true;
    }

    get DEFAULT_SPEED () {
        return this.vel;
    }

    get DEFAULT_TEMPERATURE () {
        return this.temp;
    }

    _particles () {
        return this.runtime.targets.filter(target => target.hasOwnProperty('speed'));
    }

    _projectStart () {
        this._createStepInterval();
    }
    
    _projectRunStart () {
        this._createStepInterval();
    }

    _projectRunStop () {

    }

    _projectStopAll () {
        if (this._steppingInterval) {
            clearInterval(this._steppingInterval);
            this._steppingInterval = null;
        }
        // this.vel = 0;
    }

    _temperatureVar () {
        const args = {VARIABLE: {id: 'temperatureSlider', name: 'temperature slider'}, VALUE: 50};
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
                sliderMin: -20,
                sliderMax: 120,
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
        if (this.runtime.targets[0].variables.hasOwnProperty('temperatureSlider')) {
            const tsValue = this.runtime.targets[0].variables.temperatureSlider.value;
            for (let i = 0; i < this.runtime.targets.length; i++) {
                const util = {target: this.runtime.targets[i]};
                if (util.target.hasOwnProperty('temperature')) {
                    util.target.temperature = tsValue;
                }
            }
            if (tsValue > 70) {
                this.temp = 'high';
            }
            if (tsValue < 70 && tsValue > 40) {
                this.temp = 'medium';
            }
            if (tsValue < 40) {
                this.temp = 'low';
            }
        }
        this.isTouchingList = [];
        // this.isTouchingList = this.runtime.targets.filter(this.runtime.targets.isTouchingSprite);
        for (let i = 0; i < this.runtime.targets.length; i++) {
            const util = {target: this.runtime.targets[i]};
            // this.isTouchingList = this.runtime.targets.filter(util.target.isTouchingSprite);
            if (util.target.speed) {
                this.motion.moveSteps({STEPS: util.target.speed}, util);
                this.motion.ifOnEdgeBounce({}, util);
                if (util.target.isTouchingSprite(util.target.sprite.name) === true) {
                    this.isTouchingList.push(util.target);
                }
                // console.log(util.target.isTouchingSprite(util.target.sprite.name))
                // console.log(util.target)
            }
        }
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
            color1: '#666666',
            color2: '#000000',
            color3: '#BBBBBB',
            name: formatMessage({
                id: 'scientificModelling.categoryName',
                default: 'Scientific Modelling',
                description: 'Label for the Scientific Modelling extension category'
            }),

            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'createParticles',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.createParticles',
                        default: 'create [PARTICLES] particles',
                        description: 'create a given number [PARTICLES] of particles'
                    }),
                    arguments: {
                        PARTICLES: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                // delete this block
                /*
                {
                    //added
                    opcode: 'setCostume',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.setCostume',
                        default: 'set particle costume to [PARTICLECOSTUME]',
                        description: 'changes the costume of the sprite to [PARTICLECOSTUME]'
                    }),
                    arguments: {
                        PARTICLECOSTUME: {
                            type: ArgumentType.NUMBER,
                            //menu: 'particlecostume',
                            defaultValue: 1
                            
                        }
                    }
                },
                */
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
                // delete this
                /*
                {
                    opcode: 'setParticleTemperature',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.setParticleTemperature',
                        default: 'set particles temperature to [PARTICLETEMPERATURE]',
                    }),
                    
                    arguments: {
                        PARTICLETEMPERATURE: {
                            type: ArgumentType.STRING,
                            menu: 'particletemperature',
                            defaultValue: ''
                            
                        }
                    }
                    
                },
                */
                
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
                    opcode: 'ifTouchingInvert',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.ifTouchingInvert',
                        default: 'if touching go to the oposite direction'
                    })
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
                    opcode: 'go',
                    blockType: BlockType.HAT,
                    shouldRestartExistingThreads: false,
                    text: formatMessage({
                        id: 'scientificModelling.go',
                        default: 'go'
                    })
                },
                /*
                {
                    opcode: 'whenTouchingAnotherParticle',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'scientificModelling.whenTouchingAnotherParticle',
                        default: 'when touching another particle',
                    }),
                },
*/
                {
                    opcode: 'touchingAnotherParticle',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'scientificModelling.touchingAnotherParticle',
                        default: 'touching another particle'

                    })
                },

                {
                    opcode: 'createParticlesOP',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'scientificModelling.createParticlesOP',
                        default: 'create [NUMBERPARTICLE] [COLORMENUOP] particles [PARTICLEPOSITIONOP]'
                    }),
                    arguments: {
                        NUMBERPARTICLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '10'
                        },
                        
                        COLORMENUOP: {
                            type: ArgumentType.STRING,
                            menu: 'particlecolors',
                            defaultValue: ''
                        },
                        PARTICLEPOSITIONOP: {
                            type: ArgumentType.STRING,
                            menu: 'particleposition',
                            defaultValue: ''
                        }
                        
                    }
                },
                // delete this
                /*
                {
                    opcode: 'temperatureReporter',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'scientificModelling.temperatureReporter',
                        default: 'temperature',
                        description: 'reports the temperature'
                    }),
                    
                    arguments: {
                    }
                },
                */

                {
                    opcode: 'speedReporter',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'scientificModelling.speedReporter',
                        default: 'speed'
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
                        default: 'collisions per time'
                    })
                }
               
            ],
            menus: {
                /*
                particlecostume: {
                    // acceptReporters: true,
                    items: this.particleCostume
                },
                */
                particlecolors: {
                    // acceptReporters: true,
                    items: this.particleColors
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
                }

            }
        };
    }
    get particleColors () {
        /*
        if ( ){
            return [
                {text: 'costume1', value: '1'},
                {text: 'costume2', value: '2'},
                {text: 'costume3', value: '3'}
            ];
        }
        */
        return [
            {text: 'costume1', value: '1'},
            {text: 'costume2', value: '2'},
            {text: 'costume3', value: '3'}
        ];
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
            value: 'low'}
        ];
    }

    get particleSpeedMenu () {
        return [
            {text: formatMessage({
                id: 'scientificModelling.speedMenuHigh',
                default: 'high'
            }),
            value: '5'},
            {text: formatMessage({
                id: 'scientificModelling.speedMenuMedium',
                default: 'medium'
            }),
            value: '2.5'},
            {text: formatMessage({
                id: 'scientificModelling.speedMenuLow',
                default: 'low'
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
            value: 'center'}
           
        ];
    }
    /*
    get particleCostume () {
        var menulist = [];
        var costumelength = util.target.sprite.costume.length
        for(let i=0;i < costumelength; i++){
            menulist.push( {text:'i', value:i},)
        }
        return menulist
    }*/
    // end of addtion
    
    createParticles (args, util) {
        if (!util.target) return;
        // current number of clones of the sprite we are cloning
        // const numberOfClones = util.target.sprite.clones.length;
        // number of clones requested
        let numberOfParticles = Cast.toNumber(args.PARTICLES);
        // this.runtime._cloneCounter gives us the total of existing clones
        // total particles is the sum of the total of existing clones with the number of clones
        // we want to create
        const totalParticles = this.runtime._cloneCounter + numberOfParticles;
        // verifies if after the creation there will be more clones than the amount allowed
        // TODO: usar runtime.clonesAvailable()?
        if (totalParticles >= 299) {
            numberOfParticles = 299 - this.runtime._cloneCounter;
        }
        // tells scratch to show the particle we are cloning
        // if you clone a hidden particle the clone will be hidden
        this.looks.show({}, {target: util.target});
        // counter
        let c = 0;
        for (let i = 0; i < numberOfParticles; i++) {
            // stops it from crashing
            if (c > 600) {
                this.looks.hide({}, {target: util.target});
                return;
            }
            // based on scratch3_control.createClone()
            const newClone = util.target.makeClone();
            if (newClone) {
                this.runtime.addTarget(newClone);
                this.motion.goTo({TO: '_random_'}, {target: newClone});
                this.motion.pointTowards({TOWARDS: '_random_'}, {target: newClone});
                if (newClone.isTouchingSprite(util.target.sprite.name) === true){
                    this.control.deleteClone({}, {target: newClone});
                    i = i - 1;
                    c++;
                    continue;
                }
                // this.vel = Scratch3ScientificModellingBlocks.DEFAULT_SPEED;
                newClone.speed = this.vel;
                // this.temp = Scratch3ScientificModellingBlocks.DEFAULT_TEMPERATURE;
                newClone.temperature = this.temp;
                newClone.limiter = true;
            }
        }
        // hides the static sprite
        this.looks.hide({}, {target: util.target});
        
    }

    createParticlesOP (args, util) {
        //  number of particles requested to create
        let numberOfParticles = Cast.toNumber(args.NUMBERPARTICLE);
        // where the particles will be created
        const chosenPosition = Cast.toString(args.PARTICLEPOSITIONOP);
        // const numberOfClones = util.target.sprite.clones.lenght;
        const currentCostume = util.target.currentCostume;
        const requestedCostume = args.COLORMENUOP;
        this.looks.show({}, {target: util.target});
        const totalParticles = this.runtime._cloneCounter + numberOfParticles;
        if (totalParticles >= 299) {
            numberOfParticles = 299 - this.runtime._cloneCounter;
        }
        if (!util.target) return;
        //  switch costumes of the original sprite
        this.looks.switchCostume({COSTUME: requestedCostume}, {target: util.target});
        let c = 0;
        // loop for creating particles ramdomly
        if (chosenPosition === 'randomly') {
            for (let i = 0; i < numberOfParticles; i++) {
                // stops it from crashing
                if (c > 600) {
                    this.looks.hide({}, {target: util.target});
                    this.looks.switchCostume({COSTUME: currentCostume + 1}, {target: util.target});
                    return;
                }
                // based on scratch3_control.createClone()
                const newClone = util.target.makeClone();
                if (newClone) {
                    this.runtime.addTarget(newClone);
                    this.motion.goTo({TO: '_random_'}, {target: newClone});
                    this.motion.pointTowards({TOWARDS: '_random_'}, {target: newClone});
                    if (newClone.isTouchingSprite(util.target.sprite.name) === true){
                        this.control.deleteClone({}, {target: newClone});
                        i = i - 1;
                        c++;
                        continue;
                    }
                    // this.vel = Scratch3ScientificModellingBlocks.DEFAULT_SPEED;
                    newClone.speed = this.vel;
                    // this.temp = Scratch3ScientificModellingBlocks.DEFAULT_TEMPERATURE;
                    newClone.temperature = this.temp;
                    newClone.limiter = true;
                }
            }
        }
        // loop for creating clones at the center
        if (chosenPosition === 'center') {
            for (let i = 0; i < numberOfParticles; i++) {
                // moves the sprite to a random position
                // Based on scratch3_control.createClone()
                if (c > 600) {
                    this.looks.hide({}, {target: util.target});
                    return;
                }
                // const r = Math.sqrt(((util.target.x) * (util.target.x)) + ((util.target.y) * (util.target.y)));
                const newClone = util.target.makeClone();
                if (newClone) {
                    this.runtime.addTarget(newClone);
                    this.motion.pointTowards({TOWARDS: '_random_'}, {target: newClone});
                    this.motion.goTo({TO: '_random_'}, {target: newClone});
                    const r = Math.sqrt(((newClone.x) * (newClone.x)) + ((newClone.y) * (newClone.y)));
                    if (newClone.isTouchingSprite(util.target.sprite.name) === true || r > 80){
                        this.control.deleteClone({}, {target: newClone});
                        i = i - 1;
                        c++;
                        continue;
                    }
                    // this.vel = Scratch3ScientificModellingBlocks.DEFAULT_SPEED;
                    newClone.speed = this.vel;
                    // this.temp = Scratch3ScientificModellingBlocks.DEFAULT_TEMPERATURE;
                    newClone.temperature = this.temp;
                    newClone.limiter = true;
                }
                    
                
            }
        }
        if (currentCostume !== requestedCostume) {
            this.looks.switchCostume({COSTUME: currentCostume + 1}, {target: util.target});
        }
        // hides the static sprite
        this.looks.hide({}, {target: util.target});
    }

    // delete this block
    /*
    setCostume (args, util){
        /*
        var costumeLength = util.target.sprite.costumes.length
        this.looks.show({}, { target: util.target});
        if (costumeNumber> costumeLength) {
            costumeNumber =  costumeLength -1
            
        }
        // changes the costume of the sprite
        this.looks.switchCostume({COSTUME:args.PARTICLECOSTUME}, {target: util.target});
        // this.looks.hide({}, { target: util.target});
        // this.looks.show({}, { target: util.target});
    }
    */
    
    opositeDirection (args, util) {
        util.target.setDirection(util.target.direction - 180);
        this.motion.moveSteps({STEPS: util.target.speed}, {target: util.target});
    
    }

    ifTouchingInvert () {
        if (this.isTouchingList.length !== 0) {
            for (let i = 0; i < this.isTouchingList.length; i++) {
                this.isTouchingList[i].direction = this.isTouchingList[i].direction - 180;
            }
        }
    }

    setParticleSpeed (args) {
        const velocity = Cast.toString(args.PARTICLESPEED);
        this.vel = velocity;
        for (let i = 0; i < this.runtime.targets.length; i++) {
            const util = {target: this.runtime.targets[i]};
            if (util.target.hasOwnProperty('speed')) {
                util.target.speed = velocity;
            }
        }
    
    }
    // delete this
    
    setParticleTemperature (/* args, util*/) {
        /*
        var tsVariable = []
        tsVariable.id = 'temperatureSlider';
        tsVariable.name = 'temperatureSlider';
        tsVariable.value = 10;
        */
        // this.data.setVariableTo({VARIABLE:tsVariable},{target: util.target})
        /*
        var temperature = Cast.toString(args.PARTICLETEMPERATURE);
        this.temp = temperature;
        for (let i = 0; i < this.runtime.targets.length; i++) {
            const util = { target: this.runtime.targets[i] };
            if (util.target.temperature) {
                // util.target.temperature = this.temp
            }
        }
        */
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
    /*
    whenTouchingAnotherParticle () {
        let isTouching = false;
        this.isTouchingList = [];
        for (let i = 0; i < this.runtime.targets.length; i++) {
            const util = {target: this.runtime.targets[i]};
            // util.target.isTouchingSprite(util.target.sprite.name);
            if (util.target.isTouchingSprite(util.target.sprite.name) === true) {
                isTouching = true;
                this.isTouchingList.push(util.target);
            }
        }
        return isTouching;
    }
    */
    touchingAnotherParticle (args, util) {
        return util.target.isTouchingSprite(util.target.sprite.name);
    }

    temperatureReporter () {
        return this.temp;
    }

    speedReporter () {
        if (this.vel === 'undefined') {
            return 'undefined';
        }
        if (this.vel === 5) {
            return formatMessage({id: 'scientificModelling.speedMenuHigh'});
        }
        if (this.vel === 2.5) {
            return formatMessage({id: 'scientificModelling.speedMenuMedium'});
        }
        if (this.vel === 0) {
            return formatMessage({id: 'scientificModelling.speedMenuLow'});
        }
    }
    

    collisionReporter () {
        // 1 collision has 2 particles so we divide it by 2 to know the collision number
        let collisionCounter = this.isTouchingList.length / 2;
        collisionCounter = Math.round(collisionCounter);
        return collisionCounter;
    }

    numberParticleReporter () {
        return this._particles().length;
    }
}
module.exports = Scratch3ScientificModellingBlocks;
