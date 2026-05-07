import bcrypt from "bcrypt";
import {create as createUserModel,findByEmail} from '../models/UserModel.js'

export const create = async ({ name, email,password }) => {
    if (!name || !email || !password) {
        throw new Error("Missing fields");
    }

    const {data,error} = await findByEmail(email);
    if (data) {
         throw new Error("Email already exists");
    }
    
    const passHash = await bcrypt.hash(password, 12);


    return await createUserModel({ name, email,password:passHash });
};