import type { IntentState, Policy } from './types';

export const POLICIES: Record<IntentState, Policy> = {
    'EXPLORING': {
        id: 'policy_explore',
        name: 'Standard Exploration',
        adaptations: [
            { type: 'NONE' }
        ]
    },
    'GOAL_DRIVEN': {
        id: 'policy_speed',
        name: 'Accelerated Workflow',
        adaptations: [
            { type: 'COLLAPSE_STEPS' },
            { type: 'SIMPLIFY_VIEW' }
        ]
    },
    'CONFUSED': {
        id: 'policy_guidance',
        name: 'Guidance Mode',
        adaptations: [
            { type: 'UI_HINT', parameters: { message: "Need help? hover over items for details." } },
            { type: 'DELAY_VALIDATION' }
        ]
    },
    'HESITATING': {
        id: 'policy_encourage',
        name: 'Reassurance',
        adaptations: [
            { type: 'UI_HINT', parameters: { message: "Take your time. Changes are auto-saved." } }
        ]
    },
    'FRUSTRATED': {
        id: 'policy_recovery',
        name: 'Error Recovery',
        adaptations: [
            { type: 'UI_HINT', parameters: { level: 'urgent', message: "It seems something is wrong. Reset form?" } }
        ]
    },
    'IDLE': {
        id: 'policy_idle',
        name: 'Standby',
        adaptations: []
    }
};

export class PolicyEngine {
    public selectPolicy(intent: IntentState): Policy {
        return POLICIES[intent] || POLICIES['EXPLORING'];
    }
}
