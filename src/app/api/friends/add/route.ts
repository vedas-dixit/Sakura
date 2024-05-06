import { fetchRedis } from "@/helpers/redis"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"
import {z} from "zod"
export async function POST(req: Request) {
     try {
        const body = await req.json()
        const {email: emailToAdd} = addFriendValidator.parse(body.email)
        
        const idToAdd = await fetchRedis('get',`user:email:${emailToAdd}`) as string
        


        if(!idToAdd){
            return new Response('This Person does not exist')
        }
        const session = await getServerSession(authOptions)
        if(!session){
            return new Response('Unauthorized',{status: 401})
        }
        if(idToAdd === session.user.id){
            return new Response('You cannot Add yourself',{status: 400})
        }
        //! Check for User already Added
        const isAlreadyadded = (await fetchRedis(
            'sismember',`user:${idToAdd}:incomming_friend_requests`, 
            session.user.id)) as 0 | 1
        
        if(isAlreadyadded){
            return new Response('Already added this user',{status:400})
        }

        const isAlreadyFriend = (await fetchRedis(
            'sismember',`user:${session.user.id}:friends`, 
            idToAdd
        )) as 0 | 1
        
        if(isAlreadyFriend){
            return new Response('Already friends',{status:400})
        }

        db.sadd(`user:${idToAdd}:incomming_friend_requests`, session.user.id)
        return new Response('OK')
       
     } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid request payload', {status: 422})
        }
        return new Response('Invalid Request', {status: 400})
     }
}