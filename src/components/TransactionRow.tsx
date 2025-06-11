
import Link from 'next/link';

interface TransactionItem {
  source_tx_hash: string;
}

interface Props {
  item: TransactionItem;
}

function TransactionRow({ item }: Props) {
  if (!item?.source_tx_hash) {
    return <td className="text-red-500">Invalid hash</td>;
  }

  return (
    <td className="max-w-[160px]">
      <Link
        href={`/tx/${item.source_tx_hash}`}
        className="
          block text-[12px] text-gray-600
          hover:text-blue-500 transition-colors
          overflow-hidden text-ellipsis whitespace-nowrap
          w-full
        "
        title={item.source_tx_hash} // 添加原生tooltip
      >
        {item.source_tx_hash}
      </Link>
    </td>
  );
}

export default TransactionRow;
