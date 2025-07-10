'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { BaseError } from '@lib/errors'

// Type definitions
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

type DeviceStats = {
  deviceName: string
  batteryLevel: number
  firmwareVersion: string
}
type LightMode =
  | 'Solid'
  | 'Flashing'
  | 'Pulse'
  | 'Peloton'
  | 'Rotation'
  | 'Quick Flash'
  | 'Radar only'

type LightData = {
  mode: LightMode
  modeValue: number // 0-6
}

type RadarTarget = {
  id: number // 1-8 (1-4 for page A, 5-8 for page B)
  threatLevel: number // 0: No Threat, 1: Vehicle Approach, 2: Vehicle Fast Approach, 3: Reserved
  threatSide: number // 0: No Side, 1: Left, 2: Right, 3: Reserved
  range: number // meters (0-196.875m)
  speed: number // m/s (0-45.6m/s)
}

type RadarData = {
  page: 0x30 | 0x31
  targets: RadarTarget[]
}
type LightResult = Result<LightData, BaseError>
type StatsResult = Result<DeviceStats, BaseError>
type ConnectionResult = Result<void, BaseError>
type RadarResult = Result<RadarData, BaseError>

class ConnectionError extends BaseError {
  readonly type = 'connection' as const
}

class ValidationError extends BaseError {
  readonly type = 'validation' as const
}

class LightError extends BaseError {
  readonly type = 'light' as const
}

class RadarError extends BaseError {
  readonly type = 'radar' as const
}

// Constants
const DEVICE_INFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb'
const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb'
const DEVICE_NAME_SERVICE = '00001800-0000-1000-8000-00805f9b34fb'
const RADARLIGHT_SERVICE = '8ce5cc01-0a4d-11e9-ab14-d663bd873d93'
const DEVICE_NAME_CHARACTERISTIC = '00002a00-0000-1000-8000-00805f9b34fb'
const FIRMWARE_VERSION_CHARACTERISTIC = '00002a26-0000-1000-8000-00805f9b34fb'
const MANUFACTURER_CHARACTERISTIC = '00002a29-0000-1000-8000-00805f9b34fb'
const MODEL_CHARACTERISTIC = '00002a24-0000-1000-8000-00805f9b34fb'
const BATTERY_LEVEL_CHARACTERISTIC = '00002a19-0000-1000-8000-00805f9b34fb'
const RADARLIGHT_CHARACTERISTIC = '8ce5cc02-0a4d-11e9-ab14-d663bd873d93'
const RADAR_MAGIC_BYTES = new Uint8Array([0x57, 0x09, 0x01])
const LIGHT_MAGIC_BYTES = new Uint8Array([0x57, 0x0a, 0x00])
const ANT_RADAR_IDENTIFIER_PAGE_1 = new Uint8Array([0x57, 0x09, 0x00, 0x30])
const ANT_RADAR_IDENTIFIER_PAGE_2 = new Uint8Array([0x57, 0x09, 0x00, 0x30])
const ANT_MANUFACTURER_INFORMATION_IDENTIFIER = new Uint8Array([0x57, 0x09, 0x00, 0x50])
const ANT_PRODUCT_INFORMATION_IDENTIFIER = new Uint8Array([0x57, 0x09, 0x00, 0x51])
const ANT_BATTERY_INFORMATION_IDENTIFIER = new Uint8Array([0x57, 0x09, 0x00, 0x52])
const LIGHT_IDENTIFIER = new Uint8Array([0x57, 0x0a])

const EXPECTED_MANUFACTURER = 'Qingdao Magene Intelligence Technology Co., Ltd'
const EXPECTED_MODEL = '320'
const LIGHT_MODES: Record<number, LightMode> = {
  0x00: 'Solid',
  0x01: 'Flashing',
  0x02: 'Pulse',
  0x03: 'Peloton',
  0x04: 'Rotation',
  0x05: 'Quick Flash',
  0x06: 'Radar only',
}

// Radar parsing constants
const RANGE_UNIT = 3.125 // meters
const SPEED_UNIT = 3.04 // m/s

// Utility functions
function startsWith(value: DataView<ArrayBufferLike>, identifier: Uint8Array): boolean {
  if (value.byteLength < identifier.length) return false
  for (let i = 0; i < identifier.length; i++) {
    if (value.getUint8(i) !== identifier[i]) return false
  }
  return true
}

function getBytesAsHex(dataView: DataView, start: number = 0, length?: number): string {
  const end = length ? start + length : dataView.byteLength
  const hexBytes: string[] = []

  for (let i = start; i < end; i++) {
    const byte = dataView.getUint8(i)
    hexBytes.push(byte.toString(16).padStart(2, '0').toUpperCase())
  }

  return hexBytes.join(' ')
}

