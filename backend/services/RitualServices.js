import {create as createRitualModel,getAll,changeOne,deleteOne,editOne} from '../models/RitualModel.js'

export const create = async (file,ritual,status) => {
    if (!ritual) {
        throw new Error("Missing fields");
    }
    //verificação se ja existe algum ritual com aquele nome?
    // const {data,error} = await findByEmail(email);
    // if (data) {
    //      throw new Error("Email already exists");
    // }

    return await createRitualModel(file,ritual,status);
};
export const pegar = async (params) => {
    
    const {data,error} = await getAll(params);

    return await data;
};

export const pegarId = async (id,user) => {
    if(id == null){
        throw new Error("Missing fields");
    }
    
    const {data ,error} = await getAll({id})

    if(data[0].status != "aprovado"){//pera
        if(!user){
            return {"message":"NotFound"};
        }
        if(!user.admin || !user.id==data[0].creator.id){
            return {"message":"NotFound"};
        }
    }

    return await data
}

export const changeById = async (file,id,ritual) => {
    if(!id || !ritual){
            throw new Error("Missing fields")
        }
    
        return await editOne(file,id,ritual)
}

export const deleteById = async (id) => {
    if(!id){
        throw new Error("Missing fields")
    }

    return await deleteOne(id)
}