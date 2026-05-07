import 'dotenv/config'; 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export const create = async (file,user) => {
    const { data, error } = await supabase.storage
        .from("fotos_rituais")
        .upload(`public/${file.originalname}`, file.buffer);

    if (error) {
        return res.status(500).json(error);
    }

    const { data: publicUrlData } = supabase
        .storage
        .from("fotos_rituais")
        .getPublicUrl(`public/${file.originalname}`);

    const imageUrl = publicUrlData.publicUrl;
    const {data2,error2} = await supabase
                    .from('Rituais')
                    .insert({...user,img:imageUrl,status:"pendente"})
                    
    return {data2,error2}
};

export const getAll = async (status) => {
    const query = supabase
                    .from('Rituais')
                    .select('*')
                    .order("id")

    if(status) query.eq("status",status)

    const {data,error} = await query
                    
                    
    return {data,error}
};

export const changeOne = async (id,corpo) => {
    const query = supabase
                    .from('Rituais')
                    .update(corpo)
                    .eq("id",id)
        
    const {data,error} = await query
                    
                    
    return {data,error}
};