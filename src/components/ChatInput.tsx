"use client"
import { FC, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './comp_style/ChatInput_style.module.scss'

interface ChatInputProps { 
    chatPartner: User
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const sendMessage = async () => {
        if (!input) return
        setIsLoading(true)
        try {
            await axios.post('/api/message/send', { text: input, chatId })

            setInput('')
            textareaRef.current?.focus()
        } catch (error) {
            toast.error('Something went wrong')
            console.log("Error sending message", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.input_container}>
            <TextareaAutosize
                ref={textareaRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                    }
                }}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${chatPartner.name}`}
            />
            <Button isloading={isLoading} onClick={sendMessage}>
                Post
            </Button>
        </div>
    )
}

export default ChatInput
