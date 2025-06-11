import styles from 'styles/Home.module.scss'


import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import { CopyButton } from './CopyButton';
import { buildExplorerUrl } from '@/app/lib/blockchainExplorer';

interface HistoryItem {
  destination_amount: string
  id: string
  source_network: string
  destination_network: string
  source_tx_hash: string
  source_sender: string
  destination_tx_hash: string
  source_asset_symbol: string
  destination_asset_symbol: string
  source_amount: string
  source_deposit_address: string
  destination_address: string
  fee: string
  status: string
  source_block_timestamp: string
  source_asset_decimals: number
  destination_asset_decimals: number
}

interface HistoryResponse {
  page_id: string
  page_size: string
  total_page: string
  total_history: string
  list: HistoryItem[]
}

const HistoryPage: React.FC = () => {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 默认每页10条
  const [totalHistory, setTotalHistory] = useState(0);
  const [loading, setLoading] = useState(false);

   // 生成10-100的选项（步长10）
  const pageSizeOptions = Array.from({length: 10}, (_, i) => (i+1)*10);

  // 统一分页查询方法
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.connect.ab.org/v1/history', {
        params: { 
          page_id: currentPage, 
          page_size: pageSize 
        }
      });
      // console.log(response.data)
      setData(response.data.list);
      setTotalPages(parseInt(response.data.total_page, 10));
      setTotalHistory(parseInt(response.data.total_history, 10));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 页码或页数变化时触发查询
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  // 页数输入处理
  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSize = Math.max(1, parseInt(e.target.value) || 50);
    setPageSize(newSize);
    setCurrentPage(1); // 重置到第一页
  };

    const formatTime = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
  }

  const formatAmount = (amount: string, decimals: number) => {
    return (parseInt(amount, 10) / Math.pow(10, decimals)).toFixed(4)
  }

    const router = useRouter();

  const handleClick = () => {
    router.push('/allhistorypage');
  };

  
type NetworkType = "ABIoT" | "ABCore" | "BSC";

