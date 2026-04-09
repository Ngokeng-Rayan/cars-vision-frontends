import { forwardRef } from 'react'
import Spinner from './Spinner'

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    ...props
}, ref) => {
    const variants = {
        primary: 'bg-[#4DB896] text-white hover:bg-[#3da07d] focus:ring-[#4DB896]',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border-2 border-[#4DB896] text-[#4DB896] hover:bg-[#4DB896] hover:text-white focus:ring-[#4DB896]',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const isDisabled = disabled || loading

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {!loading && Icon && iconPosition === 'left' && <Icon className="h-5 w-5" />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="h-5 w-5" />}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
