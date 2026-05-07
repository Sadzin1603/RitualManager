import 'dotenv/config'; 
import {findById} from '../models/UserModel.js'

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

