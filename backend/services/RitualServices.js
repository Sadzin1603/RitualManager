import {create as createRitualModel,getAll} from '../models/RitualModel.js'

export const create = async (file,ritual) => {
    if (!ritual) {
        throw new Error("Missing fields");
    }
    //verificação se ja existe algum ritual com aquele nome?
    // const {data,error} = await findByEmail(email);
    // if (data) {
    //      throw new Error("Email already exists");
    // }

    return await createRitualModel(file,ritual);
};
export const pegar = async (params) => {
    
    const {data,error} = await getAll(params);

    return await data;
};