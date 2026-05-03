import type { PropsWithChildren } from 'react';

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main id="main-content" className="layout" role="main">
        <div className="panel">{children}</div>
      </main>
    </>
  );
}
