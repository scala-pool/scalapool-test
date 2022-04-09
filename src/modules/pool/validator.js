'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');
global.log = function (a, b, c) {

};
const Validator = require('@scalapool/modules/pool/validator');
const CoinManager = require('@scalapool/core/coin_manager');

test(category + ' : id', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera']
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.true('id' in info);
	t.false(!info.id);
});

test(category + ' : w/ cpuBrand', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera'],
		cpu_brand: 'SomeBrands'
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.true('cpuBrand' in info);
	t.is(info.cpuBrand, 'SomeBrands');
});

test(category + ' : w/o cpuBrand', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera']
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.true('cpuBrand' in info);
	t.is(info.cpuBrand, 'unknown');
});

test(category + ' : algo', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera']
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.is(info.currentAlgo, 'panthera');
	t.true(info.allowedAlgos.indexOf('panthera') >= 0);
});

test(category + ' : coin', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera']
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({params : sampleParams}).catch(e => console.log(e));
	t.is(info.currentCoin, 'xla');
	t.true(info.allowedCoins.indexOf('xla') >= 0);
});

test(category + ' : no workername', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera']
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.is(info.workerName, 'x');
});

test(category + ' : workername', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera'],
		pass: 'SomeWorkerName'
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.is(info.workerName, 'SomeWorkerName');
});

test(category + ' : workername pass from rigid', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera'],
		pass: 'SomeWorkerName',
		rigid: 'WorkerNameFromRigId'
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);

	t.is(info.workerName, 'WorkerNameFromRigId');
});

test(category + ' : workername dirty', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['panthera'],
		pass: '*=W:gP*#)D'
	};
	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);
	t.false(info.workerName === '*=W:gP*#)D');
});

test(category + ' : address w/ payment id', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF.4d9cb6c83330d8b1',
		algo: ['panthera']
	};

	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);
	t.is(info.currentAlgo, 'panthera');
	t.true(info.allowedAlgos.indexOf('panthera') >= 0);
	t.is(info.currentCoin, 'xla');
	t.true(info.allowedCoins.indexOf('xla') >= 0);
});
test(category + ' : address w/ donations', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF%15%',
		algo: ['panthera']
	};

	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);
	t.is(info.donations, 15);
});
test(category + ' : address w/ static diff', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF+1000',
		algo: ['panthera']
	};

	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);
	t.is(info.fixedDiffs.Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF, 1000);
});

test(category + ' : address w/ static diff & donations', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF+5000%0.2%',
		algo: ['panthera']
	};

	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);
	t.is(info.fixedDiffs.Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF, 5000);
	t.is(info.donations, 0.2);
});
test(category + ' : address w/ payment id & static diff & donations', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF.4d9cb6c83330d8b1+3500%0.8%',
		algo: ['panthera']
	};

	CoinManager.loadConfig({
		xla: {}
	});
	const info = await Validator.handleLogin({ params : sampleParams }, true);
	t.is(info.currentAlgo, 'panthera');
	t.true(info.allowedAlgos.indexOf('panthera') >= 0);
	t.is(info.currentCoin, 'xla');
	t.true(info.allowedCoins.indexOf('xla') >= 0);
	t.is(info.fixedDiffs['Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF.4d9cb6c83330d8b1'], 3500);
	t.is(info.donations, 0.8);
});

test(category + ' : wrong address', async t => {
	const sampleParams = {
		login: 'Se4FFaA4n89epNPA7bXgzaFBup9a4wDABbYsEQXDWGiFNdbnwgmBoLgjXSX7ZHSnpCcie1uMmEZ7K2xaVbdsyxkc32AEBDr1p',
		algo: ['panthera']
	};
	CoinManager.loadConfig({
		xla: {}
	});

	const info = () => Validator.handleLogin({ params : sampleParams }, true);
	const error = await t.throwsAsync(info);

	t.is(error.message, 'Error: No coins avaliable for address(es)');
});

test(category + ' : wrong algo', async t => {
	const sampleParams = {
		login: 'Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF',
		algo: ['defyx']
	};
	CoinManager.loadConfig({
		xla: {}
	});

	const info = () => Validator.handleLogin({ params : sampleParams }, true);
	const error = await t.throwsAsync(info);
	t.is(error.message, 'Error: No coin with algo for address(es)');
});
