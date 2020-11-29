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
    rt.attachRenderer(fr);

    const blocks = new Blocks(rt);

    const spriteStage = new Sprite(blocks, rt);
    spriteStage.name = 'Stage';
    const stage = new RenderedTarget(spriteStage, rt);
    stage.isStage = true;
    rt.targets = [stage];

    const sprite = new Sprite(blocks, rt);
    const target = new RenderedTarget(sprite, rt);
    target.renderer = fr;
    sprite.clones.push(target);
    target.addCostume({id: 1});
    rt.addTarget(target);
    rt.setEditingTarget(target);

    const dv = new DataViewer(rt);
    return {dv: dv};
};

test('spec', t => {
    const dv = new DataViewer({on: () => {}, getTargetForStage: () => {}});

    t.type(dv, 'object');

    t.type(dv._runtime, 'object');
    t.equal(dv._runtime.DataviewerMinimalBlocks, true);
    t.type(dv.dataBlocks, 'object');

    t.type(dv._eventTargetVisualChange, 'function');
    t.type(dv._onTargetCreated, 'function');
    t.type(dv._blocksInfoUpdate, 'function');

    t.end();
});

test('Data', t => {
    const setup = setupDataViewer();

    t.equal(setup.dv.getDataLength({DATA_ID: 'data1'}), 0);
    t.equal(setup.dv.getDataLength({DATA_ID: 'data2'}), 0);
    t.equal(setup.dv.getDataLength({DATA_ID: 'data3'}), 0);

    // Adding initial data.
    setup.dv.setData({DATA_ID: 'data1', DATA: '1'});
    t.equal(setup.dv.getDataLength({DATA_ID: 'data1'}), 1);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 1}), 1);

    setup.dv.setData({DATA_ID: 'data2', DATA: '1, 2'});
    t.equal(setup.dv.getDataLength({DATA_ID: 'data2'}), 2);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 2}), 2);

    setup.dv.setData({DATA_ID: 'data3', DATA: 'a,    2.22 ccc'});
    t.equal(setup.dv.getDataLength({DATA_ID: 'data3'}), 3);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data3', INDEX: 1}), 'a');
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data3', INDEX: 2}), 2.22);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data3', INDEX: 3}), 'ccc');

    // Adding more data.
    setup.dv.dataBlocks.addToList(
        {LIST: {id: 'data1', name: 'data1'}, ITEM: 2},
        {target: setup.dv._runtime.getEditingTarget()});
    t.equal(setup.dv.getDataLength({DATA_ID: 'data1'}), 2);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 2}), 2);

    setup.dv.dataBlocks.addToList(
        {LIST: {id: 'data2', name: 'data2'}, ITEM: 3},
        {target: setup.dv._runtime.getEditingTarget()});
    t.equal(setup.dv.getDataLength({DATA_ID: 'data2'}), 3);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 3}), 3);

    setup.dv.dataBlocks.addToList(
        {LIST: {id: 'data3', name: 'data3'}, ITEM: 'dddd'},
        {target: setup.dv._runtime.getEditingTarget()});
    t.equal(setup.dv.getDataLength({DATA_ID: 'data3'}), 4);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data3', INDEX: 4}), 'dddd');

    t.end();
});

