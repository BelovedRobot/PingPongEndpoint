import NodeCache from 'node-cache';
import _ from 'lodash';

var _cache = new NodeCache();


export function storeObject(object : any) : boolean {
    // Each object must include an id, which is the key
    if (!_.has(object, 'id')) {
        return false;
    }

    let success = _cache.set(object.id, object);

    return success;
}

export function getObject(id : string) : any {
    let value = _cache.get(id);
    return value;
}

export function deleteObject(id : string) : boolean {
    let objecsDeleted = _cache.del(id);
    return (objecsDeleted == 1);
}

export function getAllObjects() : any[] {
    var result : any[] = [];

    for (var key of _cache.keys()) {
        result.push(_cache.get(key));
    }
    
    return result;
}

export default _cache;