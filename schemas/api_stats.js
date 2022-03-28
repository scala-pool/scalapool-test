'use strict';

module.exports = {
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
			'supportedCoins', 'version',
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
				version: { type : 'string' },
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