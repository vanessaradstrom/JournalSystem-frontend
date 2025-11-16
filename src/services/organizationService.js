import { apiFetch } from '../api/client';

export const organizationService = {
    getAll: (token) => apiFetch('/organizations', {}, token)
};
