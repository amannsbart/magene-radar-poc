import { LogoIcon } from '@lib/components/logo'

export function IconImage({ width, height }: { width: number; height: number }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        background: 'rgb(10, 10, 10)',
        borderRadius: '1rem',
      }}
    >
      <LogoIcon
        style={{
          width: width * 0.75,
          height: height * 0.75,
          color: 'rgb(250,250,250)',
        }}
      />
    </div>
  )
}
