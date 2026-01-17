import React, { useState } from 'react';
import { useIntent } from '../engine/useIntentEngine';

export const SmartForm: React.FC = () => {
    const { activePolicy, currentIntent, reportOutcome } = useIntent();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', role: '', bio: '' });

    // Adaptation Logic
    const showHints = activePolicy.adaptations.some(a => a.type === 'UI_HINT');
    const simplifyView = activePolicy.adaptations.some(a => a.type === 'SIMPLIFY_VIEW');
    const collapseSteps = activePolicy.adaptations.some(a => a.type === 'COLLAPSE_STEPS');

    // If steps are collapsed (Accelerate Policy), we might show everything
    const renderAllSteps = collapseSteps;

    const handleCompletion = () => {
        reportOutcome(true);
        alert("Registered! Outcome recorded as Success.");
        // Reset for demo
        setStep(1);
        setFormData({ name: '', email: '', role: '', bio: '' });
    };

    const handleGiveUp = () => {
        reportOutcome(false);
        alert("Aborted! Outcome recorded as Failure.");
        setStep(1);
    }

    return (
        <div className="card" style={{ padding: '2rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Smart Registration</h2>
                <button onClick={handleGiveUp} style={{ fontSize: '0.8rem', background: '#e0e0e0', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                    Simulate Dropoff
                </button>
            </div>

            <div style={{ marginBottom: '1rem', fontStyle: 'italic', color: 'hsl(var(--color-accent))' }}>
                Current Intent: <strong>{currentIntent}</strong>
            </div>

            {showHints && (
                <div style={{
                    background: 'hsl(var(--intent-confusion))',
                    color: 'black',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                }}>
                    💡 <strong>Guidance:</strong> We noticed you might be pausing. This form is just a demo!
                </div>
            )}

            <form onSubmit={e => e.preventDefault()}>
                {(step === 1 || renderAllSteps) && (
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                        <input
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Alice Smith"
                        />
                        {showHints && <small style={{ color: '#666' }}>Type your real or display name.</small>}
                    </div>
                )}

                {(step === 1 || renderAllSteps) && (
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                        <input
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alice@example.com"
                        />
                    </div>
                )}

                {/* Optional Section - Hidden if SIMPLIFY_VIEW is active */}
                {!simplifyView && (step === 2 || renderAllSteps) && (
                    <div style={{ borderLeft: '3px solid #eee', paddingLeft: '1rem', margin: '1rem 0' }}>
                        <h4>Optional Details</h4>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Bio</label>
                            <textarea
                                style={{ width: '100%', padding: '0.5rem' }}
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    {!renderAllSteps && step > 1 && (
                        <button onClick={() => setStep(s => s - 1)} style={{ padding: '0.5rem 1rem' }}>Back</button>
                    )}

                    {!renderAllSteps && step < 2 && (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'hsl(var(--color-accent))',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}>
                            Next Step
                        </button>
                    )}

                    {(renderAllSteps || step === 2) && (
                        <button
                            onClick={handleCompletion}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'green',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}>
                            Complete Registration
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
