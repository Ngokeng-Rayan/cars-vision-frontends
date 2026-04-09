import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map(({ id, message, type }) => (
                    <Toast
                        key={id}
                        message={message}
                        type={type}
                        onClose={() => removeToast(id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

const Toast = ({ message, type, onClose }) => {
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

    const { icon: Icon, bg, border, text, iconColor } = config[type] || config.info

    return (
        <div
            className={`
        flex items-center gap-3 p-4 rounded-xl border shadow-lg
        ${bg} ${border} ${text}
        animate-fade-in min-w-[300px] max-w-md
      `}
        >
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export default Toast