test('Data Loop', t => {
    const setup = setupDataViewer();

    const utilX = () => {
        const thread = {stackFrames: [{executionContext: {}}]};
        return {
            thread: thread,
            get stackFrame () {
                return thread.stackFrames[0].executionContext;
            },
            startBranch: () => {}
        };
    };

    const utilData1 = utilX();
    const utilData1AnotherLoop = utilX();
    const utilData2 = utilX();

    // Adding initial data.
    setup.dv.setData({DATA_ID: 'data1', DATA: '10 20 30'});
    setup.dv.setData({DATA_ID: 'data2', DATA: '1.1 2.22 3.333'});
    t.equivalent(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1), null);
    t.equivalent(setup.dv.getValue({DATA_ID: 'data1'}, utilData1), null);
    t.equivalent(setup.dv.getIndex({DATA_ID: 'data2'}, utilData2), null);
    t.equivalent(setup.dv.getValue({DATA_ID: 'data2'}, utilData2), null);
    t.equivalent(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1AnotherLoop), null);
    t.equivalent(setup.dv.getValue({DATA_ID: 'data1'}, utilData1AnotherLoop), null);

    // First data loop
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1);
    // Skip this one in the first loop // setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1AnotherLoop);
    setup.dv.dataLoop({DATA_ID: 'data2'}, utilData2);
    t.equal(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1), 1);
    t.equal(setup.dv.getValue({DATA_ID: 'data1'}, utilData1), 10);
    t.equal(setup.dv.getIndex({DATA_ID: 'data2'}, utilData2), 1);
    t.equal(setup.dv.getValue({DATA_ID: 'data2'}, utilData2), 1.1);

    // Second data loop
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1);
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1AnotherLoop);
    setup.dv.dataLoop({DATA_ID: 'data2'}, utilData2);
    t.equal(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1), 2);
    t.equal(setup.dv.getValue({DATA_ID: 'data1'}, utilData1), 20);
    t.equal(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1AnotherLoop), 1);
    t.equal(setup.dv.getValue({DATA_ID: 'data1'}, utilData1AnotherLoop), 10);
    t.equal(setup.dv.getIndex({DATA_ID: 'data2'}, utilData2), 2);
    t.equal(setup.dv.getValue({DATA_ID: 'data2'}, utilData2), 2.22);

    // Third data loop
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1);
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1AnotherLoop);
    setup.dv.dataLoop({DATA_ID: 'data2'}, utilData2);
    t.equal(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1), 3);
    t.equal(setup.dv.getValue({DATA_ID: 'data1'}, utilData1), 30);
    t.equal(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1AnotherLoop), 2);
    t.equal(setup.dv.getValue({DATA_ID: 'data1'}, utilData1AnotherLoop), 20);
    t.equal(setup.dv.getIndex({DATA_ID: 'data2'}, utilData2), 3);
    t.equal(setup.dv.getValue({DATA_ID: 'data2'}, utilData2), 3.333);

    // Going beyond data length with utilData1 and utilData2
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1);
    setup.dv.dataLoop({DATA_ID: 'data1'}, utilData1AnotherLoop);
    setup.dv.dataLoop({DATA_ID: 'data2'}, utilData2);
    t.equivalent(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1), null);
    t.equivalent(setup.dv.getValue({DATA_ID: 'data1'}, utilData1), null);
    t.equal(setup.dv.getIndex({DATA_ID: 'data1'}, utilData1AnotherLoop), 3);
    t.equal(setup.dv.getValue({DATA_ID: 'data1'}, utilData1AnotherLoop), 30);
    t.equivalent(setup.dv.getIndex({DATA_ID: 'data2'}, utilData2), null);
    t.equivalent(setup.dv.getValue({DATA_ID: 'data2'}, utilData2), null);

    t.end();
});

test('Min / Max / Mean', t => {
    const setup = setupDataViewer();

    setup.dv.setData({DATA_ID: 'data1', DATA: '1 2 3 4 5'});
    t.equal(setup.dv._getMin({DATA_ID: 'data1'}), 1);
    t.equal(setup.dv._getMax({DATA_ID: 'data1'}), 5);
    t.equal(setup.dv._getMean({DATA_ID: 'data1'}), 3);

    setup.dv.setData({DATA_ID: 'data2', DATA: '-10 10'});
    t.equal(setup.dv._getMin({DATA_ID: 'data2'}), -10);
    t.equal(setup.dv._getMax({DATA_ID: 'data2'}), 10);
    t.equal(setup.dv._getMean({DATA_ID: 'data2'}), 0);

    t.end();
});

test('changeDataScale', t => {
    const setup = setupDataViewer();

    setup.dv.setData({DATA_ID: 'data1', DATA: '1 2 3 4 5'});
    setup.dv.changeDataScale({DATA_ID: 'data1', NEW_MIN: 0, NEW_MAX: 100});
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 1}), 0);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 2}), 25);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 3}), 50);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 4}), 75);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data1', INDEX: 5}), 100);

    setup.dv.setData({DATA_ID: 'data2', DATA: '5 4 3 2 1'});
    setup.dv.changeDataScale({DATA_ID: 'data2', NEW_MIN: 0, NEW_MAX: 0.9});
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 1}), 0.9);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 2}), 0.68);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 3}), 0.45);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 4}), 0.23);
    t.equal(setup.dv.getDataIndex({DATA_ID: 'data2', INDEX: 5}), 0);

    t.end();
});

