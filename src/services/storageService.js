import syncStorage  from "sync-storage";

export const setStorage = (key, data) => {
    if(typeof data === 'object'){
        data = JSON.stringify(data);
    }
    return syncStorage.set(key, data);
}

export const getStorage = (key) => {
    let data = syncStorage.get(key);
    try {
        if(typeof JSON.parse(data) === 'object')
            data = JSON.parse(data);
    } catch (err) {
        data = data;
    }

    return data;
}

export const removeStorage = (key) => {
    return syncStorage.remove(key);
}

export const clearStorage = () => {
    const keys = syncStorage.getAllKeys();
    keys.map(key => syncStorage.remove(key));
    return;
}

