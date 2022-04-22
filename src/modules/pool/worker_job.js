'use strict';
require('module-alias/register');
const category = __filename.replace(process.cwd() + '/tests/src', '');
const test = require('ava');
const WorkerJob = require('@scalapool/' + category);
const utils = require('@scalapool/utils');


test(category + " running and stopping", async t => {
	class TestWorkerJob extends WorkerJob{
		async mainLoop() {
			while(this.isRunning()) {
				await new Promise((resolve, reject) => {
					setTimeout(resolve, 500);
				});	
			}
		}
	}

	const twj0 = new TestWorkerJob("xla:panthera");
	t.false(twj0.isRunning());
	twj0.start();
	t.true(twj0.isRunning());
	twj0.stop();
	t.false(twj0.isRunning());

	
})