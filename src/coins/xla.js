'use strict';
require('module-alias/register');
const category = __filename.replace(process.cwd() + '/tests', '');
const test = require('ava');
const Xla = require('@scalapool/coins/xla');
global.log = function () {};
const xla = new Xla();

test(category + ' : algo', t => {
	t.true(xla.algo.indexOf('panthera') >= 0);
});

test(category + ' : fullName', t => {
	t.is(xla.fullName, 'Scala');
});
test(category + ' : cmcId', t => {
	t.is(xla.cmcId, 2629);
});
test(category + ' : coinUnits', t => {
	t.is(xla.coinUnits, 100);
});

test(category + ' : difficultyTarget', t => {
	t.is(xla.difficultyTarget, 120);
});
test(category + ' : blockDepth', t => {
	t.is(xla.blockDepth, 60);
});
test(category + ' : main address', async t => {
	const v = await xla.validateAddress('Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF');
	// .catch(e => console.log(e));
	t.is(v, 1);
});

test(category + ' : address with payment id', async t => {
	const v = await xla.validateAddress('Svk1ZQ6mPfjhYR3Nnp3kifZLimjuDcmyMHecLmY6Ek2QbGQi93XzkJFbdFDaQZVdBF2V43q79z2UTirvJcHT3TnC2h988J2hF.4d9cb6c83330d8b1');
	// .catch(e => console.log(e));
	t.is(v, 4);
});

test(category + ' : integrated address', async t => {
	const v = await xla.validateAddress('Siz7JJJvBuDKZKjb3yn2ks5oxoXURrtHU8RdNKhaDVJoS4FVsJNuqrTMsoQKfUtepLHQ4R9cGjUCfPF3sDDSbpbK4eCJ4p3vXE22rMyRTk3wR');
	// .catch(e => console.log(e));
	t.is(v, 2);
});

test(category + ' : sub address', async t => {
	const v = await xla.validateAddress('Ssy2HXpWZ9RhXbb9uNFTeHjaYfexa3suDbGJDSfUWSEpSajSmjQXwLh2xqCAAUQfZrdiRkvpUZvBceT8d6zKc6aV9NaZVYXFsY');
	// .catch(e => console.log(e));
	t.is(v, 3);
});

test(category + ' : wrong main address', async t => {
	const v = () => xla.validateAddress('Se4FFaA4n89epNPA7bXgzaFBup9a4wDABbYsEQXDWGiFNdbnwgmBoLgjXSX7ZHSnpCcie1uMmEZ7K2xaVbdsyxkc32AEBDr1p');
	const error = await t.throwsAsync(v);
	t.is(error.message, 'Error: Invalid address with prefix Se4FFaA4n89epNPA7bXgzaFBup9a4wDABbYsEQXDWGiFNdbnwgmBoLgjXSX7ZHSnpCcie1uMmEZ7K2xaVbdsyxkc32AEBDr1p: (9241)');
});

test(category + ' : wrong integrated address', async t => {
	const v = () => xla.validateAddress('SEiStP7SMy1bvjkWc9dd1t2v1Et5q2DrmaqLqFTQQ9H7JKdZuATcPHUbUL3bRjxzxTDYitHsAPqF8EeCLw3bW8ARe8rYZPbDy3W2FaVNHsjLK');
	const error = await t.throwsAsync(v);
	t.is(error.message, 'Error: Invalid address with prefix SEiStP7SMy1bvjkWc9dd1t2v1Et5q2DrmaqLqFTQQ9H7JKdZuATcPHUbUL3bRjxzxTDYitHsAPqF8EeCLw3bW8ARe8rYZPbDy3W2FaVNHsjLK: (28822)');
});

test(category + ' : integrated address with payment id', async t => {
	const v = () => xla.validateAddress('Siz7JJJvBuDKZKjb3yn2ks5oxoXURrtHU8RdNKhaDVJoS4FVsJNuqrTMsoQKfUtepLHQ4R9cGjUCfPF3sDDSbpbK4eCJ4p3vXE22rMyRTk3wR.4d9cb6c83330d8b1');
	const error = await t.throwsAsync(v);
	t.is(error.message, 'Error: Invalid address Siz7JJJvBuDKZKjb3yn2ks5oxoXURrtHU8RdNKhaDVJoS4FVsJNuqrTMsoQKfUtepLHQ4R9cGjUCfPF3sDDSbpbK4eCJ4p3vXE22rMyRTk3wR.4d9cb6c83330d8b1: (26009)');
});
