"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const lodash_1 = __importDefault(require("lodash"));
var _cache = new node_cache_1.default();
function storeObject(object) {
    // Each object must include an id, which is the key
    if (!lodash_1.default.has(object, 'id')) {
        return false;
    }
    let success = _cache.set(object.id, object);
    return success;
}
exports.storeObject = storeObject;
function getObject(id) {
    let value = _cache.get(id);
    return value;
}
exports.getObject = getObject;
function deleteObject(id) {
    let objecsDeleted = _cache.del(id);
    return (objecsDeleted == 1);
}
exports.deleteObject = deleteObject;
function getAllObjects() {
    var result = [];
    for (var key of _cache.keys()) {
        result.push(_cache.get(key));
    }
    return result;
}
exports.getAllObjects = getAllObjects;
exports.default = _cache;
//# sourceMappingURL=node_cache.js.map