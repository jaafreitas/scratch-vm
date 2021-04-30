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

const util = () => {
    const thread = {stackFrames: [{executionContext: {}}]};
    return {
        thread: thread,
        get stackFrame () {
            return thread.stackFrames[0].executionContext;
        },
        startBranch: () => {}
    };
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

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 0);
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 0);
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#3'}), 0);

    // Adding initial data.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1'});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);

    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: '1, 2'});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 2);

    setup.dv.setData({LIST_ID: 'dataviewer#list#3', DATA: 'a,    2.22 ccc'});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#3'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#3', INDEX: 1}), 'a');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#3', INDEX: 2}), 2.22);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#3', INDEX: 3}), 'ccc');

    // Adding more data.
    setup.dv.dataBlocks.addToList(
        {LIST: {id: 'dataviewer#list#1', name: 'list 1'}, ITEM: 2},
        {target: setup.dv._runtime.getEditingTarget()});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);

    setup.dv.dataBlocks.addToList(
        {LIST: {id: 'dataviewer#list#2', name: 'list 2'}, ITEM: 3},
        {target: setup.dv._runtime.getEditingTarget()});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 3}), 3);

    setup.dv.dataBlocks.addToList(
        {LIST: {id: 'dataviewer#list#3', name: 'list 3'}, ITEM: 'dddd'},
        {target: setup.dv._runtime.getEditingTarget()});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#3'}), 4);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#3', INDEX: 4}), 'dddd');

    t.end();
});

test('Data Loop', t => {
    const setup = setupDataViewer();

    const utilList1 = util();
    const utilList1AnotherLoop = util();
    const utilList2 = util();

    // Adding initial data.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '10 20 30'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: '1.1 2.22 3.333'});

    // Initial state.
    t.equivalent(setup.dv._getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), null);
    t.equivalent(setup.dv._getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), null);
    t.equivalent(setup.dv._getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), null);
    t.equivalent(setup.dv._getValue({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), null);
    t.equivalent(setup.dv._getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), null);
    t.equivalent(setup.dv._getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), null);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), '');
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), '');
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), '');
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), '');
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), '');
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), '');

    // First data loop
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    // Skip this one in the first loop // setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#2'}, utilList2);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), 10);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), 1.1);

    // Second data loop
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#2'}, utilList2);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), 20);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 10);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), 2.22);

    // Third data loop
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#2'}, utilList2);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), 30);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 20);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), 3.333);

    // Going beyond data length with utilList1 and utilList2
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop);
    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#2'}, utilList2);
    t.equivalent(setup.dv._getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), null);
    t.equivalent(setup.dv._getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), null);
    t.equal(setup.dv._getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 3);
    t.equal(setup.dv._getValue({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 30);
    t.equivalent(setup.dv._getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), null);
    t.equivalent(setup.dv._getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), null);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), '');
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), '');
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1AnotherLoop), 30);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilList2), '');
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilList2), '');

    t.end();
});

test('Data Loop Read All', t => {
    const setup = setupDataViewer();
    const utilReadAll = util();

    // Adding initial data.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '10 20 30'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: '1.1 2.22 3.333'});

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilReadAll);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilReadAll), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilReadAll), 10);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilReadAll), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilReadAll), 1.1);

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilReadAll);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilReadAll), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilReadAll), 20);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilReadAll), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilReadAll), 2.22);

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilReadAll);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilReadAll), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilReadAll), 30);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilReadAll), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilReadAll), 3.333);

    t.end();
});

test('Data Loop Read All Different Lengths', t => {
    const setup = setupDataViewer();
    const utilReadAllDifferentLengths = util();

    // Adding initial data.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '10 30'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: '1.1 2.22 3.333'});

    t.equal(setup.dv._getMaxDataLengthReadAll(), 3);

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilReadAllDifferentLengths);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilReadAllDifferentLengths), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilReadAllDifferentLengths), 10);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilReadAllDifferentLengths), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilReadAllDifferentLengths), 1.1);

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilReadAllDifferentLengths);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilReadAllDifferentLengths), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilReadAllDifferentLengths), 30);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilReadAllDifferentLengths), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilReadAllDifferentLengths), 2.22);

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilReadAllDifferentLengths);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilReadAllDifferentLengths), '');
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilReadAllDifferentLengths), '');
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#2'}, utilReadAllDifferentLengths), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#2'}, utilReadAllDifferentLengths), 3.333);

    t.end();
});

test('Data Loop Strings', t => {
    const setup = setupDataViewer();
    const utilList1 = util();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: 'A 2 CCC'});

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilList1);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), 1);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), 'A');

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilList1);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), 2);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), 2);

    setup.dv.dataLoop({LIST_ID: setup.dv.READ_ALL_LISTS_ID}, utilList1);
    t.equal(setup.dv.getIndex({LIST_ID: 'dataviewer#list#1'}, utilList1), 3);
    t.equal(setup.dv.getValue({LIST_ID: 'dataviewer#list#1'}, utilList1), 'CCC');

    t.end();
});

test('Min / Max / Mean Numbers', t => {
    const setup = setupDataViewer();

    // Initial state.
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'min'}), '');
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'max'}), '');
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'mean'}), '');

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 4 5'});
    t.equal(setup.dv._getMin({LIST_ID: 'dataviewer#list#1'}), 1);
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'min'}), 1);
    t.equal(setup.dv._getMax({LIST_ID: 'dataviewer#list#1'}), 5);
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'max'}), 5);
    t.equal(setup.dv._getMean({LIST_ID: 'dataviewer#list#1'}), 3);
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'mean'}), 3);

    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: '-10 10'});
    t.equal(setup.dv._getMin({LIST_ID: 'dataviewer#list#2'}), -10);
    t.equal(setup.dv._getMax({LIST_ID: 'dataviewer#list#2'}), 10);
    t.equal(setup.dv._getMean({LIST_ID: 'dataviewer#list#2'}), 0);

    t.end();
});

test('Min / Max / Mean Strings', t => {
    const setup = setupDataViewer();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 CCC aaaa'});

    t.equivalent(setup.dv._getMin({LIST_ID: 'dataviewer#list#1'}), null);
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'min'}), '');

    t.equivalent(setup.dv._getMax({LIST_ID: 'dataviewer#list#1'}), null);
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'max'}), '');

    t.equivalent(setup.dv._getMean({LIST_ID: 'dataviewer#list#1'}), null);
    t.equal(setup.dv.getStatistic({LIST_ID: 'dataviewer#list#1', FNC: 'mean'}), '');

    t.end();
});

test('Data delete value', t => {
    const setup = setupDataViewer();

    // greater than.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '>', VALUE: '1', DATA_TYPE: setup.dv.DATA_TYPE_VALUE});

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 1);

    // less than.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '<', VALUE: '3', DATA_TYPE: setup.dv.DATA_TYPE_VALUE});

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 3);

    // equals to.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '=', VALUE: '2', DATA_TYPE: setup.dv.DATA_TYPE_VALUE});

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 1);

    // equals to 'defaultValue'.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '=', VALUE: ' ', DATA_TYPE: setup.dv.DATA_TYPE_VALUE});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 5);

    // // All lists
    // setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: 'a bb ccc bb d'});
    // setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'd bb bbb'});
    // setup.dv.deleteOfList(
    //     {LIST_ID: setup.dv.READ_ALL_LISTS_ID, OP: '=', VALUE: 'bb', DATA_TYPE: setup.dv.DATA_TYPE_VALUE});

    // t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 3);
    // t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 'a');
    // t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 'ccc');
    // t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 'd');

    // t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 2);
    // t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 'd');
    // t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 'bbb');

    t.end();
});

test('Data delete index', t => {
    const setup = setupDataViewer();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '>', VALUE: '2', DATA_TYPE: setup.dv.DATA_TYPE_INDEX});

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);

    // less than.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '<', VALUE: '3', DATA_TYPE: setup.dv.DATA_TYPE_INDEX});

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 1);

    // equals to.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '=', VALUE: '3', DATA_TYPE: setup.dv.DATA_TYPE_INDEX});

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 4);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 4}), 1);

    // equals to 'defaultValue'.
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 2 1'});
    setup.dv.deleteOfList({LIST_ID: 'dataviewer#list#1', OP: '=', VALUE: ' ', DATA_TYPE: setup.dv.DATA_TYPE_INDEX});
    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 5);

    //     // All lists
    //     setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: 'a bb ccc bb d'});
    //     setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'd bb bbb'});
    //     setup.dv.deleteOfList({
    //         LIST_ID: setup.dv.READ_ALL_LISTS_ID, OP: '>', VALUE: '3', DATA_TYPE: setup.dv.DATA_TYPE_INDEX});

    //     t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 3);
    //     t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 'a');
    //     t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 'bb');
    //     t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 'ccc');

    //     t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 3);
    //     t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 'd');
    //     t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 'bb');
    //     t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 3}), 'bbb');

    t.end();
});

test('Data delete value from all lists', t => {
    const setup = setupDataViewer();

    // DATASET = all lists
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '2 3 4 3 2'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'II III IV III II I'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#3', DATA: 'B c D C'});

    setup.dv.deleteOfList({
        DATA_TYPE: setup.dv.DATA_TYPE_VALUE,
        OP: '>',
        VALUE: '2',
        LIST_ID: 'dataviewer#list#1',
        DATASET: setup.dv.READ_ALL_LISTS_ID
    });

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 'II');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 'II');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 3}), 'I');

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#3'}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#3', INDEX: 1}), 'B');

    // DATASET = specific list
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '2 3 4 3 2'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'II III IV III II'});

    setup.dv.deleteOfList({
        DATA_TYPE: setup.dv.DATA_TYPE_VALUE,
        OP: '>',
        VALUE: '2',
        LIST_ID: 'dataviewer#list#1',
        DATASET: 'dataviewer#list#2'
    });

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 5);

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 'II');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 'II');

    t.end();
});

test('all lists to dataset to lists', t => {
    const setup = setupDataViewer();

    // DATASET = all lists
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'A B C'});

    const dataset = setup.dv._listsToDataset();

    t.equal(dataset.length, 3);
    t.equal(dataset[0]['dataviewer#list#1'], 1);
    t.equal(dataset[0]['dataviewer#list#2'], 'A');
    t.equal(dataset[1]['dataviewer#list#1'], 2);
    t.equal(dataset[1]['dataviewer#list#2'], 'B');
    t.equal(dataset[2]['dataviewer#list#1'], 3);
    t.equal(dataset[2]['dataviewer#list#2'], 'C');

    const lists = setup.dv._datasetToLists(dataset);
    t.equal(Object.keys(lists).length, 2);
    t.equal(lists['dataviewer#list#1'].length, 3);
    t.equal(lists['dataviewer#list#2'].length, 3);

    t.equal(lists['dataviewer#list#1'][0], 1);
    t.equal(lists['dataviewer#list#1'][1], 2);
    t.equal(lists['dataviewer#list#1'][2], 3);
    t.equal(lists['dataviewer#list#2'][0], 'A');
    t.equal(lists['dataviewer#list#2'][1], 'B');
    t.equal(lists['dataviewer#list#2'][2], 'C');


    t.end();
});


test('Order data value from all lists', t => {
    const setup = setupDataViewer();

    // DATASET = all lists ASC
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '3 2 1 2 3'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'IId IIIa IV IIIb IIc'});

    setup.dv.orderList({
        LIST_ID: 'dataviewer#list#1',
        DATASET: setup.dv.READ_ALL_LISTS_ID,
        ORDER: setup.dv.ORDER_ASC
    });

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 5);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 4}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 5}), 3);

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 5);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 'IV');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 'IIIa');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 3}), 'IIIb');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 4}), 'IId');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 5}), 'IIc');

    // // DATASET = all lists DESC
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: ''});

    setup.dv.orderList({
        LIST_ID: 'dataviewer#list#1',
        DATASET: setup.dv.READ_ALL_LISTS_ID,
        ORDER: setup.dv.ORDER_DESC
    });

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 1);


    // DATASET = specific list ASC
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '2 3 4 3 2'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: 'II III IV III II'});

    setup.dv.orderList({
        LIST_ID: 'dataviewer#list#1',
        DATASET: 'dataviewer#list#1',
        ORDER: setup.dv.ORDER_ASC
    });

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 5);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 4}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 5}), 4);

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#2'}), 5);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 'II');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 'III');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 3}), 'IV');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 4}), 'III');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 5}), 'II');

    // DATASET = specific list DESC
    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3'});
    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: ''});

    setup.dv.orderList({
        LIST_ID: 'dataviewer#list#1',
        DATASET: 'dataviewer#list#1',
        ORDER: setup.dv.ORDER_DESC
    });

    t.equal(setup.dv.getDataLength({LIST_ID: 'dataviewer#list#1'}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 3);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 1);


    t.end();
});


test('changeDataScale Numbers', t => {
    const setup = setupDataViewer();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 3 4 5'});
    setup.dv.changeDataScale({LIST_ID: 'dataviewer#list#1', NEW_MIN: 0, NEW_MAX: 100});
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 0);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 25);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 50);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 4}), 75);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 5}), 100);

    setup.dv.setData({LIST_ID: 'dataviewer#list#2', DATA: '5 4 3 2 1'});
    setup.dv.changeDataScale({LIST_ID: 'dataviewer#list#2', NEW_MIN: 0, NEW_MAX: 0.9});
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 1}), 0.9);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 2}), 0.68);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 3}), 0.45);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 4}), 0.23);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#2', INDEX: 5}), 0);

    t.end();
});

