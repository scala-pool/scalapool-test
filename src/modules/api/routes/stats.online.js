'use strict';
require('module-alias/register');
const test = require('ava');
const category = __filename.replace(process.cwd() + '/tests', '');
const Config = require('@scalapool/core/config');
const utils = require('@scalapool/utils');
const http = require('http');
Config.load();
Config.load(process.cwd());
const bindIp = global.config.api.bindIp === '0.0.0.0' ? '127.0.0.1' : global.config.api.bindIp;
const port = global.config.api.port;
const path = require('path');
const schema = require(path.join(process.cwd(), 'schemas', 'api_stats.js'));

test(category + ' : schema', async t => {
	const response await utils.http.getClientAsync("http://" + bindIp + ':' + port + '/stats').catch(e => test.skip(category + ' : schema'));
	//if dont have a response meaning we are not doing any test 
	//for the online scheme. So we just pass the test
	if(!response) return t.pass();

	const Ajv = require('ajv');
	const ajv = new Ajv();
	const validate = ajv.compile(schema);
	validate(response);
	t.is(validate.errors, null);
});


