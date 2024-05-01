import { cva, VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, FC } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'active:scale-95',
    {
        variants: {
            variant: {
                default: 'bg-skate-900 text-white hover:bg-slate-800',
                ghost: 'bg-transparent hover:text-slate-900',
            },

            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-2',
                lg: 'h-11 px-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size:'default'

        },
    }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>{
    isloading?: boolean
}

const Button: FC<ButtonProps> = ({
    className,
    children,
    variant,
    isloading,
    size,
    ...props
}) => {
    return (
    <button className={cn(buttonVariants({variant, size, className}))} disabled = {isloading} {...props}>
        {isloading? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
        {children}
    </button>
    )
}

export default Button 