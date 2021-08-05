import {v1 as uuidv1, v4 as uuidv4} from "uuid";

type uuidFunc = () => string
let uuid:uuidFunc & {v1: uuidFunc, v4: uuidFunc} = Object.assign(function(){
    return uuidv4()
}, {v1: () => uuidv1(), v4: () => uuidv4()})

export default uuid