function extractBits(byte: number, startBit: number, length: number): number {
  const mask = (1 << length) - 1
  return (byte >> startBit) & mask
}

function parseLightData(value: DataView): LightData {
  if (value.byteLength < 6 || !startsWith(value, LIGHT_IDENTIFIER)) {
    throw new LightError('Error parsing LightData: Incorrect format or identifier')
  }

  const modeValue = value.getUint8(3)

  if (modeValue < 0x00 || modeValue > 0x06) {
    throw new LightError('Error parsing LightData: Unknown mode')
  }

  const mode = LIGHT_MODES[modeValue]

  return {
    mode,
    modeValue,
  }
}

function parseRadarData(value: DataView): RadarData {
  // Validate radar data header (0x57, 0x09, 0x00)
  if (value.byteLength < 4) {
    throw new RadarError('Error parsing radar data: malformed data')
  }

  // Validate page number
  const page = value.getUint8(3)
  if (page !== 0x30 && page !== 0x31) {
    throw new RadarError('Error parsing radar data: Unknown page')
  }

  // Extract target data from remaining bytes
  const data = value.buffer.slice(4)
  const bytes = new Uint8Array(data)

  if (bytes.length < 7) {
    return { page, targets: [] }
  }

  // Base target ID offset (1-4 for page A, 5-8 for page B)
  const baseTargetId = page === 0x30 ? 1 : 5

  // Threat Level (2 bits per target) in byte 1 - MSB first
  const threatLevels = [
    extractBits(bytes[1], 6, 2), // Target 1 - bits 6-7 (MSB)
    extractBits(bytes[1], 4, 2), // Target 2 - bits 4-5
    extractBits(bytes[1], 2, 2), // Target 3 - bits 2-3
    extractBits(bytes[1], 0, 2), // Target 4 - bits 0-1 (LSB)
  ]

  // Threat Side (2 bits per target) in byte 2 - MSB first
  const threatSides = [
    extractBits(bytes[2], 6, 2), // Target 1 - bits 6-7 (MSB)
    extractBits(bytes[2], 4, 2), // Target 2 - bits 4-5
    extractBits(bytes[2], 2, 2), // Target 3 - bits 2-3
    extractBits(bytes[2], 0, 2), // Target 4 - bits 0-1 (LSB)
  ]

  // Range (6 bits per target) packed in bytes 3-5 - MSB first
  const rangeBits = (bytes[3] << 16) | (bytes[4] << 8) | bytes[5]
  const ranges = [
    extractBits(rangeBits, 18, 6), // Target 1 - bits 23-18
    extractBits(rangeBits, 12, 6), // Target 2 - bits 17-12
    extractBits(rangeBits, 6, 6), // Target 3 - bits 11-6
    extractBits(rangeBits, 0, 6), // Target 4 - bits 5-0
  ].map((r) => r * RANGE_UNIT)

  // Speed (4 bits per target) packed in bytes 6-7 - MSB first
  const speedBits = (bytes[6] << 8) | bytes[7]
  const speeds = [
    extractBits(speedBits, 12, 4), // Target 1 - bits 15-12
    extractBits(speedBits, 8, 4), // Target 2 - bits 11-8
    extractBits(speedBits, 4, 4), // Target 3 - bits 7-4
    extractBits(speedBits, 0, 4), // Target 4 - bits 3-0
  ].map((s) => s * SPEED_UNIT)

  // Build target objects
  const targets = threatLevels.map((threatLevel, i) => ({
    id: baseTargetId + i,
    threatLevel,
    threatSide: threatSides[i],
    range: threatLevel !== 0 ? ranges[i] : 0,
    speed: threatLevel !== 0 ? speeds[i] : 0,
  }))
  return { page, targets }
}

async function readCharacteristic(
  service: BluetoothRemoteGATTService,
  characteristicUUID: string,
  decoder: TextDecoder
) {
  const characteristic = await service.getCharacteristic(characteristicUUID)
  const value = await characteristic.readValue()
  return decoder.decode(new Uint8Array(value.buffer))
}

