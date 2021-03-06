'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');

const Ajv = require('ajv');
// options can be passed, e.g. {allErrors: true}
const Stats = require('@scalapool/modules/api/routes/stats');
const stats = new Stats();
const CoinManager = require('@scalapool/core/coin_manager');

test(category + ' : query', t => {
	const ajv = new Ajv();
	const validate = ajv.compile(stats.schema.get.querystring);

	t.false(validate({}));
	t.true(validate({ coin: 'xla' }));
	t.false(validate({ coin: 1 }));
	t.false(validate({ longpoll: true }));
	t.false(validate({ coin: 'xla', longpoll: 'abcdef' }));
	t.true(validate({ coin: 'xla', longpoll: true }));
	t.false(validate({ coin: 'xla', longpoll: 1 }));
	t.true(validate({ coin: 'xla', longpoll: true, address: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF' }));
	t.true(validate({ coin: 'xla', longpoll: true, address: 'sdasdasda' }));
	t.false(validate({ coin: 'xla', longpoll: true, address: 3423423423 }));
});

test.skip(category + ' : getInfoWorker', t => {

});

test.skip(category + ' : getInfo', t => {

});

test(category + ' : getHandler without coin query', async t => {
	CoinManager.loadConfig({
		xla: {}
	}, true);
	Stats.Stats = {
		xla: {
			key: 'value'
		}
	};
	global.model = {
		pool: {
			getConfig: () => {
				return {
					key2: 'value2'
				};
			}
		}
	};
	const handler = async () => new Promise((resolve, reject) => {
		stats.getHandler({
			query: {}
		}, {
			send: resolve
		}).catch(reject);
	});
	const error = await t.throwsAsync(handler);
	t.is(error.message, 'Missing coin params');
});

test(category + ' : getHandler without coin data', async t => {
	CoinManager.loadConfig({
		xla: {}
	}, true);
	Stats.Stats = {};
	global.model = {
		pool: {
			getConfig: () => {
				return {
					key2: 'value2'
				};
			}
		}
	};
	const handler = async () => new Promise((resolve, reject) => {
		stats.getHandler({
			query: { coin: 'xla' }
		}, {
			send: resolve
		}).catch(reject);
	});
	const error = await t.throwsAsync(handler);
	t.is(error.message, 'No coin information from pool yet');
});

test(category + ' : getHandler without address', async t => {
	CoinManager.loadConfig({
		xla: {}
	}, true);
	Stats.Stats = {
		xla: {
			key: 'value'
		}
	};
	global.model = {
		pool: {
			getConfig: () => {
				return {
					key2: 'value2'
				};
			}
		}
	};
	const handler = async () => new Promise((resolve, reject) => {
		stats.getHandler({
			query: {
				coin: 'xla'
				// address: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF'
			}
		}, {
			send: resolve
		}).catch(reject);
	});

	const response = await handler().catch(e => console.log(e.message));
	const ajv = new Ajv();
	const validate = ajv.compile({
		type: 'object',
		properties: {
			key: { type: 'string' },
			config: { type: 'object' }
		}
	});
	validate(response);
	t.is(validate.errors, null);
});
