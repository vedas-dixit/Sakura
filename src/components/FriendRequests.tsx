'use client'
import axios from 'axios'
import { request } from 'http'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

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