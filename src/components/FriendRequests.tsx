'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { request } from 'http'
import { useRouter } from 'next/navigation'

// import { Check, UserPlus, X } from 'lucide-react'

import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: IncommingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
    incomingFriendRequests, sessionId }

) => {
    const router = useRouter()
    const [FriendRequests, setFriendRequests] = useState<IncommingFriendRequest[]>(
        incomingFriendRequests
    )
    
    //! SOCKET web req. update
    useEffect(()=>{
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incomming_friend_requests`))
        console.log("sub to1", `user:${sessionId}:incomming_friend_requests`)

        const friendRequestHandler = ({senderId,senderEmail}: incomingFriendRequests) =>{
            setFriendRequests((prev) =>[...prev,{senderId,senderEmail}])
        }

        pusherClient.bind('incomming_friend_requests',friendRequestHandler)
        return ()=>{
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incomming_friend_requests`)
            )
            pusherClient.unbind(
                'incomming_friend_requests',friendRequestHandler
            )
        }
    },[])//! CHECKKKKKKKKKK
    


    const acceptFriend = async(senderId: string)=>{
        await axios.post('/api/friends/accept', {id: senderId})
        setFriendRequests((prev) => 
            prev.filter((request) => request.senderId !== senderId))
    router.refresh()
    }

    const denyFriend = async(senderId: string)=>{
        await axios.post('/api/friends/deny', {id: senderId})
        setFriendRequests((prev) => 
            prev.filter((request) => 
                request.senderId !== senderId
    ))
    router.refresh()
    }


    return <>
        {FriendRequests.length === 0 ? (
            <p>Nothing to show here...</p>
        ) : (
            FriendRequests.map((reqs) =>
                <>
                <h1>{reqs.senderEmail}</h1>
                <button onClick={() => acceptFriend(reqs.senderId)} style={{width:"20px", height:"20px", backgroundColor:"wheat"}}>+</button>
                <button  onClick={() => denyFriend(reqs.senderId)} style={{width:"20px", height:"20px", backgroundColor:"wheat"}}>-</button>
                </>
            )
        )}
    </>
}

export default FriendRequests