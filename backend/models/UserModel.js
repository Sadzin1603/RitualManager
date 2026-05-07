import 'dotenv/config'; 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export const create = async (user) => {
    const {data,error} = await supabase
                    .from('Clients')
                    .insert([user])
    return {data,error}
};

export const findByEmail = async (email) => {

    const {data,error} = await supabase
                    .from('Clients')
                    .select('*')
                    .eq('email',email)
    return {data,error}
};

export const findById = async (id) => {

    const {data,error} = await supabase
                    .from('Clients')
                    .select('*')
                    .eq('id',id)
    return {data,error}
};