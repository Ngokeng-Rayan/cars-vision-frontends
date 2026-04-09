import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

const Alert = ({
    type = 'info',
    title,
    message,
    onClose,
    className = ''
}) => {
    const config = {
        success: {
            icon: CheckCircle,
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            iconColor: 'text-green-600'
        },
        error: {
            icon: AlertCircle,
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            iconColor: 'text-red-600'
        },
        warning: {
            icon: AlertTriangle,
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            iconColor: 'text-yellow-600'
        },
        info: {
            icon: Info,
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            iconColor: 'text-blue-600'
        }
    }

    const { icon: Icon, bg, border, text, iconColor } = config[type]

    return (
        <div
            className={`
        flex gap-3 p-4 rounded-xl border
        ${bg} ${border} ${text}
        ${className}
      `}
        >
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
            <div className="flex-1">
                {title && <h4 className="font-semibold mb-1">{title}</h4>}
                {message && <p className="text-sm">{message}</p>}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}

export default Alert
