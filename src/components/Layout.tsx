import { ReactNode } from 'react';
import { AppBar, Button, Container, Toolbar, Typography, styled } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { ROUTE_PATHS } from '../routes/routePaths';

function Layout(props: { children: ReactNode }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return (
        <>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Brand to={ROUTE_PATHS.HOME}>
                        <Typography variant="h2" component="span">
                            Gabian
                        </Typography>
                    </Brand>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
                        Déconnexion
                    </Button>
                </Toolbar>
            </AppBar>
            <Main maxWidth="sm">{props.children}</Main>
        </>
    );

    function logout() {
        storage.jwtHandler.remove();
        queryClient.clear();
        navigate(ROUTE_PATHS.SIGN_IN);
    }
}

const Brand = styled(Link)({ color: 'inherit', textDecoration: 'none', flexGrow: 1 });
const Main = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
}));

export { Layout };
