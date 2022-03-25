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
			name: { type: 'string' },
			units: { type: 'number' },
			decimalPlaces: { type: 'number' },
			difficultyTarget: { type: 'number' },
			symbol: { type: 'string' },
			depth: { type: 'number' }
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
		config: {
			supportedPayments: [
				'props',
				'solo'
			],
			ports: [
				{
					port: 3333,
					difficulty: {
						'xla:panthera': 10000
					},
					description: 'Props Low End',
					poolType: 'props',
					donation: 0
				},
				{
					port: 8888,
					difficulty: {
						'xla:panthera': 250000
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
		}
	};

	const ajv = new Ajv();
	const validate = ajv.compile(schema);
	const valid = validate(response);
	if (!valid) console.log(validate.errors);
	t.true(valid);
});
