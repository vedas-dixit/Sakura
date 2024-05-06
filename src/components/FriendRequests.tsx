'use client'
import { Check, UserPlus, X } from 'lucide-react'
import { FC, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: IncommingFriendRequest[]
    sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
    incomingFriendRequests ,sessionId}

) => {
    const [FriendRequests, setFriendRequests] = useState<IncommingFriendRequest[]>(
        incomingFriendRequests
    )
    console.log(" adsfdzsfadfs Friendrequest ",FriendRequests)
  return <>
    {FriendRequests.length === 0 ? (
        <p>Nothing to show here...</p>
    ): (
        FriendRequests.map((reqs)=>
            <h1>{reqs.senderEmail}</h1>
        )
    )}
  </>
}

export default FriendRequests