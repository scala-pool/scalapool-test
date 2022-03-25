'use strict';
require('module-alias/register');

global.log = function (a, b, c) {

};
const test = require('ava');
const MinerInfo = require('@scalapool/modules/pool/miner_info');
const CoinManager = require('@scalapool/core/coin_manager');

// test('Test info : construct', async t => {
// 	const sampleParams = {
// 		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
// 		algo: ['panthera']
// 	};
// 	CoinManager.loadConfig({
// 		xla: {}
// 	});

// });
