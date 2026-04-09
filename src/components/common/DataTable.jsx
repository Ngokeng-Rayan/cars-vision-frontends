import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'

const DataTable = ({
    columns = [],
    data = [],
    loading = false,
    pagination,
    onPageChange,
    onSort,
    sortField,
    sortDirection,
    emptyMessage = 'Aucune donnée disponible'
}) => {
    const [localSortField, setLocalSortField] = useState(sortField)
    const [localSortDirection, setLocalSortDirection] = useState(sortDirection || 'asc')

    const handleSort = (field) => {
        if (!field) return

        let newDirection = 'asc'
        if (localSortField === field) {
            newDirection = localSortDirection === 'asc' ? 'desc' : 'asc'
        }

        setLocalSortField(field)
        setLocalSortDirection(newDirection)
        onSort?.(field, newDirection)
    }

    const getSortIcon = (field) => {
        if (localSortField !== field) {
            return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
        }
        return localSortDirection === 'asc'
            ? <ChevronUp className="h-4 w-4 text-[#4DB896]" />
            : <ChevronDown className="h-4 w-4 text-[#4DB896]" />
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DB896] mx-auto"></div>
                    <p className="text-gray-500 mt-4">Chargement...</p>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-12 text-center">
                    <p className="text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        className={`
                      px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                      ${column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}
                    `}
                                        onClick={() => column.sortable && handleSort(column.field)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{column.header}</span>
                                            {column.sortable && getSortIcon(column.field)}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                            {column.render
                                                ? column.render(row, rowIndex)
                                                : column.field
                                                    ? row[column.field]
                                                    : null
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-700">
                        Affichage de <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> à{' '}
                        <span className="font-semibold">
                            {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        sur <span className="font-semibold">{pagination.total}</span> résultats
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(pagination.pages)].map((_, index) => {
                                const page = index + 1
                                // Afficher seulement quelques pages autour de la page actuelle
                                if (
                                    page === 1 ||
                                    page === pagination.pages ||
                                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => onPageChange?.(page)}
                                            className={`
                        px-4 py-2 rounded-lg font-medium transition-colors
                        ${page === pagination.page
                                                    ? 'bg-[#4DB896] text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                }
                      `}
                                        >
                                            {page}
                                        </button>
                                    )
                                } else if (
                                    page === pagination.page - 2 ||
                                    page === pagination.page + 2
                                ) {
                                    return <span key={page} className="px-2">...</span>
                                }
                                return null
                            })}
                        </div>

                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataTable
