'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');

const CoinManager = require('@scalapool/core/coin_manager');
const _config = {
	xla: { key: 'value' },
	rtm: { key: 'value2' },
	veil: { key: 'value3' }
};
const cm = CoinManager.loadConfig(_config, true);
global.log = function (a, b, c) { console.log(a, b, c); };

test(category + ' : loadConfig', t => {
	t.is(cm, true);
});

test(category + ' : config', t => {
	let config = CoinManager.config('xla');

	t.is(config.key, 'value');

	config = CoinManager.config('rtm');

	t.is(config.key, 'value2');

	config = CoinManager.config('veil');

	t.is(config.key, 'value3');

	config = CoinManager.config();

	t.is(config.xla.key, 'value');
	t.is(config.rtm.key, 'value2');
	t.is(config.veil.key, 'value3');
});

test(category + ' : listCoins', t => {
	const coins = CoinManager.listCoins();
	t.is(coins.length, 3);
	t.true(coins.indexOf('xla') >= 0);
	t.true(coins.indexOf('rtm') >= 0);
	t.true(coins.indexOf('veil') >= 0);
	let exists = CoinManager.listCoins('xla');
	t.true(exists);
	exists = CoinManager.listCoins('rtm');
	t.true(exists);
	exists = CoinManager.listCoins('veil');
	t.true(exists);
});

test(category + ' : coinsWithAlgo', t => {
	let coinsWithAlgo = CoinManager.coinsWithAlgo();

	t.is(coinsWithAlgo.rtm[0], 'ghostrider');
	t.is(coinsWithAlgo.xla[0], 'panthera');
	t.true(coinsWithAlgo.veil.indexOf('sha256d') >= 0);
	t.true(coinsWithAlgo.veil.indexOf('x16rt') >= 0);

	coinsWithAlgo = CoinManager.coinsWithAlgo('xla');
	t.is(coinsWithAlgo[0], 'panthera');

	coinsWithAlgo = CoinManager.coinsWithAlgo('rtm');
	t.is(coinsWithAlgo[0], 'ghostrider');

	coinsWithAlgo = CoinManager.coinsWithAlgo('veil');
	t.true(coinsWithAlgo.indexOf('sha256d') >= 0);
	t.true(coinsWithAlgo.indexOf('x16rt') >= 0);
});

test(category + ' : getCoins', t => {
	let getCoin = CoinManager.getCoins('xla');

	t.is(getCoin.constructor.name, 'Xla');

	getCoin = CoinManager.getCoins('veil');

	t.is(getCoin.constructor.name, 'Veil');

	getCoin = CoinManager.getCoins('rtm');

	t.is(getCoin.constructor.name, 'Rtm');
});

test(category + ' : listCoinsByAlgo', t => {
	const coins = CoinManager.listCoinsByAlgo('panthera');
	t.true(coins.indexOf('xla') >= 0);
});

test(category + ' : getBestCoins', t => {
	CoinManager.setCoinEarn({
		xla : 1, 
		xmr : 2,
		xhv : 3,
		msr : 4
	});
	
	let coin = CoinManager.getBestCoin([]);
	t.is(coin.constructor.name, 'Msr');


	coin = CoinManager.getBestCoin(['panthera']);

	t.is(coin.constructor.name, 'Xla');

	coin = CoinManager.getBestCoin(['panthera', 'randomx']);

	t.is(coin.constructor.name, 'Xmr');
});
