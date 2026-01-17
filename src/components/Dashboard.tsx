import React from 'react';
import { useIntent } from '../engine/useIntentEngine';

export const Dashboard: React.FC = () => {
    const { signals, currentIntent, activePolicy, intentHistory, learning } = useIntent();

    const recentSignals = signals.slice(-10).reverse();
    const memory = learning.getMemory();

    return (
        <div className="card" style={{ padding: '2rem', height: '100%', fontSize: '0.85rem' }}>
            <h3>IntentOS Monitor</h3>
            <hr style={{ margin: '1rem 0', borderColor: 'hsl(var(--color-border))' }} />

            <div style={{ marginBottom: '2rem' }}>
                <h4>Current State</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
                        <strong>Intent:</strong> <br />
                        <span style={{ fontSize: '1.2rem', color: 'hsl(var(--color-accent))' }}>{currentIntent}</span>
                    </div>
                    <div style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
                        <strong>Active Policy:</strong> <br />
                        {activePolicy.name}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h4>Signal Feed (Live)</h4>
                <div style={{
                    height: '100px',
                    overflowY: 'auto',
                    background: '#111',
                    color: '#0f0',
                    fontFamily: 'monospace',
                    padding: '0.5rem',
                    borderRadius: '4px'
                }}>
                    {recentSignals.map((s, i) => (
                        <div key={i}>
                            [{new Date(s.timestamp).toLocaleTimeString().split(' ')[0]}]
                            {' '}{s.type}: {s.value.toFixed(1)}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h4>Intent Memory Graph (Session History)</h4>
                <div style={{
                    height: '60px',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    overflowX: 'auto'
                }}>
                    {intentHistory.map((h, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                padding: '0.25rem 0.5rem',
                                background: '#eee',
                                borderRadius: '10px',
                                whiteSpace: 'nowrap',
                                border: h.state === currentIntent && i === intentHistory.length - 1 ? '2px solid blue' : '1px solid #ccc'
                            }}>
                                {h.state}
                            </div>
                            {i < intentHistory.length - 1 && <div style={{ width: '20px', height: '2px', background: '#ccc' }}></div>}
                        </div>
                    ))}
                    {intentHistory.length === 0 && <span style={{ color: '#999' }}>No history yet...</span>}
                </div>
            </div>

            <div className="learning-stats">
                <h4>Learning Engine State (Cross-Session)</h4>
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    <p><strong>Total Sessions Handled:</strong> {memory.totalSessions}</p>

                    <h5 style={{ marginTop: '0.5rem' }}>Policy Outcomes (Reinforcement Scores)</h5>
                    <ul style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>
                        {memory.policyScores.map(score => (
                            <li key={score.policyId}>
                                {score.policyId}:
                                <strong style={{ color: score.score > 0.5 ? 'green' : 'red' }}> {(score.score * 100).toFixed(1)}% Success</strong>
                                ({score.uses} uses)
                            </li>
                        ))}
                        {memory.policyScores.length === 0 && <li>No outcomes recorded yet.</li>}
                    </ul>

                    <h5 style={{ marginTop: '0.5rem' }}>Top Transitions (Probabilities)</h5>
                    <ul style={{ paddingLeft: '1rem' }}>
                        {memory.transitions
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 5)
                            .map((t, i) => (
                                <li key={i}>
                                    {t.from} → {t.to}: <strong>{(t.probability * 100).toFixed(0)}%</strong> ({t.count} times)
                                </li>
                            ))}
                        {memory.transitions.length === 0 && <li>No transitions learned yet.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};
