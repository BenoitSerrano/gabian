import { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api, useApiCall } from '../../lib/api';
import { storage } from '../../lib/storage';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { AuthenticationForm } from './AuthenticationForm';

const MIN_PASSWORD_LENGTH = 8;

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const createUserApiCall = useApiCall({
        apiCall: api.createUser,
        onSuccess: ({ token }) => {
            storage.jwtHandler.set(token);
            navigate(ROUTE_PATHS.HOME);
        },
    });

    const isPasswordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;

    return (
        <AuthenticationForm
            title="Créer un compte"
            submitLabel="Créer mon compte"
            isLoading={createUserApiCall.isLoading}
            isSubmitDisabled={!username.trim() || !email || password.length < MIN_PASSWORD_LENGTH}
            onSubmit={() => createUserApiCall.perform({ username, email, password })}
            footer={{
                text: 'Déjà inscrit ?',
                linkLabel: 'Se connecter',
                linkTo: ROUTE_PATHS.SIGN_IN,
            }}
        >
            <TextField
                autoFocus
                fullWidth
                label="Prénom ou surnom"
                autoComplete="nickname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
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
                autoComplete="new-password"
                value={password}
                error={isPasswordTooShort}
                helperText={`${MIN_PASSWORD_LENGTH} caractères minimum`}
                onChange={(e) => setPassword(e.target.value)}
            />
        </AuthenticationForm>
    );
}

export { SignUp };
