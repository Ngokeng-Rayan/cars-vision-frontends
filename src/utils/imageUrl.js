/**
 * Construit l'URL complète d'une image à partir d'un chemin relatif backend.
 * Si l'URL est déjà absolue (http/https), elle est retournée telle quelle.
 */
const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')

export const getImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${BACKEND_URL}${url}`
}

/**
 * Extrait l'URL de la première image d'un produit (ou d'un index donné).
 * Gère les deux formats possibles : tableau de strings ou tableau d'objets { url }.
 */
export const getProductImageUrl = (images, index = 0) => {
    if (!images || !Array.isArray(images) || images.length === 0) return null
    const img = images[index]
    if (!img) return null
    const rawUrl = typeof img === 'string' ? img : img.url
    return getImageUrl(rawUrl)
}
