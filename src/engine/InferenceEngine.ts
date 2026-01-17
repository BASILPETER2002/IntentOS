import type { Signal, IntentState } from './types';

export class InferenceEngine {
    private recentSignals: Signal[] = [];
    private windowSize = 5000; // Look at last 5 seconds

    public processSignals(newSignal: Signal): IntentState {
        this.recentSignals.push(newSignal);
        this.pruneOldSignals();
        return this.inferIntent();
    }

    private pruneOldSignals() {
        const now = Date.now();
        this.recentSignals = this.recentSignals.filter(s => now - s.timestamp < this.windowSize);
    }

    private inferIntent(): IntentState {
        if (this.recentSignals.length === 0) return 'IDLE';

        const signals = this.recentSignals;

        // Aggregate metrics
        const velocitySum = signals
            .filter(s => s.type === 'MOUSE_VELOCITY')
            .reduce((acc, s) => acc + s.value, 0);

        const clickCount = signals.filter(s => s.type === 'CLICK_RATE').length;
        const idleEvents = signals.filter(s => s.type === 'IDLE_TIME').length;

        // Simple Rule-Based Logic (Explainable AI)

        // 1. Frustrated: Rapid clicks
        if (clickCount > 3) return 'FRUSTRATED';

        // 2. Hesitating: Significant idle time
        if (idleEvents > 0) return 'HESITATING';

        // 3. Goal Driven: High velocity, steady activity
        if (velocitySum > 500 && clickCount > 0) return 'GOAL_DRIVEN';

        // 4. Confused: (Complex to detect simply, maybe low velocity + no clicks?)
        // For MVP, if they are moving mouse but not clicking often?
        if (velocitySum > 100 && clickCount === 0) return 'CONFUSED';

        // Default
        return 'EXPLORING';
    }
}
