import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from '..'

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Operating mode', disabled: false },
  argTypes: { label: { control: 'text' }, disabled: { control: 'boolean' } },
  decorators: [(Story) => <div style={{ maxWidth: 260 }}><Story /></div>],
  render: (args) => (
    <Select {...args}>
      <option>Auto</option>
      <option>Manual</option>
      <option>Away</option>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
export const Playground: StoryObj<typeof meta> = {}
