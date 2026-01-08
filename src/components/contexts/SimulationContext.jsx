import React, { createContext, useContext, useState, useCallback } from 'react';

const SimulationContext = createContext(null);

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};

export const SimulationProvider = ({ children }) => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [metrics, setMetrics] = useState({
    avgWaitTime: 0,
    throughput: 0,
    queueLength: 0,
    efficiency: 0
  });
  const [scenarios, setScenarios] = useState([]);

  const startSimulation = useCallback((scenario) => {
    setCurrentScenario(scenario);
    setIsRunning(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    setCurrentScenario(null);
    setMetrics({
      avgWaitTime: 0,
      throughput: 0,
      queueLength: 0,
      efficiency: 0
    });
  }, []);

  const updateMetrics = useCallback((newMetrics) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  }, []);

  const loadScenario = useCallback((scenario) => {
    setCurrentScenario(scenario);
  }, []);

  const saveScenario = useCallback((scenario) => {
    setScenarios(prev => {
      const exists = prev.find(s => s.id === scenario.id);
      if (exists) {
        return prev.map(s => s.id === scenario.id ? scenario : s);
      }
      return [...prev, scenario];
    });
  }, []);

  const value = {
    currentScenario,
    isRunning,
    simulationSpeed,
    metrics,
    scenarios,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    updateMetrics,
    loadScenario,
    saveScenario,
    setSimulationSpeed
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};