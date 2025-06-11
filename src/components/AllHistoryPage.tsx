import styles from 'styles/Home.module.scss'


import React, { useState, useEffect,useRef } from 'react'
import axios from 'axios'
import { ChangeEvent } from 'react';
import { ArrowCell } from './ArrowCell';
import { CopyButton } from './CopyButton';
import Image from 'next/image'; 
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
  const [pageSize, setPageSize] = useState(10); // 默认每页50条
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
      setData(response.data.list);
      setTotalPages(parseInt(response.data.total_page, 10));
      setTotalHistory(parseInt(response.data.total_history, 10));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!containerRef.current?.contains(target)) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { 
      passive: false 
    });
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);


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

    const [minHeight, setMinHeight] = useState('100vh');
    useEffect(() => {
    // 动态计算最小高度：表头高度 + 每行高度 × 行数 + 底部间距
    const rowHeight = 50; // 根据实际行高调整
    const baseHeight = 102 + 100; // 顶部偏移 + 底部间距
    setMinHeight(`${baseHeight + (data?.length || 0) * rowHeight}px`);
  }, [data]);

    // 处理点击事件以在新标签页中打开区块链浏览器
    const handleExplorerClick = (network: string, hashOrAddress: string, isAddress?: boolean) => {
      const path = isAddress ? `${hashOrAddress}` : `${hashOrAddress}`;
      window.open(buildExplorerUrl(network, path), '_blank');
    };

  return (
    
    

    <div className="container">

      <div className="scroll-container" ref={containerRef}> 
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
                  quality={75}
                />

                  <div className='title' >
                    <span className='text-style'>Transactions</span>
                  </div>
<div  className='pageup'>
      
      <div className="topdesc">
          More than {totalHistory} transactions found
      </div>
        <div className="pagination">
          <button className='butf' onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || loading}>
            First
          </button>
          <button className='butp' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || loading}>
            prev
          </button>
          <span className='pagesum'>
            Page {currentPage}  of  {totalPages}
          </span>
          <button className='butn'
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            next
          </button>
          <button className='butl'
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || loading}
          >
            Last
          </button>
        </div>
</div>
      {/* {loading && <p>加载中...</p>} */}

      <table>
        <thead>
          <tr className='first'>
        <th >数量</th>
        <th >From Chain</th>
        <th >From Hash</th>
        <th >From Address</th>
        {/* <th></th> */}
        <th >To Address</th>
        <th >To Hash</th>
        <th >To Chain</th>
        <th >时间</th>
        <th >状态</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.destination_amount} {item.source_asset_symbol}</td>
              <td>{item.source_network}</td>
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
                <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<div  className='pagebottom'>
        <div className="pagination-left">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Show rows:</span>
            <select className='left'
              value={pageSize} onChange={handlePageSizeChange}
              style={{ margin: '0 10px' }}
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}条</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pagination">
          <button className='butf' onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || loading}>
            First
          </button>
          <button className='butp' onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || loading}>
            prev
          </button>
          <span className='pagesum'>
            Page {currentPage}  of  {totalPages}
          </span>
          <button className='butn'
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
          >
            next
          </button>
          <button className='butl'
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || loading}
          >
            Last
          </button>
        </div>
    </div>

      <style jsx>{`

       .scroll-container {
          height: 100vh;
        }

.text-style {
  font-family: 'Alexandria', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 21px;
  vertical-align: middle;
  position: relative;
  z-index: 9999;
  color: #FFFFFF;
}

.title {
  height: 75px;
  display: flex;
  align-items: center;
  padding-bottom: 24px;
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
    // overflow-x: auto;
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
  background-color: #1A1A1A;
  color: #FFFFFF;
  // border-radius: 12px;
  display: table;
}

.first {
  height: 60px;
  position: relative;
}

th {
  vertical-align: middle;
  // padding-top: 20px;
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
.topdesc {
  padding-left: 20px;
  padding-right: 20px;
  text-align: left;
  // border-bottom: 1px solid rgba(194, 194, 194, 0.3);
  // max-width: 1200px;
  font-size: 16px;
  // height: 77px;
  // line-height: 77px;
  background: #1A1A1A;
  color: #FFFFFF;
  border-radius: 12px 12px 0 0;

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
/* CSS文件 */
.hash.green-highlight {
color: #16a34a;
  cursor: pointer;
}

.status {
  font-size: 14px;
}
.status.error {
  color: #E22C50;
}
.status.confirmed {
  color: #2e7d32;
}

.status.pending {
  color: #856404;
}

.status.failed {
  color: #721c24;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-right: 20px;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pageup {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-wrap: wrap;
  background: #1A1A1A;
  color: #f1f1f1;
 border-bottom: 1px solid rgba(194, 194, 194, 0.3);
 height:77px;
 line-height:77px;
  border-radius: 6px 6px 0 0;
}

.pagebottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-wrap: wrap;
  background: #1A1A1A;
  color: #f1f1f1;
  height: 54px;
  line-height: 54px;
  border-radius: 0 0 6px 6px;
}

 .left{
  border: 1px solid rgba(255, 255, 255, 0.5); /* #FFFFFF80 的等效写法 */
  width: 54px;
  height: 25px;
  border-radius: 6px;
  background: #1A1A1A;
  color: #f1f1f1;
}
  .pagination-left{
        margin-left: 20px;
  }
  .butf,.butp,.butn,.butl{
  border: 1px solid rgba(255, 255, 255, 0.5); /* #FFFFFF80 的等效写法 */
  border-radius: 6px;
  color: #f1f1f1;
  background: #1A1A1A;
    width: 54px;
  height: 25px;
    display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  }


/* 移动端适配 */
@media (max-width: 768px) {
  .text-style {
    font-size: 24px;
    line-height: 42px;
    position: static; 
  }
  
  .title {
    height: 80px;
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
  
  button {
    padding: 6px 12px;
  }
 tfoot td {
    position: static;
    width: 100vw !important;
  }
  .pagebottom ,.pageup {
    flex-direction: column;
    // align-items: flex-start;
    gap: 1px;
    height:86px;
    justify-content: flex-start;
  }
    .pageup .topdesc {
        padding-left:12px;
    }
    .pagebottom .pagination-left ,.pageup .topdesc {
    width: 100%;
    justify-content: flex-start;
    height:35px;
    line-height:35px;
  }

  .pagebottom .pagination, .pageup .pagination{
    width: 100%;
    justify-content: flex-start;
    margin-left:40px;
    height:35px;
    line-height:35px;
    gap: 5px;
  }
    .pagebottom button,.pagebottom span,
    .pagebottom select,
    .pageup button,.pageup span,
    .pageup select{
    font-size:12px;
    }
      .pagesum{
      font-size:12px;
      }

    
      }
      `}</style>
    </div>
    </div>
  )
}

export default HistoryPage
