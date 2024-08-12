import { useContext } from 'react'
import { UserContext } from '../hooks/Auth/UserContext'
import WithCondition from './WithCondition'

/** Check logged in router
 * Component : React.Function Component
 */
export const WithLoggedIn = (Component: React.FunctionComponent) =>
  WithCondition(Component, useContext(UserContext).loggedIn, '/')

/** The inverse, showing a page only if a user is logged OUT */
export const WithLoggedOut = (Component: React.FunctionComponent) =>
  WithCondition(Component, !useContext(UserContext).loggedIn, '/')
