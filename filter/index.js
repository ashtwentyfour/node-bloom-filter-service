const mmh3 = require('murmurhash3');

function calcSize(items, f_prob) { // size of the bit array
    return Math.round(-((items * Math.log(f_prob))/(Math.log(2)**2)));
}

function calcHashCount(arr_size, items) { // # of times an item will be hashed
    return Math.round((arr_size/items) * Math.log(2));
}

class BloomFilter {
    constructor(items, f_prob) {
        this.items = items;
        this.f_prob = f_prob;
        this.arr_size = calcSize(items, f_prob);
        this.hash_count = calcHashCount(this.arr_size, items);
        this.bit_array = new Array(this.arr_size).fill(false);
    }

    insert(item) { // add item to filter
        for (let i = 0; i < this.hash_count; i++) {
            var seed = Number(BigInt.asUintN(32, BigInt(i + 1)));
            var hash_value = mmh3.murmur32Sync(item, seed) % this.arr_size;
            this.bit_array[hash_value] = true; 
        }
        return
    }

    lookup(item) { // check to see whether item 'probably' exists
        for (let i = 0; i < this.hash_count; i++) {
            var seed = Number(BigInt.asUintN(32, BigInt(i + 1)));
            var hash_value = mmh3.murmur32Sync(item, seed) % this.arr_size;
            if (!(this.bit_array[hash_value])) return false;
        }
        return true;
    }
}

module.exports.BloomFilter = BloomFilter;