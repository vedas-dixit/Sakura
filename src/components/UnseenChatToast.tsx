import { chatHerfConstructor, cn } from '@/lib/utils'
import Image from 'next/image'
import { FC } from 'react'
import toast, { Toast } from 'react-hot-toast'

interface UnseenChatToastProps {
    t:Toast
    sessionId: string
    senderId: string
    senderImg: string
    senderName: string
    senderMessage: string
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({t,sessionId,senderId,senderImg,senderName,senderMessage}) => {
  return <div>
    <a onClick={()=>{ toast.dismiss(t.id)}} href={`/dashboard/chat/${chatHerfConstructor(sessionId,senderId)}`}>
        <div>
            <Image width={70} height={70} alt='profile' src={senderImg}/>
        </div>
        <div className='sender name and message'>
            <p>sent by::</p>
            <p>{senderName}</p>
            <p>{senderMessage}</p>
        </div>
    </a>
    <div className=''>
        <button onClick={()=> toast.dismiss(t.id)}>Dismiss</button>
    </div>
  </div>
}

export default UnseenChatToast