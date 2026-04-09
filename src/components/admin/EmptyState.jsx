const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction
}) => {
    return (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Icon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {description}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center px-6 py-3 bg-[#4DB896] text-white font-medium rounded-lg hover:bg-[#3da07d] transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    )
}

export default EmptyState
