import { encode } from 'gpt-3-encoder';

export function tokenCost(tokenCount: number) {
  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((tokenCount / 1000) * 0.002);
}


