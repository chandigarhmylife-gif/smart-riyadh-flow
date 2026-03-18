/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import APIConnections from './pages/APIConnections';
import AlertManagement from './pages/AlertManagement';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import EmissionAnalytics from './pages/EmissionAnalytics';
import IncidentManagement from './pages/IncidentManagement';
import Landing from './pages/Landing';
import ModelManagement from './pages/ModelManagement';
import NetworkSimulation from './pages/NetworkSimulation';
import PerformanceBaselines from './pages/PerformanceBaselines';
import PublicDisplay from './pages/PublicDisplay';
import RealTimeNetwork from './pages/RealTimeNetwork';
import Reports from './pages/Reports';
import ScenarioBuilder from './pages/ScenarioBuilder';
import ScenarioHistory from './pages/ScenarioHistory';
import Scenarios from './pages/Scenarios';
import Settings from './pages/Settings';
import Simulation from './pages/Simulation';
import TrafficData from './pages/TrafficData';
import UserManagement from './pages/UserManagement';
import __Layout from './Layout.jsx';


export const PAGES = {
    "APIConnections": APIConnections,
    "AlertManagement": AlertManagement,
    "Dashboard": Dashboard,
    "DeviceManagement": DeviceManagement,
    "EmissionAnalytics": EmissionAnalytics,
    "IncidentManagement": IncidentManagement,
    "Landing": Landing,
    "ModelManagement": ModelManagement,
    "NetworkSimulation": NetworkSimulation,
    "PerformanceBaselines": PerformanceBaselines,
    "PublicDisplay": PublicDisplay,
    "RealTimeNetwork": RealTimeNetwork,
    "Reports": Reports,
    "ScenarioBuilder": ScenarioBuilder,
    "ScenarioHistory": ScenarioHistory,
    "Scenarios": Scenarios,
    "Settings": Settings,
    "Simulation": Simulation,
    "TrafficData": TrafficData,
    "UserManagement": UserManagement,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};