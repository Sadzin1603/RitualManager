import 'dotenv/config'; 
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY)

export const create = async (ritualId,userId,comment) =>{
    const {data,error} = await supabase
                        .from("Comentarios")
                        .insert([{"ritual_id":ritualId,"user_id":userId,"comentario":comment}])
    if(error){
        throw new Error(error.message)
    }
    return data
}

export const getCommentsByRitualId = async (ritualId) => {
    const {data,error} = await supabase
                        .from("Comentarios")
                        .select("*")
                        .eq("ritual_id",ritualId)
    
    if(error){
        throw new Error(error.message)
    }
    return data;
}