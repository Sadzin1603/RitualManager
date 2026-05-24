import 'dotenv/config'; 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export const create = async (ritual_id,user_id) => {
    const {data,error} = await supabase
                    .from('Favoritos')
                    .insert({ritual_id,user_id})
    if(error){
        throw new Error(error.message)
    }
    return {"message":"Ritual favoritado"}
}

export const getFavoritesByUserId = async (user_id) => {
    const {data,error} = await supabase
                    .from('Favoritos')
                    .select('ritual_id,Rituais(*)')
                    .eq('user_id',user_id)
    if(error){
        throw new Error(error.message)
    }
    return data.map(favorite => favorite.Rituais)
}