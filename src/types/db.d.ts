interface User{
    name: string
    email: String
    image: string
    id: string
}

interface Chat{
    id: string
    messages: Message[]
}

interface Message{
    id: string
    senderId: string
    reciverId: string
    text: string
    timestamp: number
}

interface FriendRequest{
    id: string
    senderId: string
    reciverId: string
}