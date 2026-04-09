const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    color = 'blue',
    loading = false
}) => {
    const colorClasses = {
        blue: {
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            iconBg: 'bg-blue-100'
        },
        green: {
            gradient: 'from-green-500 to-green-600',
            bg: 'bg-green-50',
            text: 'text-green-600',
            iconBg: 'bg-green-100'
        },
        purple: {
            gradient: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            iconBg: 'bg-purple-100'
        },
        orange: {
            gradient: 'from-orange-500 to-orange-600',
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            iconBg: 'bg-orange-100'
        },
        mint: {
            gradient: 'from-[#4DB896] to-[#3da07d]',
            bg: 'bg-[#4DB896]/10',
            text: 'text-[#4DB896]',
            iconBg: 'bg-[#4DB896]/20'
        },
        yellow: {
            gradient: 'from-yellow-500 to-yellow-600',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
            iconBg: 'bg-yellow-100'
        },
        red: {
            gradient: 'from-red-500 to-red-600',
            bg: 'bg-red-50',
            text: 'text-red-600',
            iconBg: 'bg-red-100'
        }
    }

    const colors = colorClasses[color] || colorClasses.blue

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`h-1 bg-gradient-to-r ${colors.gradient} animate-pulse`}></div>
                <div className="p-6">
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
            <div className={`h-1 bg-gradient-to-r ${colors.gradient}`}></div>
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

                        {subtitle && (
                            <p className="text-sm text-gray-500">{subtitle}</p>
                        )}
                    </div>

                    <div className={`${colors.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatCard
