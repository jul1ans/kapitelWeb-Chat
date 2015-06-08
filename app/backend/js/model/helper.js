require('babel/polyfill')

let filterByKeys = (obj, ...attr) => {
    let newObj = {}
    for (let key of Object.keys(obj)) {
        for (let a of attr) {
            if(a === key) {
                newObj[key] = obj[key]
            }
        }
    }
    return newObj
}


export default {
    filterByKeys: filterByKeys
}