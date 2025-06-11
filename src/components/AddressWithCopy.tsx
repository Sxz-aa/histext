import Link from 'next/link';
import { useState } from 'react';

interface Props {
  address: string;
  linkPath: string;
  maxWidth?: number;
}

export default function AddressWithCopy({
  address,
  linkPath,
  maxWidth = 200
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 hover:bg-gray-100 rounded p-1">
      <Link 
        href={linkPath}
        // className="truncate font-mono text-sm hover:underline"
        // style={{ maxWidth: `${maxWidth}px` }}
      >
        {address}
      </Link>
      
      <button
        onClick={handleCopy}
        className="relative w-4 h-4 flex items-center justify-center"
        aria-label="复制地址"
      >
        {/* 前置矩形 */}
        <div className="absolute w-3 h-3 border border-gray-400 rounded-sm" />
        
        {/* 后置矩形（偏移效果） */}
        <div className="absolute w-3 h-3 border border-gray-400 rounded-sm 
                        transform translate-x-0.5 translate-y-0.5" />
        
        {/* 复制成功提示 */}
        {copied && (
          <span className="absolute -top-6 text-xs bg-black text-white px-2 py-1 rounded">
            已复制!
          </span>
        )}
      </button>
    </div>
  );
}
