"use client"

import React, { FC, useState } from 'react';
import styles from './styles.module.scss';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';


interface LoginPageProps { }

const LoginPage: FC<LoginPageProps> = ({ }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function loginWithGoogle() {
        setIsLoading(true);
        try {
            await signIn('google')
        } catch (error) {
            toast.error('Something Went Wrong')
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <h2>Login</h2>
                <h3>Sign in to your account</h3>
                <div className={styles.loginForm}>
                    <Button
                        onClick={loginWithGoogle}
                        isloading={isLoading}>

                        {isLoading ? null : <h1>...</h1>}



                        Google
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;