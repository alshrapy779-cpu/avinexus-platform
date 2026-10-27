import React from 'react';

type Props = { children: React.ReactNode };
type State = { failed: boolean; message: string };

export class Office360ErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { failed: true, message: error.message || 'Unknown rendering error' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[AviNexus Office360] rendering failure', error, info.componentStack);
  }

  render(): React.ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <section dir="rtl" role="alert" style={{
        padding: 24, border: '1px solid #dc6b6b',
        borderRadius: 12, background: '#10252a', color: '#fff'
      }}>
        <h3>تعذر عرض مساحة المكتب</h3>
        <p>حدث خطأ في عرض Office 360. بقية أقسام المنصة لم تتأثر.</p>
        <p style={{overflowWrap:'anywhere'}}>{this.state.message}</p>
        <button type="button" onClick={() => this.setState({failed:false,message:''})}>
          إعادة المحاولة
        </button>
      </section>
    );
  }
}
