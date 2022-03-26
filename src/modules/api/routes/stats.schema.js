'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');

const Ajv = require('ajv');
// options can be passed, e.g. {allErrors: true}
const Stats = require('@scalapool/modules/api/routes/stats');
const stats = new Stats();
const CoinManager = require('@scalapool/core/coin_manager');

const schema = {
	type: 'object',
	required: ['config', 'network', 'pool', 'charts', 'market', 'coin'],
	properties: {
		miner: { type: 'object' },
		network: {
			type: 'object',
			properties: {
				height: { type: 'number' },
				difficulty: { type: 'number' }
			}
		},
		pool: { type: 'object' },
		charts: { type: 'object' },
		market: {
			type: 'object',
			properties: {
				tickers: {
					type: 'array'
				},
				data: {
					type: 'object'
				}
			}
		},
		coin: {
			type: 'object',
			required: [
			'name', 'units',
			'decimalPlaces', 'difficultyTarget',
			'symbol', 'depth'
			],
			properties : {
				name: { type: 'string' },
				units: { type: 'number' },
				decimalPlaces: { type: 'number' },
				difficultyTarget: { type: 'number' },
				symbol: { type: 'string' },
				depth: { type: 'number' }
			}
		},
		config: {
			type: 'object',
			required: [
			'supportedCoins',
			'supportedPayments', 'ports', 'hashrateWindow',
			'donations', 'devFee', 'networkFee', 'transferFee',
			'dynamicTransferFee', 'paymentsInterval', 'unlockBlockReward'
			],
			additionalProperties: false,
			properties: {
				supportedCoins: { type: 'array' },
				supportedPayments: { type: 'array' },
				ports: {
					type: 'array',
					items: {
						type: 'object',
						required: ['description', 'port', 'difficulty', 'donation', 'poolType'],
						properties: {
							description: { type: 'string' },
							port: { type: 'number' },
							donation: { type: 'number' },
							poolType: { type: 'string' },
							difficulty: {
								type: 'object'
							}
						}
					}
				},
				hashrateWindow: { type: 'number' },
				donations: { type: 'number' },
				devFee: { type: 'number' },
				networkFee: { type: 'number' },
				transferFee: { type: 'number' },
				dynamicTransferFee: { type: 'boolean' },
				paymentsInterval: { type: 'number' },
				minPaymentThreshold: { type: 'number' },
				maxPaymentThreshold: { type: 'number' },
				denominationUnit: { type: 'number' },
				blocksChartDays: { type: 'number' },
				unlockBlockReward: { type: 'number' }
			}
		}
	}
};
test(category + ' : schema', t => {
	const response = {
		coin: {
			name: 'Scala',
			units: 100,
			decimalPlaces: 2,
			difficultyTarget: 120,
			symbol: 'XLA',
			depth: 60,
			minPaymentThreshold: 5000,
			maxPaymentThreshold: 1000000,
			denominationUnit: 100
		},
		lastblock: {
			difficulty: 1380594820,
			height: 433032,
			timestamp: 1648268621,
			hash: "d03c4fe23169485b04436db311d53ef5af5c1de615b9c0fda86b3b828259616f"
		},
		network: {
			difficulty: 1403750086,
			height: 433033
		},
		market : {
			tickers : ['BTC','LTC','USD', 'EURO'],
			data : {
				BTC: {
					"price": 1.9585998549318396e-9,
					"volume_24h": 0.028321784842417076,
					"volume_change_24h": -45.5867,
					"percent_change_1h": -1.53964561,
					"percent_change_24h": 1.93472317,
					"percent_change_7d": -12.89027693,
					"percent_change_30d": -7.79001617,
					"percent_change_60d": -37.30831579,
					"percent_change_90d": -61.6030264,
					"market_cap": 19.98202541959194,
					"market_cap_dominance": 0,
					"fully_diluted_market_cap": 27.424704882708994,
					"last_updated": "2022-02-26T19:14:00.000Z"
				},
				LTC: {
					"price": 7.098742085444787e-7,
					"volume_24h": 10.264937245324925,
					"volume_change_24h": -45.5867,
					"percent_change_1h": -1.42091226,
					"percent_change_24h": 1.45703303,
					"percent_change_7d": -8.98745886,
					"percent_change_30d": -0.81472949,
					"percent_change_60d": -30.30902714,
					"percent_change_90d": -51.67213185,
					"market_cap": 7242.277918141742,
					"market_cap_dominance": 0,
					"fully_diluted_market_cap": 9939.799915821217,
					"last_updated": "2022-02-26T19:14:00.000Z"
				},
				USD: {
					"price": 0.0000767912705610825,
					"volume_24h": 1110.41866828,
					"volume_change_24h": -45.5867,
					"percent_change_1h": -1.45762917,
					"percent_change_24h": 3.33229576,
					"percent_change_7d": -14.66766591,
					"percent_change_30d": -0.31828747,
					"percent_change_60d": -48.31013193,
					"percent_change_90d": -72.42215971,
					"market_cap": 783439.8213042407,
					"market_cap_dominance": 0,
					"fully_diluted_market_cap": 1075246.65,
					"last_updated": "2022-02-26T19:13:00.000Z"
				},
				EUR: {
					"price": 0.0000681256828433466,
					"volume_24h": 985.1123632392753,
					"volume_change_24h": -45.5867,
					"percent_change_1h": -1.62153949,
					"percent_change_24h": 2.59624465,
					"percent_change_7d": -16.01072993,
					"percent_change_30d": -0.31828747,
					"percent_change_60d": -48.31013193,
					"percent_change_90d": -72.42215971,
					"market_cap": 695031.7712293424,
					"market_cap_dominance": 0,
					"fully_diluted_market_cap": 953909.3665341,
					"last_updated": "2022-02-26T19:14:13.000Z"
				}
			},
			last_updated: 1645902888781

		},
		config: {
			supportedCoin : ['xla', 'veil', 'rtm','btc'],
			supportedPayments: ['props','solo'],
			ports: [
			{
				port: 3333,
				difficulty: {
					'xla:panthera': 10000,
					'veil:x16rt' : 10000,
					'rtm:ghostrider' : 100000
				},
				description: 'Props Low End',
				poolType: 'props',
				donation: 0
			},
			{
				port: 8888,
				difficulty: {
					'xla:panthera': 250000,
					'veil:x16rt' : 250000,
					'rtm:ghostrider' : 250000
				},
				description: 'Solo Miner',
				poolType: 'solo',
				donation: 0
			}
			],
			hashrateWindow: 600,
			donations: 0,
			devFee: 0,
			networkFee: 0,
			version: '2.0.0',
			paymentsInterval: 300,
			transferFee: 0,
			dynamicTransferFee: true,
			unlockBlockReward: 0
		},
		charts: {
			//timestamp:difficulty
			difficulty: ["1648183918:3.3997924551769125e+27:31"],
			hashrate: {
				overall : ["1648183678:884664:31"],
				panthera : ["1648183678:884664:31"]
			},
			//timestamp:workers:
			workers: {
				overall : ["1648183918:686:31"],
				panthera : ["1648183918:686:31"]
			},
			//timestamp:miners:
			miners: ["1648183678:377:31"],
			price: {
				LTC : ["1646922816:0.00039178864605647146:7"],
				BTC : ["1646922816:0.00039178864605647146:7"],
				USD: ["1646922816:0.00039178864605647146:7"],
				EUR : ["1646922816:0.00039178864605647146:7"]
			},
			blocks: ["432999:276a132ddda1eb05667765cbf2a2152eb00096478cc86ca638ffa9ccfe1996a3:1648265335:1279833428:740065064:0:375000:Svm46Pk...yJTE5jg:props:0:false"],
			//hash:amount:fee:mixin:recipients:timestamp
			payments: ["44b5cf199b045925e2875870f5e75744e4bea5cd5590e0a3e94f4c4f3fd224ac:38679:120:9:4:1648268769"],
			//Blocks per day Date:count
			blocksCount: ["2022-02-24:86"]
		},
		pool: {
			pathera : {
				//port:miners:workers
				ports : [ "3333:375:2222", "7777:375:2222" ],
				workers: 222495,
				miners: 222495,
				height: 433033,
				difficulty: 1403750086,
				lastblock : {
					timestamp: 1648260674206,
					lastMinerReward: 375000,
					height: 433032,
					hash: "d03c4fe23169485b04436db311d53ef5af5c1de615b9c0fda86b3b828259616f"
				},
				//  poolType:shares:totalDiff:totalBlocks:lastBlockFound
				totalShares : [ 
				"solo:2634316614637:34359165594475:2708:1648260674206",
				"prop:2634316614637:34359165594475:2708:1648260674206",
				"overall:34917568444105:34359165594475:135920:1648260674206",
				],
				//  poolType:shares:lastShare
				roundShares: [
				"solo:2634316614637:1648260674206",
				"prop:2634316614637:1648260674206",
				"overall:2634316614637:1648260674206",
				]
			},
			stats : {
				totalPayments: 51085,
				totalDonations: 0,
				totalMinersPaid: 6041,
				miners: 394,
				workers: 703,
				hashrate: 976310,
			}
		}
	};

	const ajv = new Ajv();
	const validate = ajv.compile(schema);
	validate(response);
	t.is(validate.errors, null);
});
