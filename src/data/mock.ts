import type { TKey } from '../i18n'

export type InstState = 'running' | 'standby' | 'alarm'
export type Connection = 'online' | 'weak' | 'offline'

export interface Installation {
  id: string
  name: string
  serial: string
  address: string
  state: InstState
  connection: Connection
}

export const installations: Installation[] = [
  { id: 'inst-1', name: 'Villa Kowalski', serial: '1005728453', address: 'ul. Lipowa 12, Kraków', state: 'running', connection: 'online' },
  { id: 'inst-2', name: 'Office Park A', serial: '1005728454', address: 'al. Jerozolimskie 100, Warszawa', state: 'running', connection: 'online' },
  { id: 'inst-3', name: 'Apartment 14B', serial: '1005731120', address: 'ul. Piotrkowska 45, Łódź', state: 'standby', connection: 'weak' },
  { id: 'inst-4', name: 'School No. 5', serial: '1005740007', address: 'ul. Szkolna 3, Poznań', state: 'alarm', connection: 'online' },
  { id: 'inst-5', name: 'Warehouse North', serial: '1005742981', address: 'ul. Portowa 8, Gdańsk', state: 'running', connection: 'weak' },
  { id: 'inst-6', name: 'Family House Nowak', serial: '1005745512', address: 'ul. Słoneczna 27, Wrocław', state: 'standby', connection: 'offline' },
  { id: 'inst-7', name: 'Clinic Zdrowie', serial: '1005749870', address: 'ul. Zielona 61, Lublin', state: 'alarm', connection: 'offline' },
  { id: 'inst-8', name: 'Restaurant Smak', serial: '1005752304', address: 'Rynek 5, Rzeszów', state: 'running', connection: 'online' },
  { id: 'inst-9', name: 'Townhouse 7', serial: '1005755661', address: 'ul. Leśna 9, Katowice', state: 'standby', connection: 'online' },
]

/** The demo has one real installation: every card opens the same dashboard. */
export const deviceData = {
  outdoor: -2.4,
  supply: 20.8,
  extract: 22.1,
  exhaust: 4.3,
  filterSupply: 38,
  filterExtract: 52,
  airflowSupply: 185,
  airflowExtract: 172,
  energyToday: 6.4,
}

const hours = Array.from({ length: 24 }, (_, i) => i)
export const temperatureSeriesDay = hours.map((h) => ({
  label: `${String(h).padStart(2, '0')}:00`,
  outdoor: +(-3 + 6 * Math.sin(((h - 9) / 24) * Math.PI * 2) + (h % 3) * 0.2).toFixed(1),
  supply: +(20.5 + 0.8 * Math.sin(h / 3)).toFixed(1),
  extract: +(22 + 0.5 * Math.cos(h / 4)).toFixed(1),
}))

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const energySeriesWeek = weekdays.map((d, i) => ({
  label: d,
  energy: [7.2, 6.8, 7.9, 6.1, 5.4, 4.8, 6.4][i],
  recovered: [21.5, 20.1, 23.4, 18.9, 16.2, 14.7, 19.3][i],
}))

const days = Array.from({ length: 30 }, (_, i) => i + 1)
export const temperatureSeriesMonth = days.map((d) => ({
  label: `${d}`,
  outdoor: +(2 + 5 * Math.sin(d / 4)).toFixed(1),
  supply: +(20.5 + 0.6 * Math.sin(d / 2)).toFixed(1),
  extract: +(22 + 0.4 * Math.cos(d / 3)).toFixed(1),
}))
export const energySeriesMonth = days.map((d) => ({
  label: `${d}`,
  energy: +(5 + 2.5 * Math.abs(Math.sin(d / 3))).toFixed(1),
  recovered: +(15 + 7 * Math.abs(Math.sin(d / 3))).toFixed(1),
}))

export type Severity = 'info' | 'warning' | 'error'

export interface AppNotification {
  id: string
  severity: Severity
  title: TKey
  body: TKey
  time: string
}

export const notifications: AppNotification[] = [
  { id: 'n1', severity: 'error', title: 'n_overheat_t', body: 'n_overheat_b', time: '2026-10-13T08:12:00' },
  { id: 'n2', severity: 'warning', title: 'n_filter_t', body: 'n_filter_b', time: '2026-10-13T06:40:00' },
  { id: 'n3', severity: 'info', title: 'n_fw_t', body: 'n_fw_b', time: '2026-10-12T21:05:00' },
  { id: 'n4', severity: 'warning', title: 'n_signal_t', body: 'n_signal_b', time: '2026-10-12T14:30:00' },
  { id: 'n5', severity: 'info', title: 'n_schedule_t', body: 'n_schedule_b', time: '2026-10-11T19:00:00' },
  { id: 'n6', severity: 'error', title: 'n_fan_t', body: 'n_fan_b', time: '2026-10-10T03:22:00' },
  { id: 'n7', severity: 'info', title: 'n_report_t', body: 'n_report_b', time: '2026-10-09T09:00:00' },
  { id: 'n8', severity: 'warning', title: 'n_frost_t', body: 'n_frost_b', time: '2026-10-08T05:15:00' },
]

export type ParamControl =
  | { kind: 'switch'; value: boolean }
  | { kind: 'number'; value: number; unit: string; min: number; max: number }
  | { kind: 'select'; value: string; options: string[] }
  | { kind: 'readonly'; value: string }

export type ParamGroup = 'general' | 'ventilation' | 'temperature' | 'filters' | 'network'

export interface Param {
  id: string
  group: ParamGroup
  label: TKey
  control: ParamControl
}

export const paramGroups: ParamGroup[] = ['general', 'ventilation', 'temperature', 'filters', 'network']

export const params: Param[] = [
  { id: 'p1', group: 'general', label: 'p_power', control: { kind: 'switch', value: true } },
  { id: 'p2', group: 'general', label: 'p_mode', control: { kind: 'select', value: 'Auto', options: ['Auto', 'Manual', 'Away', 'Party'] } },
  { id: 'p3', group: 'general', label: 'p_model', control: { kind: 'readonly', value: 'ecoVENT MINI OEM 3.4' } },
  { id: 'p4', group: 'general', label: 'p_fw', control: { kind: 'readonly', value: 'v3.4.12' } },
  { id: 'p5', group: 'ventilation', label: 'p_speed_supply', control: { kind: 'number', value: 60, unit: '%', min: 10, max: 100 } },
  { id: 'p6', group: 'ventilation', label: 'p_speed_extract', control: { kind: 'number', value: 58, unit: '%', min: 10, max: 100 } },
  { id: 'p7', group: 'ventilation', label: 'p_boost', control: { kind: 'switch', value: false } },
  { id: 'p8', group: 'temperature', label: 'p_target', control: { kind: 'number', value: 21, unit: '°C', min: 15, max: 28 } },
  { id: 'p9', group: 'temperature', label: 'p_bypass', control: { kind: 'select', value: 'Auto', options: ['Auto', 'Open', 'Closed'] } },
  { id: 'p10', group: 'temperature', label: 'p_heater', control: { kind: 'switch', value: true } },
  { id: 'p11', group: 'filters', label: 'p_filter_interval', control: { kind: 'number', value: 180, unit: 'd', min: 30, max: 365 } },
  { id: 'p12', group: 'filters', label: 'p_filter_reset', control: { kind: 'switch', value: false } },
  { id: 'p13', group: 'network', label: 'p_wifi', control: { kind: 'readonly', value: 'Home-5G (-58 dBm)' } },
  { id: 'p14', group: 'network', label: 'p_cloud', control: { kind: 'switch', value: true } },
]
