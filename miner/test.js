const net = require('net');
const path = require('path');
require('scalapool')({
	coin: 'tst',
	config: {
		coin: {
	        ticker: 'TEST',
	        name: 'Pool Test',
	        symbol: 'TEST',
	        algo: ['test'],
	        coinUnits: 100,
	        coinDifficultyTarget: 120,
	        className: '@scalapool/abstracts/coin',
	        classUtil: '@scalapool/abstracts/coin_util'
	    },
	    datasources: {
	        redis: {
				host: '127.0.0.1',
				port: 6379,
				db: 0,
				keepalive: true,
				username: null,
				password: null,
				disableVersionCheck: true
			}
	    }
	}
});
const redis = global.ds.redis;

const client = new net.Socket({ writeable: true }); // writeable true does not appear to help
const send = obj => {
	client.write(JSON.stringify(obj) + '\n');
};
let onlogin = false;
let intervals = null;

redis.set('test:blockTemplate:test', JSON.stringify({
	height: 1
}), (error, reply) => {
	client.connect(3333, '127.0.0.1', function () {
		console.log('Connected');
		onlogin = true;
		send({
			method: 'login',
			id: '0',
			params: {
				login: 'HelloWorld',
				pass: ''
			}
		});
	});
	let minerId = null;
	let getJob = true;
	client.on('data', function (data) {
		const replies = JSON.parse(data);
		if (replies.error) {
			console.log(replies.error);
			return;
		}
		if (replies.result.status === 'KEEPALIVE' || replies.result.status === 'KEEPALIVED') return;
		if (onlogin) {
			onlogin = false;
			minerId = replies.result.id;
			if (replies.result.status == 'OK') {
				intervals = setInterval(() => {
					send({
						method: 'keepalived',
						id: minerId,
						params: {
							id: minerId

						}
					});
				}, 1000);

				// send({
				// 	method:"submit",
				// 	id: minerId,
				// 	params : {
				// 		id: minerId,

				// 	}
				// });
			}
		} else if (getJob) {
			getJob = false;
			setTimeout(() => {
				send({
					method: 'getJob',
					id: minerId,
					params: {
						id: minerId

					}
				});
			}, 1000);
		} else {
			getJob = true;
			setTimeout(() => {
				send({
					method: 'submit',
					id: minerId,
					params: {
						id: minerId

					}
				});
			}, 2000);
		}
	});

	client.on('close', function () {
		console.log('Connection closed');
		if (intervals) clearInterval(intervals);
		process.exit();
	});

	client.on('error', function (err) {
		if (intervals) clearInterval(intervals);
		console.error('Connection error: ' + err);
		console.error(new Error().stack);
		process.exit();
	});
});
