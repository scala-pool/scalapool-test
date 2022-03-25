'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd(), '');
const Ajv = require('ajv');
const ajv = new Ajv();
const Block = require('@scalapool/db/model/block');

const validate = ajv.compile({
	type: 'object',
	required: ['height', 'hash', 'timestamp', 'difficulty', 'shares', 'miner', 'poolType', 'orphaned', 'unlocked'],
	properties: {
		height: { type: 'number' },
		hash: { type: 'string' },
		timestamp: { type: 'number' },
		difficulty: { type: 'number' },
		miner: { type: 'string' },
		poolType: { type: 'string' },
		orphaned: { type: 'number' },
		unlocked: { type: 'boolean' },
		shares: { type: 'number' }
	}
});

test(category + ': check from string to object', t => {
	const block = new Block('429569:hash:1647858004:741095446:3218550100:0:375060:address:solo:0:true');
	const validate = ajv.compile({
		type: 'object',
		required: ['height', 'hash', 'timestamp', 'difficulty', 'shares', 'miner', 'poolType', 'orphaned', 'unlocked'],
		properties: {
			height: { type: 'number' },
			hash: { type: 'string' },
			timestamp: { type: 'number' },
			difficulty: { type: 'number' },
			miner: { type: 'string' },
			poolType: { type: 'string' },
			orphaned: { type: 'number' },
			unlocked: { type: 'boolean' },
			shares: { type: 'number' }
		}
	});

	validate(block);
	t.is(validate.errors, null);
	t.is(block.height, 429569);
	t.is(block.hash, 'hash');
	t.is(block.timestamp, 1647858004);
	t.is(block.difficulty, 741095446);
	t.is(block.shares, 3218550100);
	t.is(block.miner, 'address');
	t.is(block.reward, 375060);
	t.is(block.poolType, 'solo');
	t.is(block.orphaned, 0);
	t.true(block.unlocked);
});

test(category + ': check from string to object (multi)', t => {
	for (const str of [
		'429586:hash1:1647859562:820084847:474074185:0:375000:longaddress1:solo:0:false',
		'429569:hash2:1647858004:741095446:321855010:0:375060:longaddress2:solo:0:true',
		'429557:hash3:1647856062:825473288:865379438:0:375000:longaddress3:props:0:true',
		'429549:hash4:1647854955:815088222:691128308:0:375000:longaddress4:props:0:true'
	]) {
		const block = new Block(str);
		validate(block);
		t.is(validate.errors, null);
	}
});

test(category + ': check from string to object (orphaned)', t => {
	const block = new Block('429569:hash:1647858004:741095446:3218550100:0:375060:address:solo:1:true');
	const validate = ajv.compile({
		type: 'object',
		required: ['height', 'hash', 'timestamp', 'difficulty', 'shares', 'miner', 'poolType', 'orphaned', 'unlocked'],
		properties: {
			height: { type: 'number' },
			hash: { type: 'string' },
			timestamp: { type: 'number' },
			difficulty: { type: 'number' },
			miner: { type: 'string' },
			poolType: { type: 'string' },
			orphaned: { type: 'number' },
			unlocked: { type: 'boolean' },
			shares: { type: 'number' }
		}
	});

	validate(block);
	t.is(validate.errors, null);
	t.is(block.height, 429569);
	t.is(block.hash, 'hash');
	t.is(block.timestamp, 1647858004);
	t.is(block.difficulty, 741095446);
	t.is(block.shares, 3218550100);
	t.is(block.miner, 'address');
	t.is(block.reward, 375060);
	t.is(block.poolType, 'solo');
	t.is(block.orphaned, 1);
	t.true(block.unlocked);
});

test(category + ': check dirty', t => {
	const block = new Block('429569:hash:1647858004:741095446:3218550100:0:375060:address:solo:1:true');
	block.height = 1;
	t.true(block.isDirty());
	t.is(block.original.height, 429569);
	t.is(block.dirty.height, 1);
});
