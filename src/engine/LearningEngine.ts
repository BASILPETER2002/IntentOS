import type { IntentState, MemoryGraphData } from './types';
import { Persistence } from './Persistence';

export class LearningEngine {
    private memory: MemoryGraphData;

    constructor() {
        this.memory = Persistence.load();
        this.memory.totalSessions++;
        this.save();
    }

    public getMemory(): MemoryGraphData {
        return this.memory;
    }

    public recordTransition(from: IntentState, to: IntentState) {
        if (from === to) return;

        let edge = this.memory.transitions.find(e => e.from === from && e.to === to);
        if (!edge) {
            edge = { from, to, count: 0, probability: 0 };
            this.memory.transitions.push(edge);
        }
        edge.count++;

        // Recalculate probabilities for 'from' node
        const allOutgoing = this.memory.transitions.filter(e => e.from === from);
        const totalOutgoing = allOutgoing.reduce((acc, e) => acc + e.count, 0);

        allOutgoing.forEach(e => {
            e.probability = e.count / totalOutgoing;
        });

        this.save();
    }

    public recordOutcome(policyId: string, success: boolean) {
        let score = this.memory.policyScores.find(p => p.policyId === policyId);
        if (!score) {
            score = { policyId, uses: 0, successes: 0, failures: 0, score: 0.5 };
            this.memory.policyScores.push(score);
        }

        score.uses++;
        if (success) score.successes++;
        else score.failures++;

        // Simple Reinforcement: Weighted average
        // New Score = (Successes / Uses)
        score.score = score.successes / score.uses;

        this.save();
    }

    public getPolicyScore(policyId: string): number {
        const s = this.memory.policyScores.find(p => p.policyId === policyId);
        return s ? s.score : 0.5; // Default to neutral if unknown
    }

    private save() {
        Persistence.save(this.memory);
    }
}
