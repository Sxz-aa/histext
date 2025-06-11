
const EXPLORER_MAP = {
  ABIoT: 'https://explorer.ab.org',
  ABCore: 'https://explorer.core.ab.org',
  BSC: 'https://bscscan.com'
} as const;

type NetworkType = keyof typeof EXPLORER_MAP;

export function buildExplorerUrl(
  network: string,
  path = ''
): string | never {
  const typedNetwork = network as NetworkType;
  if (EXPLORER_MAP[typedNetwork]) {
    return `${EXPLORER_MAP[typedNetwork]}/${path.replace(/^\//, '')}`;
  }
  throw new Error(`Invalid network type: ${network}`);
}


// 使用示例
// buildExplorerUrl('BSC', 'address/0x123...') 
// → https://bscscan.com/address/0x123...
