import { forwardRef } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'

const Select = forwardRef(({
    label,
    error,
    options = [],
    placeholder = 'Sélectionner...',
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
                <select
                    ref={ref}
                    className={`
            w-full px-4 py-3 border rounded-xl transition-all appearance-none
            ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-[#4DB896] focus:ring-[#4DB896]'
                        }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
                    {...props}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
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

Select.displayName = 'Select'

export default Select
