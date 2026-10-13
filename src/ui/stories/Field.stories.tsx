import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from '..'
import { useApp } from '../../state/AppContext'

const meta = {
  title: 'Form/Input',
  component: Field,
  tags: ['autodocs'],
  args: { label: '', type: 'text', placeholder: '', disabled: false },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel'] },
    label: { control: 'text', description: 'Empty = translated default' },
    hint: { control: 'text' },
    error: { control: 'text', description: 'Shows the error state when set' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
  render: function Render({ label, ...args }) {
    const { t } = useApp()
    return <Field {...args} label={label || t('email')} />
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const WithHint: Story = { args: { hint: 'We never share your email' } }
export const WithError: Story = { args: { error: 'Enter a valid email', defaultValue: 'oops' } }
export const Password: Story = { args: { label: 'Password', type: 'password' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'locked@example.com' } }
