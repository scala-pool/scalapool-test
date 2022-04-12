'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');

const Config = require('@scalapool/core/config');
const path = require('path');
/** Tests with mock data **/
test(category + ' : load (mock coins)', t => {
	const config = Config.load(path.join(process.cwd(), 'tests', 'mocks', 'config1'));

	t.true('coins' in config);
	t.true('coin1' in config.coins);
	t.true('some_mock_key' in config.coins.coin1);
	t.is(config.coins.coin1.some_mock_key, 'some_mock_value');
});

test(category + ' : load (mock coins w/ different config)', t => {
	const config = Config.load(path.join(process.cwd(), 'tests', 'mocks', 'config1'));

	t.true('coins' in config);
	t.true('coin2' in config.coins);
	t.true('mock_key' in config.coins.coin2);
	t.is(config.coins.coin2.mock_key, 'mock_value');

	t.true('datasource' in config);
	t.true('mock_ds' in config.datasource);
	t.true('mock_ds_key' in config.datasource.mock_ds);
	t.is(config.datasource.mock_ds.mock_ds_key, 'mock_ds_value');
});

test(category + ' : load (mock coins w/ override config)', t => {
	const config = Config.load(path.join(process.cwd(), 'tests', 'mocks', 'config1'));

	t.true('coins' in config);
	t.true('coin3' in config.coins);
	t.true('mock_key' in config.coins.coin3);
	t.is(config.coins.coin3.mock_key, 'mock_value');
	t.true('override' in config);
	t.true('mock_override_key' in config.override);
	t.true('mock_display_key' in config.override);
	t.is(config.override.mock_override_key, 'mock_override_value');
	t.is(config.override.mock_display_key, 'mock_display_value');
});

test(category + ' : load (mock config disabled)', t => {
	const config = Config.load(path.join(process.cwd(), 'tests', 'mocks', 'config1'));

	t.false('api' in config);
});

test(category + ' : load (mock config enabled)', t => {
	const config = Config.load(path.join(process.cwd(), 'tests', 'mocks', 'config1'));

	t.true('pool' in config);
	t.true('config1' in config.pool);
	t.is(config.pool.config1, 'value1');
});

/** Tests with default config **/
test(category + ' : load (default coins)', t => {
	const config = Config.load();

	t.true('coins' in config);
	t.true('xla' in config.coins);
	t.true('rpc' in config.coins.xla);
	t.true('daemon' in config.coins.xla.rpc);
	t.true('wallet' in config.coins.xla.rpc);
	t.true('host' in config.coins.xla.rpc.daemon);
	t.true('host' in config.coins.xla.rpc.wallet);
	t.true('port' in config.coins.xla.rpc.daemon);
	t.true('port' in config.coins.xla.rpc.wallet);
	t.is(config.coins.xla.rpc.daemon.host, '127.0.0.1');
	t.is(config.coins.xla.rpc.wallet.host, '127.0.0.1');
	t.is(config.coins.xla.rpc.daemon.port, 11812);
	t.is(config.coins.xla.rpc.wallet.port, 11810);
	t.true('walletAddress' in config.coins.xla);
});

/** Tests with default config **/
test(category + ' : load (default api)', t => {
	const config = Config.load();
	t.true('api' in config);
	t.true('enabled' in config.api);
	t.true(config.api.enabled);
	t.true('hashrateWindow' in config.api);
	t.is(config.api.hashrateWindow, 600);
	t.true('updateInterval' in config.api);
	t.is(config.api.updateInterval, 10);
	t.true('port' in config.api);
	t.is(config.api.port, 8001);
	t.true('bindIp' in config.api);
	t.is(config.api.bindIp, '0.0.0.0');
	t.true('blocks' in config.api);
	t.is(config.api.blocks, 30);
	t.true('payments' in config.api);
	t.is(config.api.payments, 30);
});

test(category + ' : load (default market)', t => {
	const config = Config.load();
	t.true('market' in config);
	t.true('enabled' in config.market);
	t.true(config.market.enabled);
	t.true('apiKey' in config.market);
	t.is(config.market.apiKey, 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c');
	t.true('symbols' in config.market);
	t.true(config.market.symbols.indexOf('BTC') >= 0);
	t.true(config.market.symbols.indexOf('LTC') >= 0);
	t.true(config.market.symbols.indexOf('USD') >= 0);
	t.true(config.market.symbols.indexOf('EUR') >= 0);
});

test(category + ' : check default (api)', t => {
	const config = Config.load();
	try {
		Config.check('api', config.api);
	} catch (e) {
		t.fail(e.message);
		return;
	}
	t.pass();
});

test(category + ' : check default (pool)', t => {
	const config = Config.load();
	try {
		t.true('pool' in config);
		Config.check('pool', config.pool);
		// t.true('threads' in config.pool); // this is optional
		t.true('ports' in config.pool);
		for(let port in config.pool.ports) {
			t.true('port' in port);
			t.true('poolType' in port);
			t.true('desc' in port);
			t.true('difficulty' in port);
			for(let k in Object.keys(port.difficulty)){
				t.is(k,"xla:panthera");
			}
		}
	} catch (e) {
		t.fail(e.message);
		return;
	}
	t.pass();
});
