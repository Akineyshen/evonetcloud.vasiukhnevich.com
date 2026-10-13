import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '..'
import { Icon } from '../Icon'
import { useApp } from '../../state/AppContext'

const meta = {
  title: 'Form/Button',
  component: Button,
  tags: ['autodocs'],
  args: { variant: 'primary', size: 'md', disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'], description: 'Visual style' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    children: { control: 'text', description: 'Label. Empty = translated default' },
    onClick: { action: 'clicked' },
  },
  // Empty label falls back to the dictionary so the language switcher still works.
  render: function Render({ children, ...args }) {
    const { t } = useApp()
    return <Button {...args}>{children || t('save')}</Button>
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger' } }
export const Disabled: Story = { args: { disabled: true } }
export const Small: Story = { args: { size: 'sm' } }

export const WithIcon: Story = {
  render: function Render(args) {
    const { t } = useApp()
    return (
      <Button {...args}>
        <Icon name="star" size={18} /> {t('favorites')}
      </Button>
    )
  },
}

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
}
