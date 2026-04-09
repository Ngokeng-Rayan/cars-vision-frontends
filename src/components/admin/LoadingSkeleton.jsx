const LoadingSkeleton = ({ type = 'table', count = 5 }) => {
    if (type === 'stats') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-1 bg-gray-200 animate-pulse"></div>
                        <div className="p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (type === 'cards') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="flex gap-2 mt-4">
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Default: table skeleton
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-4">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LoadingSkeleton
