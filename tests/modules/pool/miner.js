'use strict';
require('module-alias/register');

global.log = function (a, b, c) {

};
const test = require('ava');
const Miner = require('@scalapool/modules/pool/miner');
const CoinManager = require('@scalapool/core/coin_manager');
