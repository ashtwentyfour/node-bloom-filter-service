const mmh3 = require('murmurhash3');
const redisClient = require('./Store.js').redisClient;

function calcSize(items, fprob) { // size of the bit array
  return Math.round(-((items * Math.log(fprob))/(Math.log(2)**2)));
}

function calcHashCount(arrSize, items) { // # of times an item will be hashed
  return Math.round((arrSize/items) * Math.log(2));
}

class BloomFilter {
  constructor(items, fprob) {
    this.items = items;
    this.f_prob = fprob;
    this.arrSize = calcSize(items, fprob);
    this.hash_count = calcHashCount(this.arrSize, items);
    this.bit_array = new Array(this.arrSize).fill(false);
  }

  async insert(item) { // add item to filter
    for (let i = 0; i < this.hash_count; i++) {
      const seed = Number(BigInt.asUintN(32, BigInt(i + 1)));
      const hashValue = mmh3.murmur32Sync(item, seed) % this.arrSize;
      this.bit_array[hashValue] = true;
      try {
        await redisClient.set(hashValue.toString(), 'true');
      } catch (e) {
        console.error(`redisClient SET command failed: ${e.message}`);
      }
    }
    return;
  }

  async lookup(item) { // check to see whether item 'probably' exists
    let cacheValue;
    for (let i = 0; i < this.hash_count; i++) {
      const seed = Number(BigInt.asUintN(32, BigInt(i + 1)));
      const hashValue = mmh3.murmur32Sync(item, seed) % this.arrSize;
      try {
        cacheValue = await redisClient.get(hashValue.toString());
      } catch (e) {
        console.error(`redisClient GET command failed: ${e.message}`);
      }
      if (cacheValue == null) {
        return false;
      } else {
        this.bit_array[hashValue] = true;
      }
    }
    return true;
  }

  size() { // return data structure info
    const size = {
      'size': this.arrSize,
      'hash_count': this.hash_count,
    };
    return size;
  }

  health() { // check Redis connection
    console.log(`redisClient.isOpen: ${redisClient.isOpen}, 
    redisClient.isReady: ${redisClient.isReady}`);
    return redisClient.isOpen && redisClient.isReady;
  }

}

module.exports.BloomFilter = BloomFilter;
