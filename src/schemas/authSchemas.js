import { z } from 'zod';

/**
 * PHASE 3.1 : Schémas de validation Zod pour l'authentification
 */

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Email invalide'),
    mot_de_passe: z
        .string()
        .min(1, 'Le mot de passe est requis')
});

export const registerSchema = z.object({
    nom: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    prenom: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Email invalide'),
    telephone: z
        .string()
        .min(1, 'Le téléphone est requis')
        .regex(/^(\+237)?[0-9]{9}$/, 'Numéro de téléphone invalide (format: +237XXXXXXXXX ou XXXXXXXXX)'),
    mot_de_passe: z
        .string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z
        .string()
        .min(1, 'Veuillez confirmer le mot de passe')
}).refine((data) => data.mot_de_passe === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Email invalide')
});

export const resetPasswordSchema = z.object({
    nouveau_mot_de_passe: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z
        .string()
        .min(1, 'Veuillez confirmer le mot de passe')
}).refine((data) => data.nouveau_mot_de_passe === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
});
