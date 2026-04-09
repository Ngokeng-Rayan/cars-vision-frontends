import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * PHASE 3.5 : Composant Pagination réutilisable
 */

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    showFirstLast = true,
    maxVisible = 5
}) => {
    if (totalPages <= 1) return null;

    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            {/* Bouton Première page */}
            {showFirstLast && currentPage > 1 && (
                <button
                    onClick={() => handlePageClick(1)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Première page"
                >
                    Première
                </button>
            )}

            {/* Bouton Précédent */}
            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Page précédente"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Ellipse début */}
            {startPage > 1 && (
                <span className="px-3 py-2 text-gray-500">...</span>
            )}

            {/* Numéros de page */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        page === currentPage
                            ? 'bg-[#4DB896] text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {/* Ellipse fin */}
            {endPage < totalPages && (
                <span className="px-3 py-2 text-gray-500">...</span>
            )}

            {/* Bouton Suivant */}
            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Page suivante"
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            {/* Bouton Dernière page */}
            {showFirstLast && currentPage < totalPages && (
                <button
                    onClick={() => handlePageClick(totalPages)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Dernière page"
                >
                    Dernière
                </button>
            )}
        </div>
    );
};

export default Pagination;
