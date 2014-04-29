
var vimg = new Vimg({
        selector: '.vimg' // note: this could be [data-vimg]
        , interval: 3000  // default: 1000 - how often will be poll for changes
        , offset: 500 // default: 300 - how far below viewport to load
    })
  , images = document.getElementsByClassName('vimg');

test('new Vimg({...})', function () {
    ok(typeof vimg == 'object', 'should return an object');

    ok(vimg.images.length === images.length, 'should find all relevant images except for our right-away item.');

    ok(typeof vimg.poll === 'function', 'poll method should be exposed.');
});

test('Right away test; data-src and src should be equal', function() {
    vimg.poll();

    var ra = document.getElementById('right-away');

    equal(ra.getAttribute('data-src'), ra.getAttribute('src'),
        'data-src should equal src immediately.');
});

test('Display none; vimg should not switch src attribute if display none', function() {
    vimg.poll();

    var dn = document.getElementById('display-none');

    notEqual(dn.getAttribute('data-src'), dn.getAttribute('src'),
        'data-src and src should not be equal.');

    dn.style.display = 'block';
    vimg.poll();

    equal(dn.getAttribute('data-src'), dn.getAttribute('src'),
        'data-src and src should now be equal after changing display.');
});

test('EventEmitter; should emit default event vimg-loaded on switch', function () {
    var ee = document.getElementById('event-emitter'),
        evented = false;

    vimg.internals.subscribeEvent(ee, 'vimg-loaded', function() {
        evented = true;
    });

    ee.style.marginTop = 0;
    ee.style.position = 'relative';

    vimg.poll();

    ok(evented === true, 'Evented should equal true after poll.');
});

test('subscribeEvent & emitEvent; direct method tests.', function () {
    var body = document.getElementsByTagName('body')[0];

    var callback = function (e) {
        ok(e, 'Event subsriber received event');
    }

    vimg.internals.subscribeEvent(body, 'testEvent', callback);

    var emitter = vimg.internals.emitEvent(body, 'testEvent');

    ok(emitter, 'Emitter returned true');
});

test('shouldPoll; should return true on call', function () {
    ok(vimg.internals.shouldPoll() === true, 'Method returns boolean true value.');
});

test('pollNodes; should return to use an array of nodes', function () {
    var poll = vimg.internals.pollNodes(true);

    ok(poll instanceof Array, 'An array is returned from method.');
});

test('srcAttr; should be able to set custom attribute for source', function () {
    var otherSrc = new Vimg({
        selector: '[data-othersrc]'
        , interval: 3000
        , offset: 500
        , srcAttr: 'data-othersrc'
    }),
    img = otherSrc.images[0];

    img.style.display = 'block';

    otherSrc.poll();

    equal(img.getAttribute('data-othersrc'), img.getAttribute('src'),
        'othersrc-src and src should now be equal after changing display.');
});




