"use client";
import { FC, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import styles from './comp_style/ChatInput_style.module.scss';
const { GoogleGenerativeAI } = require('@google/generative-ai');

interface ChatInputProps {
    chatPartner: User;
    chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isLoadingSend, setIsLoadingSend] = useState<boolean>(false);
    const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);
    const [input, setInput] = useState<string>('');
    const [tone, setTone] = useState<string>('happy');

    const Api_Key = 'AIzaSyBbaYidoX8fTHBGbKJDFOMg0KaHFFGnxxc';
    const genAI = new GoogleGenerativeAI(Api_Key);

    const changemsg = async () => {
        if (!input) return;
        setIsLoadingGemini(true);

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Take the message: ${input} and make this a ${tone} tone message.`;

        try {
            const result = await model.generateContent(prompt);
            const text = await result.response.text();

            setInput(text);
        } catch (error) {
            console.error("Error generating content", error);
            toast.error('Error generating content');
        } finally {
            setIsLoadingGemini(false);
        }
    };

    const sendMessage = async () => {
        if (!input) return;
        setIsLoadingSend(true);

        try {
            await axios.post('/api/message/send', { text: input, chatId });
            setInput('');
            textareaRef.current?.focus();
        } catch (error) {
            console.error("Error sending message", error);
            toast.error('Error sending message');
        } finally {
            setIsLoadingSend(false);
        }
    };

    return (
        <div className={styles.input_container}>
            <TextareaAutosize
                ref={textareaRef}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${chatPartner.name}`}
            />
            {input && (
                <div className={styles.selector_container} style={{ display: 'flex' }}>
                    <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        style={{
                            backgroundColor: '#724545',
                            padding: '0.3rem',
                            border: '3px solid #fc9999',
                            borderRadius: '34px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.3s ease',
                            width: '72px',
                        }}
                    >
                        <option value="happy">😄</option>
                        <option value="sad">😔</option>
                        <option value="funny">😆</option>
                    </select>
                </div>
            )}
            <motion.div
                initial={{ y: 0 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
            >
                {input && (
                    <button onClick={changemsg} className={styles.btn22}>
                        {isLoadingGemini ? (
                            <div className={styles.loader}></div>
                        ) : (
                            <span>
                                <img src="/gem1.png" alt="Gemini" />
                            </span>
                        )}
                    </button>
                )}
            </motion.div>
            <button onClick={sendMessage} className={styles.btn24}>
                {isLoadingSend ? (
                    <div className={styles.loader}></div>
                ) : (
                    'Send'
                )}
            </button>
        </div>
    );
};

export default ChatInput;
