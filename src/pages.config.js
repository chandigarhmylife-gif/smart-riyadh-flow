import Landing from './pages/Landing';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Landing": Landing,
    "Register": Register,
    "Dashboard": Dashboard,
    "Simulation": Simulation,
    "Analytics": Analytics,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};