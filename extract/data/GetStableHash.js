const XXH = require('xxhashjs');

function GetStableHash(str = "") {
    return XXH.h64(str, 0x0).toString();
}

// console.log(GetStableHash("AvatarRankDesc_100101"));

// 6856326848005983588

module.exports = GetStableHash;