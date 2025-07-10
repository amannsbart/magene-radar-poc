'use client'

import { Radar } from 'lucide-react'
import React from 'react'
import { Badge } from '@lib/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card'
import { Skeleton } from '@lib/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lib/components/ui/table'

interface RadarTarget {
  id: number
  threatLevel: number
  threatSide: number
  range: number
  speed: number
}

interface RadarThreatsTableProps {
  targets?: RadarTarget[]
}

export function RadarThreatsTable({ targets }: RadarThreatsTableProps) {
  const TOTAL_ROWS = 8

  // Helper functions
  const getThreatLevelBadge = (level: number) => {
    const levels = {
      0: { label: 'No Threat', variant: 'secondary' as const },
      1: { label: 'Vehicle Approach', variant: 'default' as const },
      2: { label: 'Fast Approach', variant: 'destructive' as const },
      3: { label: 'Reserved', variant: 'outline' as const },
    }
    const threat = levels[level as keyof typeof levels] || levels[0]
    return <Badge variant={threat.variant}>{threat.label}</Badge>
  }

  const getThreatSide = (side: number) => {
    const sides = { 0: 'No Side', 1: 'Left', 2: 'Right', 3: 'Reserved' }
    return sides[side as keyof typeof sides] || 'Unknown'
  }

  // Create array of exactly 8 items (targets + nulls for empty slots)
  const tableData = Array.from({ length: TOTAL_ROWS }, (_, index) => targets?.[index] || null)

  return (
    <Card className="min-w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="h-5 w-5" />
          Radar Threats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target ID</TableHead>
                <TableHead>Threat Level</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Range (m)</TableHead>
                <TableHead>Speed (m/s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((target, index) => {
                const hasData = target !== null

                return (
                  <TableRow key={hasData ? target!.id : `skeleton-${index}`}>
                    <TableCell className="font-medium">
                      {hasData ? target!.id : <Skeleton className="h-4 w-8" />}
                    </TableCell>
                    <TableCell>
                      {hasData ? (
                        getThreatLevelBadge(target!.threatLevel)
                      ) : (
                        <Skeleton className="h-6 w-24" />
                      )}
                    </TableCell>
                    <TableCell>
                      {hasData ? (
                        getThreatSide(target!.threatSide)
                      ) : (
                        <Skeleton className="h-4 w-12" />
                      )}
                    </TableCell>
                    <TableCell>
                      {hasData ? (
                        target!.threatLevel > 0 ? (
                          target!.range.toFixed(1)
                        ) : (
                          '-'
                        )
                      ) : (
                        <Skeleton className="h-4 w-16" />
                      )}
                    </TableCell>
                    <TableCell>
                      {hasData ? (
                        target!.threatLevel > 0 ? (
                          target!.speed.toFixed(1)
                        ) : (
                          '-'
                        )
                      ) : (
                        <Skeleton className="h-4 w-16" />
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