async function validateDevice(service: BluetoothRemoteGATTService, decoder: TextDecoder) {
  const manufacturerCharacteristic = await service.getCharacteristic(MANUFACTURER_CHARACTERISTIC)
  const modelCharacteristic = await service.getCharacteristic(MODEL_CHARACTERISTIC)
  const manufacturerValue = await manufacturerCharacteristic.readValue()
  const modelValue = await modelCharacteristic.readValue()

  const manufacturer = decoder.decode(new Uint8Array(manufacturerValue.buffer))
  const model = decoder.decode(new Uint8Array(modelValue.buffer)).trim()

  if (manufacturer !== EXPECTED_MANUFACTURER) {
    throw new ValidationError(`Error validating device: Unexpected Manufacturer (${manufacturer})`)
  }

  if (model !== EXPECTED_MODEL) {
    throw new ValidationError(`Error validating device: Unexpected Model (${model})`)
  }
}

export function useMageneL508() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [statsResult, setStatsResult] = useState<StatsResult | null>(null)
  const [lightResult, setLightResult] = useState<LightResult | null>(null)
  const [radarResult, setRadarResult] = useState<RadarResult | null>(null)

  const deviceRef = useRef<BluetoothDevice | null>(null)
  const serverRef = useRef<BluetoothRemoteGATTServer | null>(null)
  const serviceRef = useRef<BluetoothRemoteGATTService | null>(null)
  const batteryCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const radarLightCharacteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null)
  const mountedRef = useRef(true)

  const decoder = useMemo(() => new TextDecoder('utf-8'), [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (batteryCharacteristicRef.current) {
        try {
          batteryCharacteristicRef.current.stopNotifications()
        } catch {}
      }
      if (radarLightCharacteristicRef.current) {
        try {
          radarLightCharacteristicRef.current.stopNotifications()
        } catch {}
      }
      if (serverRef.current) {
        serverRef.current.disconnect()
      }
    }
  }, [])

  const handleBatteryLevelChange = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const newBatteryLevel = target.value?.getUint8(0)

    if (newBatteryLevel !== undefined && mountedRef.current) {
      setStatsResult((prevResult) => {
        if (prevResult?.success) {
          return { success: true, data: { ...prevResult.data, batteryLevel: newBatteryLevel } }
        }
        return prevResult
      })
    }
  }, [])

  const handleRadarLightNotification = useCallback((event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const value = target.value
    if (!value) return

    console.warn('🔍 Debugging notification data received:')
    console.log('Full hex data:', getBytesAsHex(value))

    if (
      startsWith(value, ANT_RADAR_IDENTIFIER_PAGE_1) ||
      startsWith(value, ANT_RADAR_IDENTIFIER_PAGE_2)
    ) {
      try {
        const radarData = parseRadarData(value)
        setRadarResult({ success: true, data: radarData })
      } catch (error) {
        if (error instanceof RadarError) {
          setRadarResult({ success: false, error })
          return
        }

        setRadarResult({
          success: false,
          error: new RadarError('Error parsing radar data', {
            cause: error,
          }),
        })
        return
      }
    } else if (startsWith(value, LIGHT_IDENTIFIER)) {
      try {
        const lightData = parseLightData(value)
        setLightResult({ success: true, data: lightData })
      } catch (error) {
        if (error instanceof LightError) {
          setLightResult({ success: false, error })
          return
        }

        setLightResult({
          success: false,
          error: new LightError('Error parsing light data', {
            cause: error,
          }),
        })

        return
      }
    } else if (
      startsWith(value, ANT_MANUFACTURER_INFORMATION_IDENTIFIER) ||
      ANT_PRODUCT_INFORMATION_IDENTIFIER ||
      ANT_BATTERY_INFORMATION_IDENTIFIER
    ) {
      return // Not sure if feasable to implement - limited/duplicate information (Ant+ Common Pages 80,81,82)
    } else {
      console.warn('🔍 Unknown notification data received:')
      console.log('Full hex data:', getBytesAsHex(value))
      console.log('Data length:', value.byteLength, 'bytes')
    }
  }, [])

  const handleDisconnect = useCallback(() => {
    if (mountedRef.current) {
      setStatus('disconnected')
      setStatsResult(null)
      setRadarResult(null)
      setLightResult(null)
    }
    deviceRef.current = null
    serverRef.current = null
    serviceRef.current = null
    batteryCharacteristicRef.current = null
    radarLightCharacteristicRef.current = null
  }, [])

  const connect = useCallback(async (): Promise<ConnectionResult> => {
    try {
      if (!mountedRef.current) {
        throw new ConnectionError('Component not mounted yet - can not connect')
      }

      setStatus('connecting')

      if (typeof navigator === 'undefined' || !navigator.bluetooth) {
        setStatus('disconnected')
        throw new ConnectionError('Web Bluetooth API is not available in this environment')
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [DEVICE_INFO_SERVICE] }],
        optionalServices: [
          DEVICE_INFO_SERVICE,
          DEVICE_NAME_SERVICE,
          BATTERY_SERVICE,
          RADARLIGHT_SERVICE,
        ],
      })

      if (!device.gatt) {
        setStatus('disconnected')
        throw new ConnectionError('Bluetooth Device does not support GATT')
      }

      const server = await device.gatt.connect()

      if (!server.connected) {
        throw new ConnectionError('Could not connect to GATT Server')
      }

      const deviceInfoService = await server.getPrimaryService(DEVICE_INFO_SERVICE)
      const deviceNameService = await server.getPrimaryService(DEVICE_NAME_SERVICE)
      await deviceInfoService.getCharacteristic(MODEL_CHARACTERISTIC)

      await validateDevice(deviceInfoService, decoder)
      device.addEventListener('gattserverdisconnected', handleDisconnect)

      deviceRef.current = device
      serverRef.current = server
      serviceRef.current = deviceInfoService

      setStatus('connected')

      const deviceName = await readCharacteristic(
        deviceNameService,
        DEVICE_NAME_CHARACTERISTIC,
        decoder
      )
      const firmwareVersion = await readCharacteristic(
        deviceInfoService,
        FIRMWARE_VERSION_CHARACTERISTIC,
        decoder
      )

      const batteryService = await server.getPrimaryService(BATTERY_SERVICE)
      const batteryLevelCharacteristic = await batteryService.getCharacteristic(
        BATTERY_LEVEL_CHARACTERISTIC
      )

      const batteryLevelValue = await batteryLevelCharacteristic.readValue()
      const batteryLevel = batteryLevelValue.getUint8(0)

      await batteryLevelCharacteristic.startNotifications()
      batteryLevelCharacteristic.addEventListener(
        'characteristicvaluechanged',
        handleBatteryLevelChange
      )

      batteryCharacteristicRef.current = batteryLevelCharacteristic

      setStatsResult({
        success: true,
        data: { deviceName, firmwareVersion, batteryLevel },
      })

      const radarLightService = await server.getPrimaryService(RADARLIGHT_SERVICE)
      const radarLightCharacteristic =
        await radarLightService.getCharacteristic(RADARLIGHT_CHARACTERISTIC)

      await radarLightCharacteristic.startNotifications()

      radarLightCharacteristic.addEventListener(
        'characteristicvaluechanged',
        handleRadarLightNotification
      )

      radarLightCharacteristicRef.current = radarLightCharacteristic
      await radarLightCharacteristic.writeValue(LIGHT_MAGIC_BYTES)
      await new Promise((resolve) => setTimeout(resolve, 500))
      await radarLightCharacteristic.writeValue(RADAR_MAGIC_BYTES)

      return { success: true, data: undefined }
    } catch (error) {
      if (mountedRef.current) {
        setStatus('disconnected')
      }

      if (error instanceof BaseError) {
        return { success: false, error: error }
      }
      return {
        success: false,
        error: new ConnectionError('Error connecting to bluetooth device', { cause: error }),
      }
    }
  }, [handleDisconnect, handleBatteryLevelChange, decoder, handleRadarLightNotification])

  const disconnect = useCallback(async () => {
    if (serverRef.current) {
      if (batteryCharacteristicRef.current) {
        try {
          batteryCharacteristicRef.current.removeEventListener(
            'characteristicvaluechanged',
            handleBatteryLevelChange
          )
          await batteryCharacteristicRef.current.stopNotifications()
        } catch {}
      }

      if (radarLightCharacteristicRef.current) {
        try {
          radarLightCharacteristicRef.current.removeEventListener(
            'characteristicvaluechanged',
            handleRadarLightNotification
          )
          await radarLightCharacteristicRef.current.stopNotifications()
        } catch {}
      }

      serverRef.current.disconnect()
      handleDisconnect()
    }
  }, [handleDisconnect, handleBatteryLevelChange, handleRadarLightNotification])

  const cycleLightMode = useCallback(async (): Promise<Result<void, BaseError>> => {
    try {
      const nextMode = new Uint8Array([...LIGHT_IDENTIFIER, 0x01])
      if (!radarLightCharacteristicRef.current) {
        throw new ConnectionError('Could not access characteristic')
      }

      await radarLightCharacteristicRef.current.writeValue(nextMode)

      return { success: true, data: undefined }
    } catch (error) {
      if (error instanceof BaseError) {
        return { success: false, error: error }
      }
      return { success: false, error: new LightError('Error cycling light mode', { cause: error }) }
    }
  }, [])

  return {
    status,
    statsResult,
    lightResult,
    radarResult,
    connect,
    disconnect,
    cycleLightMode,
  }
}
