import { SVGProps } from 'react'
import { APP_NAME, APP_VERSION } from '@config/index'

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" {...props}>
      <defs>
        <radialGradient id="logoGradient" cx="50%" cy="50%" r="43%">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="80%" stopColor="currentColor" stopOpacity="0.80" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={30} cy={30} r={20} fill="none" stroke="url(#logoGradient)" strokeWidth={20} />
    </svg>
  )
}

function LogoHeader() {
  return (
    <div className="flex items-baseline gap-1.5">
      <div className="text-md font-semibold">{APP_NAME}</div>
      <div>{APP_VERSION}</div>
    </div>
  )
}

export function Logo() {
  return (
    <div className="flex items-center gap-1">
      <LogoIcon className="size-12" />
      <LogoHeader />
    </div>
  )
}
