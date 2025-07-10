'use client'

import { Battery, Bluetooth, Info, Lightbulb, PcCase } from 'lucide-react'
import React from 'react'
import { Badge } from '@lib/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card'
import { Skeleton } from '@lib/components/ui/skeleton'
import { Button } from '../ui/button'

interface DeviceInfoCardProps {
  stats?: {
    deviceName?: string
    batteryLevel?: number
    firmwareVersion?: string
  }
  light?: {
    mode: string
    modeValue: number
  }
  cycleLightMode?: () => void
  status: string
}

export function DeviceInfoCard({ stats, light, status, cycleLightMode }: DeviceInfoCardProps) {
  return (
    <Card className="w-full min-w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="h-5 w-5" />
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Name */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Device Name</span>
          </div>
          {stats?.deviceName ? (
            <span className="text-muted-foreground text-sm">{stats.deviceName}</span>
          ) : (
            <Skeleton className="h-4 w-24" />
          )}
        </div>

        {/* Battery Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Battery</span>
          </div>
          {stats?.batteryLevel !== undefined ? (
            <Badge variant={stats.batteryLevel > 20 ? 'default' : 'destructive'}>
              {stats.batteryLevel}%
            </Badge>
          ) : (
            <Skeleton className="h-5 w-12" />
          )}
        </div>

        {/* Firmware Version */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PcCase className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Firmware</span>
          </div>
          {stats?.firmwareVersion ? (
            <span className="text-muted-foreground font-mono text-sm">{stats.firmwareVersion}</span>
          ) : (
            <Skeleton className="h-4 w-16" />
          )}
        </div>

        {/* Light Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Light Mode</span>
          </div>
          {light?.mode ? (
            <Badge variant="outline">{light.mode}</Badge>
          ) : (
            <Skeleton className="h-5 w-20" />
          )}
        </div>
        <Button className="mt-4" onClick={cycleLightMode} disabled={status != 'connected'}>
          Cycle light mode
        </Button>
      </CardContent>
    </Card>
  )
}
