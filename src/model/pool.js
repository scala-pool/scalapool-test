'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd(), '');
const Ajv = require('ajv');
const ajv = new Ajv();
const CoinManager = require('@scalapool/core/coin_manager');
const Redis = require('@scalapool/ds/redis');

global.config = {
	api: {
		hashrateWindow: 120,
		blocks: 30,
		payments: 30
	},
	block: {
		depth: 30
	}
};
global.ds = {
	redis: Redis({
		disableVersionCheck: true,
		db: 10 // we set to a number not use so that we don't mistakenly set at production
	})
};
CoinManager.loadConfig({
	xla: {}
});

const Pool = require('@scalapool/model/pool');
const pool = new Pool();

test(category + ':  getBlockStats', async t => {
	const redisClient = global.ds.redis;
	await redisClient
		.multi()
		.del('xla:blocks:candidates')
		.del('xla:blocks:matured')
		.zadd('xla:blocks:candidates', 429586, '429586:hash1:1647859562:820084847:474074185:0:375000:longaddress1:solo:0:false')
		.zadd('xla:blocks:matured', 429569, '429569:hash2:1647858004:741095446:321855010:0:375060:longaddress2:solo:0:true')
		.zadd('xla:blocks:matured', 429557, '429557:hash3:1647856062:825473288:865379438:0:375000:longaddress3:props:0:true')
		.zadd('xla:blocks:matured', 429549, '429549:hash4:1647854955:815088222:691128308:0:375000:longaddress4:props:0:true')
		.exec();

	const validator = ajv.compile({
		type: 'object',
		required: ['candidates', 'matured', 'total'],
		properties: {
			candidates: { type: 'array' },
			matured: { type: 'array' },
			total: { type: 'number' }
		}
	});

	const block = await pool.getBlockStats('xla').catch(e => {
		console.log(e);
	});
	validator(block);
	t.is(validator.errors, null);
	t.is(block.total, 3);
});

test(category + ':  getPaymentStats', async t => {
	await global.ds.redis
		.multi()
		.del('xla:payments:all')
		.zadd('xla:payments:all', 1647877453.0, 'hash:103475:120:9:1:1647877453')
		.zadd('xla:payments:all', 1647874453.0, 'hash:113475:120:9:1:1647874453')
		.zadd('xla:payments:all', 1647873453.0, 'hash:123475:120:9:1:1647873453')
		.zadd('xla:payments:all', 1647871453.0, 'hash:1303475:120:9:1:1647871453')
		.zadd('xla:payments:address', 1647877453.0, 'hash:1303475:120:9:1647877453')
		.zadd('xla:payments:address1', 1647871453.0, 'hash:1303475:120:9:1647871453')
		.zadd('xla:payments:address2', 1647861453.0, 'hash:1303475:120:9:1647861453')
		.exec();

	const validator = ajv.compile({
		type: 'object',
		required: ['totalPayments', 'payments', 'totalMinersPaid'],
		properties: {
			totalPayments: { type: 'number' },
			payments: { type: 'array' },
			totalMinersPaid: { type: 'number' }
		}
	});
	const payment = await pool.getPaymentStats('xla');
	validator(payment);
	t.is(validator.errors, null);
	t.is(payment.totalMinersPaid, 3);
	t.is(payment.totalPayments, 4);
});

test.skip(category + ': getStats', async t => {

});

test(category + ':  getMinerStats', async t => {
	const validator = ajv.compile({
		type: 'object',
		required: ['workers', 'miners', 'totalHashes', 'minerStats'],
		properties: {
			workers: { type: 'number' },
			miners: { type: 'number' },
			totalHashes: { type: 'number' },
			minerStats: { type: 'object' }
		}
	});
	const miner = await pool.getMinerStats('xla');
	validator(miner);
	t.is(validator.errors, null);
});
