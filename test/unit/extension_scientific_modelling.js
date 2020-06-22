const test = require('tap').test;
const Runtime = require('../../src/engine/runtime');
const Blocks = require('../../src/engine/blocks');
const Sprite = require('../../src/sprites/sprite.js');
const RenderedTarget = require('../../src/sprites/rendered-target');

const SicentificModelling = require('../../src/extensions/scratch_scientific_modelling/index.js');

const setupSicentificModelling = function () {
    const rt = new Runtime();
    const blocks = new Blocks(rt);

    const spriteStage = new Sprite(blocks, rt);
    spriteStage.name = 'Stage';

    const stage = new RenderedTarget(spriteStage, rt);
    stage.isStage = true;
    rt.targets = [stage];

    const sprite = new Sprite(blocks, rt);

    const target = new RenderedTarget(sprite, rt);
    rt.addTarget(target);

    const o1 = {id: 1};
    const o2 = {id: 2};
    const o3 = {id: 3};
    sprite.costumes = [o1, o2, o3];
    // target.setCostume(1);

    const sm = new SicentificModelling(rt);

    return {rt: rt, blocks: blocks, target: target, sm: sm};
};

test('spec', t => {
    const rt = new Runtime();
    const sm = new SicentificModelling(rt);

    t.type(sm, 'object');
    t.equal(sm.vel, 0);
    t.type(sm.motion, 'object');
    t.type(sm.looks, 'object');
    t.type(sm.data, 'object');
    t.equal(sm.temp, 'medium');
    t.false(sm.limiter);

    t.end();
});

test('temperatureReporter', t => {
    const setup = setupSicentificModelling();

    t.equal(setup.sm.temperatureReporter(), 'medium');

    setup.rt.getTargetForStage().variables.temperatureSlider.value = 0;
    setup.sm._step();
    t.equal(setup.sm.temperatureReporter(), 'low');

    setup.rt.getTargetForStage().variables.temperatureSlider.value = 100;
    setup.sm._step();
    t.equal(setup.sm.temperatureReporter(), 'high');

    t.end();
});

test('createParticle', t => {
    const setup = setupSicentificModelling();
    t.equal(setup.rt.targets.length, 2);
    t.equal(setup.sm._particles().length, 0);

    const totalParticles = 10;
    setup.sm.createParticles({PARTICLES: totalParticles}, {target: setup.target});
    t.equal(setup.sm._particles().length, totalParticles);

    t.end();
});

test('createParticleOPC', t => {
    const setup = setupSicentificModelling();
    t.equal(setup.rt.targets.length, 2);
    t.equal(setup.sm._particles().length, 0);

    const totalParticles = 3;
    const reqestedCostume = 1;
    setup.sm.createParticlesOP({
        NUMBERPARTICLE: totalParticles,
        COLORMENUOP: reqestedCostume,
        PARTICLEPOSITIONOP: 'center'},
    {target: setup.target});
    t.equal(setup.sm._particles().length, totalParticles);
    
    const centerList = setup.sm._particles().filter(target => {
        const ra = Math.sqrt(Math.pow(target.x, 2) + Math.pow(target.y, 2));
        return ra <= 80;
    });
    
    t.equal(setup.sm._particles().length, centerList.length);
    // costume test
    const costumeId = setup.sm._particles().map(target => target.sprite.costumes[target.currentCostume].id);
    // tests if all the clones were created with the expected
    costumeId.map(target => t.equal(target, reqestedCostume));
    
    t.end();

});

test('createParticleOPR', t => {
    const setup = setupSicentificModelling();
    t.equal(setup.rt.targets.length, 2);
    t.equal(setup.sm._particles().length, 0);

    const totalParticles = 3;
    const reqestedCostume = 2;
    setup.sm.createParticlesOP({
        NUMBERPARTICLE: totalParticles,
        COLORMENUOP: reqestedCostume,
        PARTICLEPOSITIONOP: 'randomly'},
    {target: setup.target});
    t.equal(setup.sm._particles().length, totalParticles);

    // costume test
    const costumeId = setup.sm._particles().map(target => target.sprite.costumes[target.currentCostume].id);
    // tests if all the clones were created with the expected
    costumeId.map(target => t.equal(target, reqestedCostume));
    
    t.end();
});

test('go', t => {
    const setup = setupSicentificModelling();
    const totalParticles = 2;

    setup.sm.createParticles({PARTICLES: totalParticles}, {target: setup.target});
    // What about the original target? Should we execute go() only for clones?
    // isOriginal is true for the first clone and false for others. That's weird...
    setup.sm._particles().forEach(target => {
        t.ok(setup.sm.go({}, {target: target}));
    });
    setup.sm._step();
    setup.sm._particles().forEach(target => {
        t.notOk(setup.sm.go({}, {target: target}));
    });

    t.end();
});