test('changeDataScale Strings', t => {
    const setup = setupDataViewer();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: 'A BB CCC'});
    setup.dv.changeDataScale({LIST_ID: 'dataviewer#list#1', NEW_MIN: 0, NEW_MAX: 100});
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 'A');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 'BB');
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 'CCC');

    t.end();
});

test('changeDataScale Numbers + Strings', t => {
    const setup = setupDataViewer();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 CCC'});
    setup.dv.changeDataScale({LIST_ID: 'dataviewer#list#1', NEW_MIN: 0, NEW_MAX: 100});
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 1}), 1);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 2}), 2);
    t.equal(setup.dv.getDataIndex({LIST_ID: 'dataviewer#list#1', INDEX: 3}), 'CCC');

    t.end();
});

test('Data Loop Map Numbers', t => {
    const setup = setupDataViewer();
    const utilList1 = util();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '10 20 30 40 50'});

    const argValue = {LIST_ID: 'dataviewer#list#1', DATA_TYPE: setup.dv.DATA_TYPE_VALUE, NEW_MIN: 0, NEW_MAX: 100};
    const argIndex = {LIST_ID: 'dataviewer#list#1', DATA_TYPE: setup.dv.DATA_TYPE_INDEX, NEW_MIN: 0, NEW_MAX: 0.9};

    // Initial state.
    t.equivalent(setup.dv._mapData(argValue, utilList1), null);
    t.equivalent(setup.dv._mapData(argIndex, utilList1), null);
    t.equal(setup.dv.mapData(argValue, utilList1), '');
    t.equal(setup.dv.mapData(argIndex, utilList1), '');

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), 0);
    t.equal(setup.dv.mapData(argIndex, utilList1), 0);

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), 25);
    t.equal(setup.dv.mapData(argIndex, utilList1), 0.23);

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), 50);
    t.equal(setup.dv.mapData(argIndex, utilList1), 0.45);

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), 75);
    t.equal(setup.dv.mapData(argIndex, utilList1), 0.68);

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), 100);
    t.equal(setup.dv.mapData(argIndex, utilList1), 0.9);

    t.end();
});

test('Data Loop Map Numbers + Strings', t => {
    const setup = setupDataViewer();
    const utilList1 = util();

    setup.dv.setData({LIST_ID: 'dataviewer#list#1', DATA: '1 2 CCC'});

    const argValue = {LIST_ID: 'dataviewer#list#1', DATA_TYPE: setup.dv.DATA_TYPE_VALUE, NEW_MIN: 0, NEW_MAX: 100};
    const argIndex = {LIST_ID: 'dataviewer#list#1', DATA_TYPE: setup.dv.DATA_TYPE_INDEX, NEW_MIN: 0, NEW_MAX: 100};

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), '');
    t.equal(setup.dv.mapData(argIndex, utilList1), 0);

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), '');
    t.equal(setup.dv.mapData(argIndex, utilList1), 50);

    setup.dv.dataLoop({LIST_ID: 'dataviewer#list#1'}, utilList1);
    t.equal(setup.dv.mapData(argValue, utilList1), '');
    t.equal(setup.dv.mapData(argIndex, utilList1), 100);

    t.end();
});

test('Data Menu', t => {
    const setup = setupDataViewer();

    // Initial setup
    let items = setup.dv.getDataMenu();
    t.equal(items.length, 2);
    t.equal(items[0].text, 'list 1');
    t.equal(items[0].value, 'dataviewer#list#1');
    t.equal(items[1].text, 'list 2');
    t.equal(items[1].value, 'dataviewer#list#2');
    t.equal(setup.dv.getDataMenuDefaultValue(), 'dataviewer#list#1');

    // Add another variables that should appear before others
    const stage = setup.dv._runtime.getTargetForStage();
    stage.lookupOrCreateList('a1', 'aaa1'); // id, name
    stage.lookupOrCreateList('A2', 'Aaa2'); // id, name
    items = setup.dv.getDataMenu();
    t.equal(items.length, 4);
    t.equal(items[0].text, 'aaa1');
    t.equal(items[0].value, 'a1');
    t.equal(items[1].text, 'Aaa2');
    t.equal(items[1].value, 'A2');
    t.equal(items[2].text, 'list 1');
    t.equal(items[2].value, 'dataviewer#list#1');
    t.equal(items[3].text, 'list 2');
    t.equal(items[3].value, 'dataviewer#list#2');
    t.equal(setup.dv.getDataMenuDefaultValue(), 'a1');

    // Delete the default menu list
    stage.deleteVariable('a1');
    items = setup.dv.getDataMenu();
    t.equal(items.length, 3);
    t.equal(items[0].text, 'Aaa2');
    t.equal(items[0].value, 'A2');
    t.equal(items[1].text, 'list 1');
    t.equal(items[1].value, 'dataviewer#list#1');
    t.equal(items[2].text, 'list 2');
    t.equal(items[2].value, 'dataviewer#list#2');
    t.equal(setup.dv.getDataMenuDefaultValue(), 'A2');

    t.end();
});

test('Data Loop Menu', t => {
    const setup = setupDataViewer();

    let items = setup.dv.getDataLoopMenu();
    t.equal(items.length, 3);
    t.equal(items[0].text, setup.dv.READ_ALL_LISTS_VALUE);
    t.equal(items[0].value, setup.dv.READ_ALL_LISTS_ID);
    t.equal(items[1].value, 'dataviewer#list#1');
    t.equal(items[2].value, 'dataviewer#list#2');

    const stage = setup.dv._runtime.getTargetForStage();
    stage.deleteVariable('dataviewer#list#1');
    items = setup.dv.getDataLoopMenu();
    t.equal(items.length, 2);
    t.equal(items[0].text, setup.dv.READ_ALL_LISTS_VALUE);
    t.equal(items[0].value, setup.dv.READ_ALL_LISTS_ID);
    t.equal(items[1].value, 'dataviewer#list#2');

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

test('Read CSV data from published Google Spreadsheet (CSV output link)', t => {
    const setup = setupDataViewer();

    setup.dv.readCSVDataFromURL({
        URL: `https://docs.google.com/spreadsheets/d/e/2PACX-1vSMZFJxFvz9tK4Y5s2VFEozwlpjNHYEiAMNTUjvyzivmMebsHzsBw8AbxDPz0ka9-a3a8-7wqPDbMCV/pub?output=csv`,
        COLUMN: '1',
        LINE: '2'
    }).then(data => {
        t.equal(data.split(' ').length, 408);

        t.end();
    });
});

test('Read CSV data from published Google Spreadsheet (main link)', t => {
    const setup = setupDataViewer();

    const URL = 'https://docs.google.com/spreadsheets/d/1PBDC5fauOWlFbc5MDzbLCVhR4POSMo38IAenCRaatg4/edit#gid=0';

    // Year
    setup.dv.readCSVDataFromURL({URL: URL, COLUMN: '1', LINE: '2'})
        .then(data => {
            t.equal(data.split(' ').length, 408);

            // One Letter
            return setup.dv.readCSVDataFromURL({URL: URL, COLUMN: '2', LINE: '2'});
        })
        .then(data => {
            t.equal(data.split(' ').length, 995);

            // Many Letters
            return setup.dv.readCSVDataFromURL({URL: URL, COLUMN: '3', LINE: '2'});
        })
        .then(data => {
            t.equal(data.split(' ').length, 995);

            //     // Spaced Letters
            //     return setup.dv.readCSVDataFromURL({URL: URL, COLUMN: '4', LINE: '2'});
            // })
            // .then(data => {
            //     t.equal(data.split(' ').length, 1);

            // áçãàü
            return setup.dv.readCSVDataFromURL({URL: URL, COLUMN: '5', LINE: '2'});
        })
        .then(data => {
            t.equal(data.split(' ').length, 408);

            // Column out of range.
            return setup.dv.readCSVDataFromURL({URL: URL, COLUMN: '99', LINE: '2'});
        })
        .then(data => {
            t.equal(data.split(' ').length, 1);

            t.end();
        });
});

test('Create lists from Google Spreadsheet', t => {
    const setup = setupDataViewer();

    setup.dv.createListsFromGoogleSheets({
        URL: `https://docs.google.com/spreadsheets/d/1PBDC5fauOWlFbc5MDzbLCVhR4POSMo38IAenCRaatg4/edit#gid=0`
    }).then(() => {

        t.equal(setup.dv.getDataLength({LIST_ID: 'Year'}), 408);
        t.equal(setup.dv.getDataLength({LIST_ID: 'One Letter'}), 995);
        t.equal(setup.dv.getDataLength({LIST_ID: 'Many Letters'}), 995);
        // t.equal(setup.dv.getDataLength({LIST_ID: 'Spaced Letters'}), 995);
        t.equal(setup.dv.getDataLength({LIST_ID: 'áçãàü'}), 408);

        t.end();
    });
});
