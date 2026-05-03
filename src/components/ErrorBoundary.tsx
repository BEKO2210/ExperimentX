import { Component, type ReactNode } from 'react';
import { clearSession } from '../domain/sessionStore';

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error): void {
    console.error('ExperimentX runtime error:', error);
  }

  private handleReset = () => {
    clearSession();
    localStorage.clear();
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main style={{ maxWidth: 760, margin: '2rem auto', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
          <h1>ExperimentX — Recovery Mode</h1>
          <p>The app encountered a runtime error and stopped rendering.</p>
          <p><strong>Details:</strong> {this.state.message ?? 'Unknown error'}</p>
          <p>You can clear local session data and reload:</p>
          <button onClick={this.handleReset}>Clear local data and reload</button>
        </main>
      );
    }

    return this.props.children;
  }
}
