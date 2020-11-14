const test = require('tap').test;
const DataViewer = require('../../src/extensions/scratch3_dataviewer/index.js');
const Runtime = require('../../src/engine/runtime');
const Blocks = require('../../src/engine/blocks');
const Sprite = require('../../src/sprites/sprite.js');
const RenderedTarget = require('../../src/sprites/rendered-target');
const FakeRenderer = require('../fixtures/fake-renderer');

const setupDataViewer = () => {
    const rt = new Runtime();
    const fr = new FakeRenderer();
    FakeRenderer.prototype.updateDrawableProperties = () => {};
    rt.attachRenderer(fr);

    const blocks = new Blocks(rt);
    const sprite = new Sprite(blocks, rt);
    const target = new RenderedTarget(sprite, rt);
    rt.addTarget(target);

    const util = {
        target: target
    };

    const dv = new DataViewer(rt);

    return {dv: dv, util: util};
};

test('spec', t => {
    const dv = new DataViewer({on: () => {}});

    t.type(dv, 'object');

    t.type(dv._runtime, 'object');
    t.equal(dv._runtime.DataviewerMinimalBlocks, true);

    t.equal(dv.scalex, 100);
    t.equal(dv.scaley, 100);

    t.end();
});

test('Scale', t => {
    const setup = setupDataViewer();
    setup.dv.setScaleX({SCALEX: 150}, setup.util);
    t.equal(setup.dv.scalex, 100);
    t.equal(setup.dv.scaley, 100);
    t.end();
});
