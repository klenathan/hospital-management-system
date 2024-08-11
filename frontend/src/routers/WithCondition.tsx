import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";

/** A higher-order component with conditional routing logic
 * Component: FunctionComponent
 * condition: boolean
 * redirectTo: string
 */
export default function WithCondition(
  Component: FunctionComponent,
  condition: boolean,
  redirectTo: string
) {
  return function InnerComponent(props?: any) {
    return condition ? (
      <Component {...props} />
    ) : (
      <Navigate to={redirectTo} replace={true} />
    );
  };
}
