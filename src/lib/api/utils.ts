import { ApiError } from '../errors';
import { storage } from '../storage';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'https://multi-usage-api.onrender.com/api';
const BASE_URL = `${API_BASE_URL}/gabian`;

async function performApiCall<dataT>(
    uri: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    body?: Object,
): Promise<dataT> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const token = storage.jwtHandler.get();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}/${uri}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && token) {
        // Token expiré ou invalide : on déconnecte l'utilisateur.
        storage.jwtHandler.remove();
        window.location.assign('/sign-in');
    }
    if (!response.ok) {
        const message = (await response.text().catch(() => '')) || response.statusText;
        throw new ApiError(message, response.status);
    }
    return response.json();
}

export { performApiCall };
