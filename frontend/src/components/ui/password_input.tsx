import { EyeIcon, EyeOffIcon } from 'lucide-react'
import * as React from 'react'
import { Input } from './input'

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  return (
    <Input
      className={className}
      {...props}
      ref={ref}
      type={showPassword ? 'type' : 'password'}
      suffix={
        showPassword ? (
          <EyeIcon className={'select-none w-5 h-5'} onClick={() => setShowPassword(false)} />
        ) : (
          <EyeOffIcon className='select-none w-5 h-5' onClick={() => setShowPassword(true)} />
        )
      }
    />
  )
})
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