test('DataID Menu', t => {
    const setup = setupDataViewer();

    // Initial setup
    let items = setup.dv.getDataIdMenu();
    t.equal(items.length, 3);
    t.equal(items[0].text, 'data1');
    t.equal(items[0].value, 'data1');
    t.equal(items[1].text, 'data2');
    t.equal(items[1].value, 'data2');
    t.equal(items[2].text, 'data3');
    t.equal(items[2].value, 'data3');
    t.equal(setup.dv.getDataIdMenuDefaultValue(), 'data1');

    // Delete one variable in the midle of the menu list
    const stage = setup.dv._runtime.getTargetForStage();
    stage.deleteVariable('data2');
    items = setup.dv.getDataIdMenu();
    t.equal(items.length, 2);
    t.equal(items[0].text, 'data1');
    t.equal(items[0].value, 'data1');
    t.equal(items[1].text, 'data3');
    t.equal(items[1].value, 'data3');
    t.equal(setup.dv.getDataIdMenuDefaultValue(), 'data1');

    // Add another variables that should appear before others
    stage.lookupOrCreateList('a1', 'aaa1'); // id, name
    stage.lookupOrCreateList('A2', 'Aaa2'); // id, name
    items = setup.dv.getDataIdMenu();
    t.equal(items.length, 4);
    t.equal(items[0].text, 'aaa1');
    t.equal(items[0].value, 'a1');
    t.equal(items[1].text, 'Aaa2');
    t.equal(items[1].value, 'A2');
    t.equal(items[2].text, 'data1');
    t.equal(items[2].value, 'data1');
    t.equal(items[3].text, 'data3');
    t.equal(items[3].value, 'data3');
    t.equal(setup.dv.getDataIdMenuDefaultValue(), 'aaa1');

    t.end();
});

test('Scale', t => {
    let scale;

    const setup = setupDataViewer();
    const target = setup.dv._runtime.getEditingTarget();

    // Change only scaleX.
    setup.dv.setScaleX({SCALEX: 150}, {target: target});
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 150);
    t.equal(scale.y, 100);
    t.equal(target.scalex, 150);
    t.equal(target.scaley, 100);

    // Change only scaleY and preserving scaleX.
    setup.dv.setScaleY({SCALEY: 50}, {target: target});
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 150);
    t.equal(scale.y, 50);
    t.equal(target.scalex, 150);
    t.equal(target.scaley, 50);

    // Make a clone and check if we got scale property
    const clone = target.makeClone();
    setup.dv._runtime.setEditingTarget(clone);
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 150);
    t.equal(scale.y, 50);

    // Can we modify the clone without changing the original target scale?
    setup.dv.setScaleX({SCALEX: 222.2}, {target: clone});
    setup.dv.setScaleY({SCALEY: 444.44}, {target: clone});
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 222.2);
    t.equal(scale.y, 444.44);
    setup.dv._runtime.setEditingTarget(target);
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 150);
    t.equal(scale.y, 50);

    // Minimum scale test
    setup.dv.setScaleX({SCALEX: -100.0}, {target: target});
    setup.dv.setScaleY({SCALEY: 4}, {target: target});
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 5);
    t.equal(scale.y, 5);

    // Minimum scale + size test
    target.setSize(200);
    t.equals(target._getRenderedDirectionAndScale().scale[0], 200);
    // The value 0 was intentionally choose for scale test.
    setup.dv.setScaleX({SCALEX: 0}, {target: target});
    setup.dv.setScaleY({SCALEY: 0}, {target: target});
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 2.5);
    t.equal(scale.y, 2.5);
    // After changing size, the scale might need to be changed to a higher value.
    target.setSize(100);
    scale = setup.dv._getEditingTargetScale();
    t.equal(scale.x, 5);
    t.equal(scale.y, 5);

    t.end();
});

// Pendências
// mapData
// Funções com índices
