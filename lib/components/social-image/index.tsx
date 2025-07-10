import { APP_NAME } from '@config/index'
import { LogoIcon } from '@lib/components/logo'

export function SocialImage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgb(0,0,10)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', color: 'rgb(250, 250, 250)' }}>
        <div style={{ display: 'flex', marginRight: '1rem' }}>
          <LogoIcon />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '3.75rem', fontFamily: 'Geist Sans', color: 'rgb(161,161,161)' }}>
            {APP_NAME}
          </div>
        </div>
      </div>
    </div>
  )
}
