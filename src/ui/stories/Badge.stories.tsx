import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '..'
import { useApp } from '../../state/AppContext'

const meta = {
  title: 'Data/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { tone: 'ok', children: '' },
  argTypes: {
    tone: { control: 'select', options: ['ok', 'warn', 'danger', 'info', 'neutral'] },
    children: { control: 'text', description: 'Empty = translated default' },
  },
  render: function Render({ children, ...args }) {
    const { t } = useApp()
    return <Badge {...args}>{children || t('conn_online')}</Badge>
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const AllTones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['ok', 'warn', 'danger', 'info', 'neutral'] as const).map((tone) => <Badge key={tone} tone={tone}>{tone}</Badge>)}
    </div>
  ),
}
