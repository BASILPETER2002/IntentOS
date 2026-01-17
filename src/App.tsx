import { IntentProvider } from './engine/useIntentEngine';
import { SmartForm } from './components/SmartForm';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <IntentProvider>
      <div className="container">
        <header style={{ marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
          <h1>IntentOS Demo</h1>
          <p style={{ color: 'hsl(var(--color-text-secondary))' }}>
            Adaptive Intent-Driven Application System
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          <SmartForm />
          <Dashboard />
        </div>
      </div>
    </IntentProvider>
  )
}

export default App
