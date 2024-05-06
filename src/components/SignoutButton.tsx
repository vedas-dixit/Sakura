"use client"
import { ButtonHTMLAttributes, FC, useState } from 'react'
import Button from './ui/Button'
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Loader2, LogOut } from 'lucide-react';
interface SignoutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignoutButton: FC<SignoutButtonProps> = ({...props}) => {
    const [isSigningout,setIsSigningout] = useState<boolean>(false);
  return <Button {...props} variant='ghost' onClick={async()=>{
    setIsSigningout(true)
    try {
        await signOut()
    } catch (error) {
        toast.error('Problem signingout')
    } finally{
        setIsSigningout(false)
    }
  }}>
    {isSigningout ?(
        <Loader2/>
    ):(
        <LogOut/>
    )}
  </Button>
}

export default SignoutButton