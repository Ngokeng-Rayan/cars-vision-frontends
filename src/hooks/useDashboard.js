import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

/**
 * PHASE 3.2 : Custom hooks avec TanStack Query pour le dashboard
 */

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: () => dashboardService.getStats(),
    });
};

export const useDashboardStatsByPeriod = (period) => {
    return useQuery({
        queryKey: ['dashboard', 'stats', period],
        queryFn: () => dashboardService.getStatsByPeriod(period),
        enabled: !!period,
    });
};

export const useRevenueHistory = (months = 6) => {
    return useQuery({
        queryKey: ['dashboard', 'revenue', months],
        queryFn: () => dashboardService.getRevenueHistory(months),
    });
};

export const useRecentOrders = () => {
    return useQuery({
        queryKey: ['dashboard', 'orders', 'recent'],
        queryFn: () => dashboardService.getRecentOrders(),
    });
};

export const useRecentAppointments = () => {
    return useQuery({
        queryKey: ['dashboard', 'appointments', 'recent'],
        queryFn: () => dashboardService.getRecentAppointments(),
    });
};

export const useLowStockProducts = () => {
    return useQuery({
        queryKey: ['dashboard', 'products', 'low-stock'],
        queryFn: () => dashboardService.getLowStockProducts(),
    });
};

export const usePendingReviews = () => {
    return useQuery({
        queryKey: ['dashboard', 'reviews', 'pending'],
        queryFn: () => dashboardService.getPendingReviews(),
    });
};
