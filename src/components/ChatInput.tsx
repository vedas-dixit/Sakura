"use client"
import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
interface ChatInputProps { 
    chatPartner: User
    chatId: string
}



const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    const tectareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [isLoading,setisLoading] = useState<boolean>(false)
    const [input,setInput] = useState<string>('')
    const sendMessage = async() => {
        console.log("sent")
        setisLoading(true)
        try {
            await axios.post('/api/message/send',{text:input,chatId})

            setInput('')
            tectareaRef.current?.focus()
        } catch (error) {
            toast.error('Something went Wrong')
            console.log("Error sending Message",error)
        } finally{
            setisLoading(false)
        }
        

    }
    return <>
        <div>
            <TextareaAutosize ref={tectareaRef} onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                }
            }} 
            rows={1}
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            placeholder={`Message ${chatPartner.name}`}
            className='chats'
            />
            <Button isloading={isLoading} onClick={sendMessage}>
                Post
            </Button>
        </div>
    </>
}

export default ChatInput