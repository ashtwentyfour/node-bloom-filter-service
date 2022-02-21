const mmh3 = require('murmurhash3');

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

  insert(item) { // add item to filter
    for (let i = 0; i < this.hash_count; i++) {
      const seed = Number(BigInt.asUintN(32, BigInt(i + 1)));
      const hashValue = mmh3.murmur32Sync(item, seed) % this.arr_size;
      this.bit_array[hashValue] = true;
    }
    return;
  }

  lookup(item) { // check to see whether item 'probably' exists
    for (let i = 0; i < this.hash_count; i++) {
      const seed = Number(BigInt.asUintN(32, BigInt(i + 1)));
      const hashValue = mmh3.murmur32Sync(item, seed) % this.arr_size;
      if (!(this.bit_array[hashValue])) return false;
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
}

module.exports.BloomFilter = BloomFilter;
