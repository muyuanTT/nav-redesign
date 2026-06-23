import Navbar from '@/components/Navbar';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.layout}>
      <Navbar />

      {/* Main content area */}
      <main className={styles.main}>
        {/* Stats cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>今日订单</span>
              <span className={styles.statTrendUp}>+12.5%</span>
            </div>
            <div className={styles.statValue}>1,286</div>
            <div className={styles.statFooter}>
              <span>较昨日</span>
              <span className={styles.statCompare}>+142</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>待审核</span>
              <span className={styles.statTrendDown}>-3.2%</span>
            </div>
            <div className={styles.statValue}>86</div>
            <div className={styles.statFooter}>
              <span>较昨日</span>
              <span className={styles.statCompare}>-8</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>今日营收</span>
              <span className={styles.statTrendUp}>+8.3%</span>
            </div>
            <div className={styles.statValue}>¥528,640</div>
            <div className={styles.statFooter}>
              <span>较昨日</span>
              <span className={styles.statCompare}>+¥40,512</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>在线客户</span>
              <span className={styles.statTrendUp}>+5.1%</span>
            </div>
            <div className={styles.statValue}>2,847</div>
            <div className={styles.statFooter}>
              <span>较昨日</span>
              <span className={styles.statCompare}>+138</span>
            </div>
          </div>
        </div>

        {/* Content panels */}
        <div className={styles.panelsGrid}>
          {/* Recent orders */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>最近订单</h3>
              <a href="/orders/all" className={styles.panelLink}>查看全部</a>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>订单号</th>
                    <th>客户</th>
                    <th>航线</th>
                    <th>状态</th>
                    <th>金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.orderNo}>JY202406220001</td>
                    <td>华为技术有限公司</td>
                    <td>深圳 → 洛杉矶</td>
                    <td><span className={`${styles.status} ${styles.statusProcessing}`}>进行中</span></td>
                    <td>¥128,000</td>
                  </tr>
                  <tr>
                    <td className={styles.orderNo}>JY202406220002</td>
                    <td>小米通讯设备有限公司</td>
                    <td>上海 → 鹿特丹</td>
                    <td><span className={`${styles.status} ${styles.statusPending}`}>待审核</span></td>
                    <td>¥86,400</td>
                  </tr>
                  <tr>
                    <td className={styles.orderNo}>JY202406220003</td>
                    <td>深圳市大疆创新科技有限公司</td>
                    <td>香港 → 纽约</td>
                    <td><span className={`${styles.status} ${styles.statusCompleted}`}>已完成</span></td>
                    <td>¥45,200</td>
                  </tr>
                  <tr>
                    <td className={styles.orderNo}>JY202406220004</td>
                    <td>广州保税区贸易公司</td>
                    <td>广州 → 新加坡</td>
                    <td><span className={`${styles.status} ${styles.statusPending}`}>待审核</span></td>
                    <td>¥32,800</td>
                  </tr>
                  <tr>
                    <td className={styles.orderNo}>JY202406220005</td>
                    <td>浙江义乌出口商</td>
                    <td>宁波 → 汉堡</td>
                    <td><span className={`${styles.status} ${styles.statusProcessing}`}>进行中</span></td>
                    <td>¥96,500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>快捷操作</h3>
            </div>
            <div className={styles.quickActions}>
              <a href="/shipping/export/booking" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20a2 2 0 002 2h16a2 2 0 002-2l-2-6H4l-2 6z"/><path d="M4 14l1-6h14l1 6"/></svg>
                </div>
                <span>新建出口订舱</span>
              </a>
              <a href="/air/booking" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.4-.1.9.3 1.1L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.2.4.7.5 1.1.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>
                </div>
                <span>新建空运订舱</span>
              </a>
              <a href="/orders/pending" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <span>待审核订单 <strong>23</strong></span>
              </a>
              <a href="/finance/reconciliation" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                </div>
                <span>对账管理</span>
              </a>
              <a href="/warehouse/inbound" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
                </div>
                <span>入库管理</span>
              </a>
              <a href="/reports/business" className={styles.actionCard}>
                <div className={styles.actionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <span>业务报表</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
