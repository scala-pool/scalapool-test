/* Scala Pool - UI
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const args = require("args-parser")(process.argv);
const numForks = args.threads || 1;
const cluster = require('cluster');

if(!cluster.isWorker) {
  for(let i =0;i < numForks; i++) cluster.fork();
  return;
}

const http = require("http"), path = require("path"), port = args.port || 11812;

const fastify = require('fastify')()
const fastifyStatic = require('fastify-static')
const fastifyCompress = require('fastify-compress');


fastify
  .register(fastifyCompress, {threshold:0})
  .register(fastifyStatic, {
    root: path.join(process.cwd(), 'daemon')
});

fastify.get('/', (request, res) =>  res.sendFile('index.html'));
fastify.get('/getblocktemplate', (request, res) =>  {
  const blockTemplate = {
      "id": "0",
      "jsonrpc": "2.0",
      "result": {
        "blockhashing_blob": null,
        "blocktemplate_blob": null,
        "difficulty": 226807339040,
        "difficulty_top64": 0,
        "expected_reward": 500000,
        "height": 2286447,
        "next_seed_hash": "",
        "prev_hash": "ecdc1aab3033cf1716c52f13f9d8ae0051615a2453643de94643b550d543becd",
        "reserved_offset": 130,
        "seed_hash": "d432f499205150873b2572b5f033c9c6e4b7c6f3394bd2dd93822cd7085e7307",
        "seed_height": 2285568,
        "status": "OK",
        "untrusted": false,
        "wide_difficulty": "0x34cec55820"
      }
  };
});

fastify.setNotFoundHandler((req, res) => res.sendFile('index.html'));

// Run the server!
(async () => {
  try {
    await fastify.listen(port, "0.0.0.0");
  } catch (err) {
      console.log(err)
      process.exit(1)
  }

  console.log(`server listening on ${port}`)
})();