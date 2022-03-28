'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');

global.log = function (a, b, c) {
	console.log(a, b, c);
};
const CoinManager = require('@scalapool/core/coin_manager');
const CoinMarketCap = require('@scalapool/modules/market/cmc');
class CoinMarketCapTest extends CoinMarketCap {
	async getLastUpdated (symbol) {
		return await Promise.resolve(0);
	}

	dataStored = {};
	async store (symbol, dataStored) {
		this.dataStored[symbol] = dataStored;
		return Promise.resolve();
	}
}
CoinManager.loadConfig({
	xla: {}
});
test(category + ' data 1', async t => {
	const market = new CoinMarketCapTest({
		symbols: ['USD'],
		isSandBox: true
	});
	await market.fetch();
	t.true('xla' in market.dataStored);
	t.true('USD' in market.dataStored.xla);
	t.true('price' in market.dataStored.xla.USD);
	t.true('volume_24h' in market.dataStored.xla.USD);
	t.true('volume_change_24h' in market.dataStored.xla.USD);
	t.true('percent_change_1h' in market.dataStored.xla.USD);
	t.true('percent_change_24h' in market.dataStored.xla.USD);
	t.true('percent_change_7d' in market.dataStored.xla.USD);
	t.true('percent_change_30d' in market.dataStored.xla.USD);
	t.true('market_cap' in market.dataStored.xla.USD);
	t.true('market_cap_dominance' in market.dataStored.xla.USD);
	t.true('fully_diluted_market_cap' in market.dataStored.xla.USD);
	t.true('last_updated' in market.dataStored.xla.USD);
});

test(category + ' data 2', async t => {
	const market = new CoinMarketCapTest({
		symbols: ['USD', 'LTC', 'BTC', 'EUR', 'XMR'],
	});
	await market.fetch();
	t.true('xla' in market.dataStored);
	t.true('USD' in market.dataStored.xla);
	t.true('LTC' in market.dataStored.xla);
	t.true('BTC' in market.dataStored.xla);
	t.true('EUR' in market.dataStored.xla);
	t.true('XMR' in market.dataStored.xla);
});
