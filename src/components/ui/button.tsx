import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-mono text-sm font-bold uppercase tracking-widest transition-colors duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:     'bg-black text-white border border-black hover:bg-white hover:text-black',
        outline:     'bg-white text-black border border-black hover:bg-black hover:text-white',
        ghost:       'bg-transparent text-black hover:bg-gray-100',
        destructive: 'bg-black text-white border border-black hover:bg-gray-800',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm:      'h-8 px-3 text-xs',
        lg:      'h-12 px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
