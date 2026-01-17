export type IntentState =
    | 'EXPLORING'
    | 'GOAL_DRIVEN'
    | 'CONFUSED'
    | 'HESITATING'
    | 'FRUSTRATED'
    | 'IDLE';

export interface Signal {
    type: 'MOUSE_VELOCITY' | 'CLICK_RATE' | 'IDLE_TIME' | 'BACKTRACK' | 'SCROLL_DEPTH' | 'INPUT_HESITATION';
    value: number; // Normalized 0-1 or raw value depending on metric
    timestamp: number;
    metadata?: any;
}

export interface IntentNode {
    id: string;
    state: IntentState;
    timestamp: number;
    confidence: number;
    signals: Signal[]; // The signals that led to this state
}

export interface Policy {
    id: string;
    name: string;
    adaptations: Adaptation[];
}

export interface Adaptation {
    type: 'UI_HINT' | 'SIMPLIFY_VIEW' | 'COLLAPSE_STEPS' | 'DELAY_VALIDATION' | 'NONE';
    parameters?: Record<string, any>;
}

export interface PolicyScore {
    policyId: string;
    uses: number;
    successes: number;
    failures: number;
    score: number; // 0.0 to 1.0 (success rate)
}

export interface TransitionEdge {
    from: IntentState;
    to: IntentState;
    count: number;
    probability: number;
}

export interface MemoryGraphData {
    transitions: TransitionEdge[];
    policyScores: PolicyScore[];
    totalSessions: number;
}

export interface EngineState {
    currentIntent: IntentState;
    confidence: number;
    activePolicy: Policy;
    history: IntentNode[];
}
