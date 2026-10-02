import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { error: Error | null }

function isBenignDomError(error: Error) {
  return (
    error.name === 'NotFoundError' &&
    (error.message.includes('insertBefore') || error.message.includes('removeChild'))
  )
}

/** Swallows a subtree error so optional extras (HDR, etc.) cannot unmount the car. */
export class SoftBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {}

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export class ThreeErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    if (isBenignDomError(error)) return { error: null }
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isBenignDomError(error)) return
    console.error('3D scene error', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="model-loader">
            <div>
              <p className="kicker">Scene error</p>
              <h2 className="display" style={{ fontSize: 42, margin: '12px 0' }}>
                The LX 600 could not be drawn.
              </h2>
              <p style={{ color: 'var(--text-dim)' }}>{this.state.error.message}</p>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