function getNetwork(): NetworkType {
  // 确保这里返回的值总是 "ABIoT"、"ABCore" 或 "BSC" 之一
  return "ABIoT"; // 示例返回
}

  // 处理点击事件以在新标签页中打开区块链浏览器
  const handleExplorerClick = (network: string, hashOrAddress: string, isAddress?: boolean) => {
    const path = isAddress ? `${hashOrAddress}` : `${hashOrAddress}`;
    window.open(buildExplorerUrl(network, path), '_blank');
  };

  return (
    
    

    <div className="container">

      {/* {loading && <p>加载中...</p>} */}
      <div className="scroll-container">
          <div className='display:flex'>
            <Image
            src="/history.png"
            alt="背景图"
                  width={1920}
                  height={1080}
                  priority
                  sizes="100vw"
                  style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%', // 替代100vw
      height: '100%', // 替代100vh
                    objectFit: 'cover',
          objectPosition: 'center',
                    zIndex: -1
                  }}
          />
            <div className='title'>
              <span className='text-style'>AB Connect Explorer</span>
            </div>
          </div>
      <table>
        <thead>
          <tr className='first'>
        <th>数量</th>
        <th>From Chain</th>
        <th>From Hash</th>
        <th>From Address</th>
        {/* <th></th> */}
        <th>To Address</th>
        <th>To Hash</th>
        <th>To Chain</th>
        <th>时间</th>
        <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.destination_amount} {item.source_asset_symbol}</td>
              <td>{item.source_network}</td>
              {/* <td>
                <AddressWithCopy 
                  address={item.source_tx_hash}
                  linkPath={`/address/${item.source_tx_hash}`}
                />
              </td> */}
              <td>
                <div className='outhash'>
                 <div 
                    className="hash green-highlight relative truncate pr-6"
                    onClick={() => handleExplorerClick(item.source_network, `tx/${item.source_tx_hash}`)}
                  >
                  {item.source_tx_hash}
                  </div>
                  <CopyButton
                        text={item.source_tx_hash}
                      />
                  </div>
              </td>
              <td >
                <div className='outhash'>
                 <div 
                    className="hash green-highlight relative truncate pr-6"
                    onClick={() => handleExplorerClick(item.source_network, `tx/${item.source_tx_hash}`)}
                  >
                  {item.source_sender}
                  </div>
                  <CopyButton
                        text={item.source_sender}
                      />
                  </div>
              </td>
              {/* <td>
                <Image
                src="/Arrows.png"
                alt="Logo"
                width={24}
                height={24}
              />
              </td> */}
              <td>
                <div className='outhash'>
                 <div 
                    className="hash green-highlight relative truncate pr-6"
                    onClick={() => handleExplorerClick(item.destination_network, `address/${item.destination_address}`)}
                  >
                  {item.destination_address}
                  </div>
                  <CopyButton
                        text={item.destination_address}
                      />
                  </div>
              </td>
              <td>
                <div className='outhash'>
                 <div 
                    className="hash green-highlight relative truncate pr-6"
                     onClick={() => handleExplorerClick(item.destination_network, `tx/${item.destination_tx_hash}`)}
                  >
                  {item.destination_tx_hash}
                  </div>
                  <CopyButton
                        text={item.destination_tx_hash}
                      />
                  </div>
              </td>
              <td>
                <div>{item.destination_network}</div>
              </td>
              <td>{formatTime(item.source_block_timestamp)}</td>
              <td>
                {/* className={`status ${item.status.toLowerCase()}`} */}
                <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td  onClick={handleClick} colSpan={9} style={{ 
              display: 'table-cell',
              // textAlign: 'center',
              verticalAlign: 'middle',
              height: '60px',
              width: '100%',
              tableLayout: 'fixed',
              cursor:'pointer'  
            }} className='mobileclick'>
              <span >VIEW ALL TRANSACTIONS</span> 
              <span className='imgright'>
                <Image
                src="/Arrows.png"
                alt="Logo"
                width={26}
                height={26}
              
              />
              </span>
              
            </td>
          </tr>
        </tfoot>
      </table>

      <style jsx>{`
      .scroll-container {
  height: 100vh;
}

.text-style {
  font-family: 'Alexandria', sans-serif;
  font-weight: 700;
  font-size: 75px;
  line-height: 76.8px;
  letter-spacing: 0;
  vertical-align: middle;
  position: relative;
  z-index: 9999;
  background: linear-gradient(83.41deg, #055BFA -2.22%, #1BEDA7 20.25%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  height: 128px;
  display: flex;
  align-items: center;
}

.table-header {
  grid-column: 1 / -1;
  font-size: 2rem;
  font-weight: bold;
}

.container {
  max-width: 1200px;
  height: 512px;
  margin: 0 auto;
  position: relative;
    overflow-x: auto;
  display: block;
   -webkit-overflow-scrolling: touch; /* iOS原生滚动 */
  overscroll-behavior-x: contain; /* 阻止边界滚动传播 */
  white-space: normal;
  z-index: 10;
  
}

.container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  z-index: 100;  /* 确保滚动条在最上层 */
}
.container::-webkit-scrollbar-thumb {
  background: #aaa; 
  border-radius: 4px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #1A1A1A;
  color: #FFFFFF;
  border-radius: 12px;
  display: table;
}

.first {
  height: 60px;
  position: relative;
}

th {
  vertical-align: middle;
  padding-top: 20px;
}

th,
td {
  padding-left: 20px;
  padding-right: 20px;
  text-align: left;
  border-bottom: 1px solid rgba(194, 194, 194, 0.3);
  max-width: 140px;
  font-size: 12px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  
}

tfoot td {
  border-bottom: 0 !important;
}
.outhash{
  display:flex;
  cursor: pointer;
}
.hash {
  font-size: 12px;
  color: #666;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}
  .imgright{
      height: 20px;
    width: 24px;
    transform: translateY(7px);
    display: inline-block;
  }
/* CSS文件 */
.hash.green-highlight {
color: #16a34a;
  cursor: pointer;
}

.status {
  font-size: 14px;
}

.status.confirmed {
  color: #2e7d32;
}
.status.error {
  color: #E22C50;
}
.status.pending {
  color: #856404;
}

.status.failed {
  color: #721c24;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.mobileclick{
      text-align: center;
      }
/* 移动端适配 */
@media (max-width: 768px) {
  .text-style {
    font-size: 40px;
    line-height: 42px;
    position: static; 
  }
  
  .title {
    height: 100px;
  }
  
  .container {
    height: auto;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch; /* iOS平滑滚动 :ml-citation{ref="8" data="citationList"} */
  overscroll-behavior-x: contain; 
   margin: 0;
    padding: 0;
    overflow-x: scroll;
    width: 100vw !important; /* 强制视口宽度 :ml-citation{ref="3" data="citationList"} */
  overflow-x: scroll;
   display: grid;
        min-width: 150%;
        grid-template-columns: minmax(1200px, 1fr);
  }
  
  // table {
  //   display: inline-grid !important;
  //   overflow-x: auto;
  //   white-space: nowrap;
  //   table-layout: auto !important; /* 覆盖fixed布局 :ml-citation{ref="1" data="citationList"} */
  //   // min-width: 100vw;
  //   //  min-width: 150%;
  //   border-radius: 0;
  // }
    /* 强制同步列宽 */
table {
  table-layout: fixed;
  width: 100%;
}

th, td {
  width: 11.11%; /* 9列均分宽度 */
  overflow: hidden;
  text-overflow: ellipsis;
      padding-left: px-4; /* 更小的内边距以适应小屏幕 */
    padding-right: px-4;
    font-size: xs; /* 更小的字体以适应小屏幕 */
    height: auto; /* 自动调整高度 */
    padding-left: 12px;
    padding-right: 12px;
}
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  // th, td {
  //   padding-left: 12px;
  //   padding-right: 12px;
  //   max-width: 140px;
  //   padding-left: px-4; /* 更小的内边距以适应小屏幕 */
  //   padding-right: px-4;
  //   font-size: xs; /* 更小的字体以适应小屏幕 */
  //   height: auto; /* 自动调整高度 */
  // }
  //  td {
  //  width: 140px;
  //     }

  // th{
  //   width: 140px;
  //   padding-left: px-4; /* 更小的内边距以适应小屏幕 */
  //   padding-right: px-4;
  //   font-size: xs; /* 更小的字体以适应小屏幕 */
  //   height: auto; /* 自动调整高度 */
  //   }
  tfoot td {
  position: sticky;
  bottom: 0;
  background: #1A1A1A; /* 保持与表头同色 */
  z-index: 10;
  width: auto !important; /* 解除宽度限制 :ml-citation{ref="3" data="citationList"} */
}
  .hash {
    max-width: 100px;
  }
  
  .pagination {
    gap: 10px;
  }
  
  button {
    padding: 6px 12px;
  }
 tfoot td {
    position: static;
    width: 100vw !important;
  }
      .mobileclick{
      text-align: left; /* PC端覆盖为居中 */
      }
      `}</style>
    </div>
    </div>
  )
}

export default HistoryPage
