import Papa from 'papaparse';

/**
 * PHASE 3.4 : Utilitaire d'export CSV avec PapaParse
 */

export const exportToCSV = (data, filename = 'export.csv', columns = null) => {
    if (!data || data.length === 0) {
        console.warn('Aucune donnée à exporter');
        return;
    }

    // Si des colonnes spécifiques sont définies, filtrer les données
    let dataToExport = data;
    if (columns && columns.length > 0) {
        dataToExport = data.map(row => {
            const filteredRow = {};
            columns.forEach(col => {
                if (typeof col === 'object') {
                    // Format: { key: 'field_name', label: 'Column Label' }
                    filteredRow[col.label] = row[col.key];
                } else {
                    // Format simple: 'field_name'
                    filteredRow[col] = row[col];
                }
            });
            return filteredRow;
        });
    }

    // Convertir en CSV
    const csv = Papa.unparse(dataToExport, {
        quotes: true,
        delimiter: ',',
        header: true
    });

    // Créer un blob et télécharger
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export spécifique pour les commandes
 */
export const exportOrdersToCSV = (orders) => {
    const columns = [
        { key: 'numero_commande', label: 'N° Commande' },
        { key: 'utilisateur.prenom', label: 'Prénom' },
        { key: 'utilisateur.nom', label: 'Nom' },
        { key: 'utilisateur.email', label: 'Email' },
        { key: 'total', label: 'Montant (FCFA)' },
        { key: 'statut', label: 'Statut' },
        { key: 'statut_paiement', label: 'Paiement' },
        { key: 'methode_paiement', label: 'Méthode' },
        { key: 'cree_le', label: 'Date' }
    ];

    const formattedOrders = orders.map(order => ({
        numero_commande: order.numero_commande,
        'utilisateur.prenom': order.utilisateur?.prenom || order.nom_invite || 'Invité',
        'utilisateur.nom': order.utilisateur?.nom || '',
        'utilisateur.email': order.utilisateur?.email || order.email_invite || '',
        total: order.total,
        statut: order.statut,
        statut_paiement: order.statut_paiement,
        methode_paiement: order.methode_paiement,
        cree_le: new Date(order.cree_le).toLocaleDateString('fr-FR')
    }));

    const filename = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formattedOrders, filename, columns);
};

/**
 * Export spécifique pour les rendez-vous
 */
export const exportAppointmentsToCSV = (appointments) => {
    const columns = [
        { key: 'service_nom', label: 'Service' },
        { key: 'utilisateur.prenom', label: 'Prénom' },
        { key: 'utilisateur.nom', label: 'Nom' },
        { key: 'utilisateur.telephone', label: 'Téléphone' },
        { key: 'date_rdv', label: 'Date' },
        { key: 'heure_debut', label: 'Heure' },
        { key: 'site', label: 'Site' },
        { key: 'marque_vehicule', label: 'Marque' },
        { key: 'modele_vehicule', label: 'Modèle' },
        { key: 'statut', label: 'Statut' }
    ];

    const formattedAppointments = appointments.map(rdv => ({
        service_nom: rdv.service_nom,
        'utilisateur.prenom': rdv.utilisateur?.prenom || '',
        'utilisateur.nom': rdv.utilisateur?.nom || '',
        'utilisateur.telephone': rdv.utilisateur?.telephone || '',
        date_rdv: new Date(rdv.date_rdv).toLocaleDateString('fr-FR'),
        heure_debut: rdv.heure_debut,
        site: rdv.site === 'bonamoussadi' ? 'Bonamoussadi' : 'Ndokoti',
        marque_vehicule: rdv.marque_vehicule,
        modele_vehicule: rdv.modele_vehicule,
        statut: rdv.statut
    }));

    const filename = `rendez-vous_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(formattedAppointments, filename, columns);
};
