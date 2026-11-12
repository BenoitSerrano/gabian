import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { storage } from '../lib/storage';
import { SignIn, SignUp } from '../pages/Authentication';
import { Home } from '../pages/Home';
import { Review } from '../pages/Review';
import { ROUTE_PATHS } from './routePaths';
import { useDocumentTitle } from './useDocumentTitle';

function Router() {
    return (
        <Routes>
            <Route element={<AuthenticatedOnly />}>
                <Route
                    path={ROUTE_PATHS.HOME}
                    element={<Titled title="Accueil" page={<Home />} />}
                />
                <Route
                    path={ROUTE_PATHS.REVIEW}
                    element={<Titled title="Révision" page={<Review />} />}
                />
            </Route>
            <Route element={<AnonymousOnly />}>
                <Route
                    path={ROUTE_PATHS.SIGN_IN}
                    element={<Titled title="Connexion" page={<SignIn />} />}
                />
                <Route
                    path={ROUTE_PATHS.SIGN_UP}
                    element={<Titled title="Inscription" page={<SignUp />} />}
                />
            </Route>
            <Route path="*" element={<Navigate to={ROUTE_PATHS.HOME} replace />} />
        </Routes>
    );
}

function AuthenticatedOnly() {
    const isAuthenticated = !!storage.jwtHandler.get();
    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTE_PATHS.SIGN_IN} replace />;
}

function AnonymousOnly() {
    const isAuthenticated = !!storage.jwtHandler.get();
    return isAuthenticated ? <Navigate to={ROUTE_PATHS.HOME} replace /> : <Outlet />;
}

function Titled(props: { title: string; page: JSX.Element }) {
    useDocumentTitle(props.title);
    return props.page;
}

export { Router };
