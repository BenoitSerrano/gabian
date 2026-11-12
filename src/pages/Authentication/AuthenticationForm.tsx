import { FormEvent, ReactNode } from 'react';
import { Button, Card, Stack, Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';

function AuthenticationForm(props: {
    title: string;
    submitLabel: string;
    isSubmitDisabled: boolean;
    isLoading: boolean;
    onSubmit: () => void;
    footer: { text: string; linkLabel: string; linkTo: string };
    children: ReactNode;
}) {
    return (
        <Page>
            <StyledCard>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={6}>
                        <div>
                            <Typography variant="h1" align="center" color="primary">
                                Gabian
                            </Typography>
                            <Typography align="center" color="text.secondary">
                                {props.title}
                            </Typography>
                        </div>
                        <Stack spacing={4}>{props.children}</Stack>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={props.isLoading}
                            disabled={props.isSubmitDisabled}
                        >
                            {props.submitLabel}
                        </Button>
                        <Typography align="center" variant="body2">
                            {props.footer.text}{' '}
                            <Link to={props.footer.linkTo}>{props.footer.linkLabel}</Link>
                        </Typography>
                    </Stack>
                </form>
            </StyledCard>
        </Page>
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        props.onSubmit();
    }
}

const Page = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(8),
    width: '100%',
    maxWidth: 420,
}));

export { AuthenticationForm };
