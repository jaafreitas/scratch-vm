const test = require('tap').test;
const Runtime = require('../../src/engine/runtime');
const Blocks = require('../../src/engine/blocks');
const Sprite = require('../../src/sprites/sprite.js');
const RenderedTarget = require('../../src/sprites/rendered-target');

const SicentificModelling = require('../../src/extensions/scratch_scientific_modelling/index.js');

test('spec', t => {
    const rt = new Runtime();    
    const sm = new SicentificModelling(rt);

    t.type(sm, 'object');
    t.equal(sm.vel, 0);
    t.type(sm.motion, 'object');
    t.type(sm.looks, 'object');
    t.type(sm.data, 'object');
    t.equal(sm.temp, 'medium');
    t.true(sm.limiter);

    t.end();
});


test('temperatureReporter', t => {
    const rt = new Runtime();
    const blocks = new Blocks(rt);

    const sprite = new Sprite(blocks, rt);
    sprite.name = 'Stage';

    const stage = new RenderedTarget(sprite, rt);
    stage.isStage = true;

    rt.targets = [stage];

    const sm = new SicentificModelling(rt);
    t.equal(sm.temperatureReporter(), 'medium');

    rt.getTargetForStage().variables.temperatureSlider.value = 0;
    sm._step();
    t.equal(sm.temperatureReporter(), 'low');

    rt.getTargetForStage().variables.temperatureSlider.value = 100;
    sm._step();
    t.equal(sm.temperatureReporter(), 'high');

    t.end();
})

