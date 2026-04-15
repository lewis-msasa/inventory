import { Component,  useState } from 'react';
import React from 'react';
import type { ErrorInfo } from 'react';
import ErrorContainer from '../presentation/errors/components/ErrorContainer';

function withErrorBoundary(WrappedComponent : React.FC) {
  return function ErrorBoundary(props : any) {
    console.log("here as in heaven")
    const [error, setError] = useState<Error | null>(null);
  
    if (error) {
        console.log("we are in error")
        return  (<ErrorContainer error={error} />)          
    }
  
    try {
       
        return <WrappedComponent {...props} />;
    } catch (err: any) {
      console.log("we are in error", err)
      setError(err);
      return  (<ErrorContainer error={err} />)
    }
  }
}

export default withErrorBoundary;



interface Props {
    children?: React.ReactNode;
    fallback? : React.ReactNode
  }
  
  interface State {
    hasError: boolean;
    error? : Error;
  }  
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
      hasError: false

    };
  
    public static getDerivedStateFromError(error: Error): State {
      // Update state so the next render will show the fallback UI.
      console.log("ttthiiissss")
      return { hasError: true , error: error};
    }
  
    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Uncaught error:", error, errorInfo);
    }
  
    public render() {
      
      if (this.state.hasError) {
        const {fallback} = this.props
        return  fallback ? fallback : <h1>Sorry.. there was an error {this.state.error?.message}</h1>
      }
  
      return this.props.children;
    }
  }