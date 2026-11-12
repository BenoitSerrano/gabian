import { createContext, ReactNode, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

type alertType = { variant: 'error' | 'success' | 'warning'; text: string };

const AlertContext = createContext<{ displayAlert: (alert: alertType) => void }>({
    displayAlert: () => null,
});

function AlertProvider(props: { children: ReactNode }) {
    const [alert, setAlert] = useState<alertType | undefined>();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AlertContext.Provider value={{ displayAlert }}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={isOpen}
                autoHideDuration={3000}
                onClose={() => setIsOpen(false)}
            >
                <Alert onClose={() => setIsOpen(false)} severity={alert?.variant}>
                    {alert?.text}
                </Alert>
            </Snackbar>
            {props.children}
        </AlertContext.Provider>
    );

    function displayAlert(newAlert: alertType) {
        setAlert(newAlert);
        setIsOpen(true);
    }
}

function useAlert() {
    return useContext(AlertContext);
}

export { AlertProvider, useAlert };
