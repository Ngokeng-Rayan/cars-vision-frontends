import { forwardRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'

const Textarea = forwardRef(({
    label,
    error,
    maxLength,
    showCount = false,
    className = '',
    required = false,
    ...props
}, ref) => {
    const [count, setCount] = useState(0)

    const handleChange = (e) => {
        setCount(e.target.value.length)
        if (props.onChange) {
            props.onChange(e)
        }
    }

    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {showCount && maxLength && (
                        <span className="text-xs text-gray-500">
                            {count}/{maxLength}
                        </span>
                    )}
                </div>
            )}
            <textarea
                ref={ref}
                maxLength={maxLength}
                onChange={handleChange}
                className={`
          w-full px-4 py-3 border rounded-xl transition-all resize-none
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
            {error && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
})

Textarea.displayName = 'Textarea'

export default Textarea
