import 'dotenv/config'; 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export const create = async (file,user) => {
    const date = Date.now()
    const { data, error } = await supabase.storage
        .from("fotos_rituais")
        .upload(`public/${date}${file.originalname}`, file.buffer);

    if (error) {
        return res.status(500).json(error);
    }
    const { data: publicUrlData } = supabase
        .storage
        .from("fotos_rituais")
        .getPublicUrl(`public/${date}${file.originalname}`);

    const imageUrl = publicUrlData.publicUrl;
    const {data2,error2} = await supabase
                    .from('Rituais')
                    .insert({...user,img:imageUrl,status:"pendente"})
    
    return {"message":"Ritual criado"}
};

export const getAll = async (params) => {
    const query = supabase
        .from('Rituais')
        .select(`*,creator:Clients (id,name)`)
        .order('id')
    
    if (params) {    
        Object.entries(params).forEach(([key, value]) => {
            query.eq(key, value)
        })
    }
    const { data, error } = await query
                    
                    
    return {data,error}
};

export const changeOne = async (id,status) => {
    const query = supabase
                    .from('Rituais')
                    .update({"status":status})
                    .eq("id",id)
        
    const {data,error} = await query
                    
                    
    return {data,error}
};

export const deleteOne = async (id) => {
    const {data,error} = await supabase
                    .from("Rituais")
                    .delete()
                    .eq('id',id)

    return {"message":"ok"}
}