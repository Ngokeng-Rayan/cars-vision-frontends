import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PHASE 3.3 : Composant SEO pour meta tags dynamiques
 */

const SEO = ({ 
    title = 'Cars Vision Auto - Pièces Auto & Services Mécaniques à Douala',
    description = 'Votre partenaire automobile à Douala. Pièces détachées de qualité, services mécaniques professionnels et rendez-vous en ligne.',
    keywords = 'pièces auto, garage, mécanique, Douala, Cameroun, voiture, entretien',
    image = '/og-image.jpg',
    type = 'website'
}) => {
    const location = useLocation();
    const url = `https://carsvisionauto.cm${location.pathname}`;

    useEffect(() => {
        // Titre de la page
        document.title = title;

        // Meta description
        updateMetaTag('name', 'description', description);
        updateMetaTag('name', 'keywords', keywords);

        // Open Graph
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', description);
        updateMetaTag('property', 'og:image', image);
        updateMetaTag('property', 'og:url', url);
        updateMetaTag('property', 'og:type', type);

        // Twitter Card
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', title);
        updateMetaTag('name', 'twitter:description', description);
        updateMetaTag('name', 'twitter:image', image);
    }, [title, description, keywords, image, url, type]);

    return null;
};

const updateMetaTag = (attribute, key, content) => {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
};

export default SEO;
