'use strict';
require('module-alias/register');
require('@scalapool/utils/index.js');
const test = require('ava');
const Panthera = require('@scalapool/algos/panthera.js');
global.log = function (a, b, c) { console.log(a, b, c); };
const category = __filename.replace(process.cwd() + '/tests', '');

const panthera = new Panthera();

test(category + ' : variant', t => {
	t.is(panthera.variant, 3);
});

test(category + ' : blobType', t => {
	t.is(panthera.type, 'randomx');
});

test(category + ' : hash', async t => {
	const a = Buffer.from('0c0cedabc4f8059535516f43f0f480ca4ab081ef4119fc8b1eb980e78f16cfad8fb3227f5f113e278400003e2d90c6f83a2f0f95f829455e739f8c16d5eeedad382804b2cfefea4b150e4c01', 'hex');
	const b = Buffer.from('1b7d5a95878b2d38be374cf3476bd07f5ea83adf2e8ca3f34aca49009af7f498', 'hex');
	const result = await panthera.hash(a, b);
	t.is(result.toString('hex'), '8ef59b356386cccba1e481c79fe1bf4423b8837d539610842a4ab576695e0800');
});
