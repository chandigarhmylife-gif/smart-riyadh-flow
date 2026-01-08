import Landing from './pages/Landing';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Scenarios from './pages/Scenarios';
import TrafficData from './pages/TrafficData';
import Reports from './pages/Reports';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Landing": Landing,
    "Register": Register,
    "Dashboard": Dashboard,
    "Simulation": Simulation,
    "Analytics": Analytics,
    "Settings": Settings,
    "Scenarios": Scenarios,
    "TrafficData": TrafficData,
    "Reports": Reports,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};