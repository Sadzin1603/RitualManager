import {create as createRitualModel,getAll} from '../models/RitualModel.js'

export const create = async (file,{ name,element,circle,exec,range,area,target,effect,resistence,dices,description,discent_description,truly_description,discent_dices,truly_dices,creator }) => {
    if (!name) {
        throw new Error("Missing fields");
    }
    //verificação se ja existe algum ritual com aquele nome?
    // const {data,error} = await findByEmail(email);
    // if (data) {
    //      throw new Error("Email already exists");
    // }

    return await createRitualModel(file,{ name,element,circle,exec,range,area,target,effect,resistence,dices,description,discent_description,truly_description,discent_dices,truly_dices,creator });
};
export const pegar = async (params) => {
    
    const {data,error} = await getAll(params);

    return await data;
};