'use client'

import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@lib/components/ui/button'
import { DeviceInfoCard } from './device-info-card'
import { RadarThreatsTable } from './radar-threats-table'
import { useMageneL508 } from './use-magene-l508'

export function ConnectionManager() {
  const { status, connect, disconnect, cycleLightMode, radarResult, statsResult, lightResult } =
    useMageneL508()

  const prevStatusRef = useRef<string | null>(null)

  useEffect(() => {
    if (prevStatusRef.current) {
      if (prevStatusRef.current === 'connected' && status === 'disconnected') {
        toast.info('Device disconnected')
      } else if (prevStatusRef.current === 'connecting' && status === 'connected') {
        toast.success('Device connected successfully!')
      } else if (prevStatusRef.current === 'connecting' && status === 'disconnected') {
        toast.error('Failed to connect to device')
      }
    }
    prevStatusRef.current = status
  }, [status])

  const handleConnect = async () => {
    const result = await connect()

    if (!result.success) {
      console.log(result.error)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const handleButtonClick = () => {
    if (status === 'connected') {
      handleDisconnect()
    } else {
      handleConnect()
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting...'
      case 'connected':
        return 'Disconnect Radar'
      default:
        return 'Connect to Magene Radar'
    }
  }

  const getCardProps = () => {
    const stats = statsResult?.success ? statsResult.data : undefined
    const light = lightResult?.success ? lightResult.data : undefined
    return { stats, light, status, cycleLightMode }
  }

  const getRadarProps = () => {
    const targets = radarResult?.success ? radarResult.data : undefined
    return {
      targets,
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex w-full flex-col justify-center gap-4 lg:flex-row">
        <div className="kg:order-2 flex flex-col items-center gap-4">
          <div className="flex gap-4 lg:order-2">
            <Button onClick={handleButtonClick} disabled={status === 'connecting'}>
              {getButtonText()}
            </Button>
          </div>
          <DeviceInfoCard {...getCardProps()} />
        </div>
        <RadarThreatsTable {...getRadarProps()} />
      </div>
    </div>
  )
}
