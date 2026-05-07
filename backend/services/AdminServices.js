import 'dotenv/config'; 
import {findById} from '../models/UserModel.js'
import {changeOne} from '../models/RitualModel.js'

export const deleteUser = async ({ id }) => {
    if (!id) {
        throw new Error("Missing fields");
    }

    const {data,error} = await findById(id);
    
    if (!data) {
        throw new Error("Usuario não existe");
    }
    const user = data[0]
    
    return await user;
};

export const updateRitual = async (id,corpo) => {

    const {data,error} = await changeOne(id,corpo);

    return await data;
};