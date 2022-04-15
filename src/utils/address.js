'use strict';
require('module-alias/register');
const category = __filename.replace(process.cwd() + '/tests', '');
const test = require('ava');
const adddress = require('@scalapool/utils/adddress');

test.skip(category + ' hasPaymentId', t => {

});
