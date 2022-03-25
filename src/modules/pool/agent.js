'use strict';
require('module-alias/register');
const category = __filename.replace(process.cwd() + '/tests', '');
const test = require('ava');
const Agent = require('@scalapool/modules/pool/agent');

test(category + ' 1', t => {
	const sampleAgentString = 'XLArig/5.2.2 (Macintosh; macOS; arm64) libuv/1.41.0 clang/12.0.5';
	const agent = new Agent(sampleAgentString);

	t.is(agent.name, 'XLArig');
	t.is(agent.versionInt, 50202);
});

test(category + ' 2', t => {
	const sampleAgentString = 'XLArig/5.2 (Macintosh; macOS; arm64) libuv/1.41.0 clang/12.0.5';
	const agent = new Agent(sampleAgentString);

	t.is(agent.name, 'XLArig');
	t.is(agent.versionInt, 50200);
});

test(category + ' 3', t => {
	const sampleAgentString = 'XLArig/5.2.3 (Linux x86_64) libuv/1.38.0 gcc/10.2.0';
	const agent = new Agent(sampleAgentString);

	t.is(agent.name, 'XLArig');
	t.is(agent.versionInt, 50203);
});
