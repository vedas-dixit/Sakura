import { LucideProps, UserPlus } from "lucide-react";

export const Icons = {
    Logo: (props: LucideProps) => (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.25 2.08301C11.0042 2.13782 10.7651 2.2193 10.537 2.32601C6.553 4.18801 4 9.39501 4 13.856C4 18.096 7.183 21.58 11.25 21.965V2.08301ZM12.75 21.965C16.817 21.58 20 18.097 20 13.857C20 13.451 19.979 13.039 19.937 12.623L12.75 19.811V21.965ZM18.26 7.18001C17.8762 6.46074 17.4277 5.77792 16.92 5.14001L12.75 9.31001V12.69L18.26 7.18001ZM15.908 4.03001C15.1916 3.33221 14.3656 2.75657 13.463 2.32601C13.2349 2.2193 12.9958 2.13782 12.75 2.08301V7.18901L15.908 4.03001ZM18.936 8.62401L12.75 14.811V17.689L19.5 10.939L19.632 10.807C19.4559 10.0627 19.2232 9.33289 18.936 8.62401Z" fill="#FFB7C5" />
        </svg>

    ),
    UserPlus
}

export type Icon = keyof typeof Icons