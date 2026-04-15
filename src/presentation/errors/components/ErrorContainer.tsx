
type ErrorContainerProps = {
    error : Error 
  };


  
  const ErrorContainer : React.FC<ErrorContainerProps> = (props: ErrorContainerProps) => { 
    return (
      <div>        
        <p className="text-red-600">{props.error.message}</p>  
      </div>
    );
  };

  export default ErrorContainer;


  export const BreakThings :  React.FC = () => {
    throw new Error("We intentionally broke something");
    };

 

    interface Props {
        children?: React.ReactNode;
      }
      
      interface State {
        hasError: boolean;
      }
      

      
    
        




 