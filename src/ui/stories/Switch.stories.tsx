import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Segmented, Switch } from '..'

const meta = {
  title: 'Form/Switch and Segmented',
  component: Switch,
  tags: ['autodocs'],
  args: { checked: true, label: 'Unit power', onChange: () => {} },
  argTypes: { checked: { control: 'boolean' }, label: { control: 'text', description: 'Accessible name' } },
  render: function Render(args) {
    const [on, setOn] = useState(args.checked)
    return <Switch {...args} checked={on} onChange={setOn} />
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const SwitchControl: Story = {}

export const SegmentedControl: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [v, setV] = useState('day')
    return (
      <Segmented
        value={v}
        onChange={setV}
        options={[{ value: 'day', label: 'Day' }, { value: 'month', label: 'Month' }]}
      />
    )
  },
}
