import {findById,changeById,deleteById} from '../models/UserModel.js'
import {getAll} from '../models/RitualModel.js'
import {getFavoritesByUserId} from '../models/FavoriteModel.js'

export const getById = async ( id ) => {
    if (!id) {
        throw new Error("Missing fields");
    }

    return await findById( id );
};

export const changeOne = async (id,user) => {
    if(!id || !user){
        throw new Error("Missing fields")
    }

    return await changeById(id,user)
}

export const deleteOne = async (id) => {
    if(!id){
        throw new Error("Missing fields");
    }

    return await deleteById(id)
}

export const getRituais = async (id) => {
    if(!id){
        throw new Error("Missing fields");
    }
    const {data,error} = await getAll({creator:id})
    return await data;
}

export const getRituaisFavorites = async (id) => {
    if(!id){
        throw new Error("Missing fields");
    }

    return await getFavoritesByUserId(id)
}