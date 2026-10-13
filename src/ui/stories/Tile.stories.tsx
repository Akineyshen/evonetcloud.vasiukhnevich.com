import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tile } from '../Tile'
import { useApp } from '../../state/AppContext'

const meta = {
  title: 'Data/Tile',
  component: Tile,
  tags: ['autodocs'],
  args: { icon: 'thermo', label: '', value: '20.8', unit: '°C', tone: 'neutral' },
  argTypes: {
    icon: { control: 'select', options: ['thermo', 'wind', 'filterAir', 'power', 'alert', 'bolt', 'bypass', 'settings'] },
    label: { control: 'text', description: 'Empty = translated default' },
    value: { control: 'text' },
    unit: { control: 'text' },
    tone: { control: 'select', options: ['neutral', 'ok', 'warn', 'danger', 'info'] },
    progress: { control: { type: 'range', min: 0, max: 100 }, description: 'Shows a progress bar' },
    wide: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 280 }}><Story /></div>],
  render: function Render({ label, ...args }) {
    const { t } = useApp()
    return <Tile {...args} label={label || t('tile_supply')} />
  },
} satisfies Meta<typeof Tile>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithProgress: Story = { args: { icon: 'filterAir', value: '52', unit: '%', progress: 52, tone: 'warn' } }
export const Alarm: Story = { args: { icon: 'alert', value: '2', unit: '', tone: 'danger' } }
