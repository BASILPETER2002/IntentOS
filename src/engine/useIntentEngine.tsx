import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { SignalCollector } from './SignalCollector';
import { InferenceEngine } from './InferenceEngine';
import { PolicyEngine } from './PolicyEngine';
import { LearningEngine } from './LearningEngine';
import type { IntentState, Policy, Signal } from './types';

interface IntentContextType {
    currentIntent: IntentState;
    activePolicy: Policy;
    signals: Signal[];
    intentHistory: { state: IntentState; timestamp: number }[];
    learning: LearningEngine;
    reportOutcome: (success: boolean) => void;
}

const IntentContext = createContext<IntentContextType | null>(null);

export const IntentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentIntent, setCurrentIntent] = useState<IntentState>('EXPLORING');
    const [activePolicy, setActivePolicy] = useState<Policy>(new PolicyEngine().selectPolicy('EXPLORING'));
    const [signals, setSignals] = useState<Signal[]>([]);
    const [intentHistory, setIntentHistory] = useState<{ state: IntentState; timestamp: number }[]>([]);

    // Engine refs to persist instances
    const signalCollector = useRef(new SignalCollector());
    const inferenceEngine = useRef(new InferenceEngine());
    const policyEngine = useRef(new PolicyEngine());
    const learningEngine = useRef(new LearningEngine());

    const reportOutcome = (success: boolean) => {
        learningEngine.current.recordOutcome(activePolicy.id, success);
    };

    useEffect(() => {
        const unsub = signalCollector.current.subscribe((signal) => {
            // 1. Update Signal History (keep last 50 for visualization)
            setSignals(prev => [...prev.slice(-49), signal]);

            // 2. Infer Intent
            const newIntent = inferenceEngine.current.processSignals(signal);

            // 3. Update State if Changed
            setCurrentIntent(prev => {
                if (prev !== newIntent) {
                    // Record Transition
                    learningEngine.current.recordTransition(prev, newIntent);

                    const policy = policyEngine.current.selectPolicy(newIntent);

                    setActivePolicy(policy);
                    setIntentHistory(h => [...h, { state: newIntent, timestamp: Date.now() }]);
                    return newIntent;
                }
                return prev;
            });
        });

        return () => unsub();
    }, []);

    return (
        <IntentContext.Provider value={{
            currentIntent,
            activePolicy,
            signals,
            intentHistory,
            learning: learningEngine.current,
            reportOutcome
        }}>
            {children}
        </IntentContext.Provider>
    );
};

export const useIntent = () => {
    const context = useContext(IntentContext);
    if (!context) throw new Error("useIntent must be used within IntentProvider");
    return context;
};
