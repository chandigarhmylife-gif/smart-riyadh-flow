import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import NetworkSimulation from './pages/NetworkSimulation';
import Register from './pages/Register';
import Reports from './pages/Reports';
import Scenarios from './pages/Scenarios';
import Settings from './pages/Settings';
import Simulation from './pages/Simulation';
import TrafficData from './pages/TrafficData';
import ScenarioHistory from './pages/ScenarioHistory';
import RealTimeNetwork from './pages/RealTimeNetwork';
import APIConnections from './pages/APIConnections';
import IncidentManagement from './pages/IncidentManagement';
import DeviceManagement from './pages/DeviceManagement';
import ScenarioBuilder from './pages/ScenarioBuilder';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "Dashboard": Dashboard,
    "Landing": Landing,
    "NetworkSimulation": NetworkSimulation,
    "Register": Register,
    "Reports": Reports,
    "Scenarios": Scenarios,
    "Settings": Settings,
    "Simulation": Simulation,
    "TrafficData": TrafficData,
    "ScenarioHistory": ScenarioHistory,
    "RealTimeNetwork": RealTimeNetwork,
    "APIConnections": APIConnections,
    "IncidentManagement": IncidentManagement,
    "DeviceManagement": DeviceManagement,
    "ScenarioBuilder": ScenarioBuilder,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};