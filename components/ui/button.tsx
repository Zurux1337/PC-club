import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#b7ff2c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]",
  {
    variants: {
      variant: {
        default:
          'bg-[#b7ff2c] text-[#000000] border border-[#b7ff2c] hover:bg-[#a8ef1f] hover:border-[#a8ef1f]',
        outline:
          'border border-[#b7ff2c] bg-transparent text-[#b7ff2c] hover:bg-[#b7ff2c]/10',
        ghost: 'bg-transparent text-[#f5f5f5] hover:bg-[#f5f5f5]/10',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-5 py-1.5 text-sm',
        lg: 'h-12 px-8 py-3 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
