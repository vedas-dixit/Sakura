'use client'

import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useState } from 'react'

interface FriendRequestSidebarOptionsProps {
    sessionId: string,
    initialunseenrequestcount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
    sessionId,
    initialunseenrequestcount
}) => {
    const [unseenRequestCount,setunseenRequestCount] = useState<number>(
        initialunseenrequestcount
    )
  return <Link href="/dashboard/requests">
    <div>
        <User></User>
    </div>
    <p>Friend Requests</p>
    {unseenRequestCount > 0 ? (
        <div style={{width: '20px', height: '20px', backgroundColor:'white'}}>
        {unseenRequestCount}
        </div>
    ) : null}
  </Link>
}

export default FriendRequestSidebarOptions