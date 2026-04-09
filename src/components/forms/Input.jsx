import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    required = false,
    ...props
}, ref) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-3 border rounded-xl transition-all
            ${Icon ? 'pl-10' : ''}
            ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-[#4DB896] focus:ring-[#4DB896]'
                        }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
