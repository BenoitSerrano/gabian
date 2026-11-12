import { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api, useApiCall } from '../../lib/api';
import { storage } from '../../lib/storage';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { AuthenticationForm } from './AuthenticationForm';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginApiCall = useApiCall({
        apiCall: api.login,
        onSuccess: ({ token }) => {
            storage.jwtHandler.set(token);
            navigate(ROUTE_PATHS.HOME);
        },
    });

    return (
        <AuthenticationForm
            title="Connexion"
            submitLabel="Se connecter"
            isLoading={loginApiCall.isLoading}
            isSubmitDisabled={!email || !password}
            onSubmit={() => loginApiCall.perform({ email, password })}
            footer={{
                text: 'Pas encore de compte ?',
                linkLabel: 'Créer un compte',
                linkTo: ROUTE_PATHS.SIGN_UP,
            }}
        >
            <TextField
                autoFocus
                fullWidth
                type="email"
                label="Adresse e-mail"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                fullWidth
                type="password"
                label="Mot de passe"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </AuthenticationForm>
    );
}

export { SignIn };
