import APIConnections from './pages/APIConnections';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import IncidentManagement from './pages/IncidentManagement';
import Landing from './pages/Landing';
import NetworkSimulation from './pages/NetworkSimulation';
import RealTimeNetwork from './pages/RealTimeNetwork';
import Register from './pages/Register';
import Reports from './pages/Reports';
import ScenarioBuilder from './pages/ScenarioBuilder';
import ScenarioHistory from './pages/ScenarioHistory';
import Scenarios from './pages/Scenarios';
import Settings from './pages/Settings';
import Simulation from './pages/Simulation';
import TrafficData from './pages/TrafficData';
import UserManagement from './pages/UserManagement';
import AlertManagement from './pages/AlertManagement';
import ModelManagement from './pages/ModelManagement';
import PerformanceBaselines from './pages/PerformanceBaselines';
import EmissionAnalytics from './pages/EmissionAnalytics';
import PublicDisplay from './pages/PublicDisplay';
import __Layout from './Layout.jsx';


export const PAGES = {
    "APIConnections": APIConnections,
    "Analytics": Analytics,
    "Dashboard": Dashboard,
    "DeviceManagement": DeviceManagement,
    "IncidentManagement": IncidentManagement,
    "Landing": Landing,
    "NetworkSimulation": NetworkSimulation,
    "RealTimeNetwork": RealTimeNetwork,
    "Register": Register,
    "Reports": Reports,
    "ScenarioBuilder": ScenarioBuilder,
    "ScenarioHistory": ScenarioHistory,
    "Scenarios": Scenarios,
    "Settings": Settings,
    "Simulation": Simulation,
    "TrafficData": TrafficData,
    "UserManagement": UserManagement,
    "AlertManagement": AlertManagement,
    "ModelManagement": ModelManagement,
    "PerformanceBaselines": PerformanceBaselines,
    "EmissionAnalytics": EmissionAnalytics,
    "PublicDisplay": PublicDisplay,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};