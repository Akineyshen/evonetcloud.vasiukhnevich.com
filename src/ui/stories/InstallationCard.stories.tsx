import type { Meta, StoryObj } from '@storybook/react-vite'
import { InstallationCard } from '../InstallationCard'
import { installations } from '../../data/mock'

const meta = {
  title: 'Data/Installation card',
  component: InstallationCard,
  tags: ['autodocs'],
  args: { installation: installations[0], favorite: false, onToggleFavorite: () => {}, onSelect: () => {} },
  argTypes: {
    favorite: { control: 'boolean' },
    installation: { control: 'object' },
    onToggleFavorite: { action: 'favorite toggled' },
    onSelect: { action: 'selected' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 340 }}><Story /></div>],
} satisfies Meta<typeof InstallationCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Favorite: Story = { args: { favorite: true } }
export const Alarm: Story = { args: { installation: installations[3] } }
export const Offline: Story = { args: { installation: installations[6] } }
