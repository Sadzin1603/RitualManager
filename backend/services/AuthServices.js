import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'; 
import {findByEmail,findById,create} from '../models/UserModel.js'

export const registerUser = async({name,email,password}) =>{
    if (!name || !email || !password) {
        throw new Error("Missing fields");
    }

    const {data,error} = await findByEmail(email);
    if (data.length) {
            throw new Error("Email already exists");
    }
    
    const passHash = await bcrypt.hash(password, 12);


    return await create({ name, email,password:passHash });
}

export const verify = async ({ email,password }) => {
    if (!email || !password) {
        throw new Error("Missing fields");
    }

    const {data,error} = await findByEmail(email);
    
    if (!data) {
        throw new Error("Email not exists");
    }
    const user = data[0]

    const valid_password = bcrypt.compare(password, user.password);

    if(!valid_password){
        throw new Error("password not match");
    }

    const token = jwt.sign(
        {
            id: user.id,
            admin:user.admin
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: "7d" 
        }
    );
    
    return await token;
};

export const me = async ({ id }) => {
    
    if(!id){
        throw new Error("Missing fields");
    }

    const {data,error} = await findById(id);
    
    if (!data) {
        throw new Error("Email not exists");
    }
    const user = data[0]

    return await user;
}
