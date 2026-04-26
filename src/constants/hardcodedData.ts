import { Committee } from '../types';

export const HARDCODED_CATEGORIES: Record<string, Partial<Committee>> = {
  'unsc': {
    description: 'United Nations Security Council: Maintaining international peace and security.',
  },
  'unhrc': {
    description: 'United Nations Human Rights Council: Strengthening the promotion and protection of human rights around the globe.',
  },
  'ecofin': {
    description: 'Economic and Financial Committee: Dealing with global economic and financial issues.',
  },
  'disec': {
    description: 'Disarmament and International Security Committee: Handling matters of international importance regarding security and disarmament.',
  }
};
