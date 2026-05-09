import 'dotenv/config'; 
import {findById,findAll} from '../models/UserModel.js'
import {changeOne,getAll} from '../models/RitualModel.js'

export const getRituals = async () => {

    const {data,error} = await getAll({status:"pendente"});
    
    
    return await data;
};

export const updateRitual = async (id,status) => {
    const {data,error} = await changeOne(id,status);

    return await data;
};

export const getUsers = async () => {

    const {data,error} = await findAll();
    
    
    return await data;
};