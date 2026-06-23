'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Navbar.module.css';

interface ThirdItem {
  label: string;
  href: string;
}

interface SecondItem {
  label: string;
  href: string;
  desc?: string;
  badge?: string;
  children?: ThirdItem[];
}

interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  children?: SecondItem[];
  badge?: string;
}

interface PageInfo {
  title: string;
  desc: string;
}

const pageContents: Record<string, PageInfo> = {
  dashboard: { title: '主页', desc: '查看今日业务概览、待办事项和关键指标' },
  ship: { title: '我要订舱', desc: '管理海运出口订舱、进口到港、运价报价和船期' },
  plane: { title: '内部订舱', desc: '管理空运订舱、运价查询和航班时刻' },
  truck: { title: 'Consol', desc: '管理整车/零担运输和车辆调度' },
  warehouse: { title: '操作中心', desc: '管理入库、出库、库存查询和盘点' },
  package: { title: '结算中心', desc: '管理全部订单，跟踪订单状态' },
  user: { title: '货物动态', desc: '管理客户档案、合同和信用额度' },
  chart: { title: '定制服务', desc: '查看业务统计、营收分析和操作报表' },
  finance: { title: '文件中心', desc: '管理对账、应收应付、发票和成本核算' },
  setting: { title: '帮助中心', desc: '管理组织架构、用户权限、基础数据和系统参数' },
  rate: { title: '运价管理', desc: '管理海运、空运、陆运运价和费率' },
  quote: { title: '报价管理', desc: '管理报价单、报价历史和报价对比' },
};

const subPageContents: Record<string, PageInfo> = {
  '出口订舱': { title: '出口订舱', desc: '创建和管理出口订舱单，支持整箱和拼箱' },
  '进口到港': { title: '进口到港', desc: '进口货物到港预报、清关申报和提货安排' },
  '海运报价': { title: '海运报价', desc: '海运运价查询、报价历史和费率管理' },
  '船期管理': { title: '船期管理', desc: '船期查询、订阅和对比分析' },
  '空运订舱': { title: '空运订舱', desc: '空运订舱新建、列表和舱位管理' },
  '空运报价': { title: '空运报价', desc: '空运运价查询和报价对比' },
  '航班管理': { title: '航班管理', desc: '航班时刻表和舱位监控' },
  '整车运输': { title: '整车运输', desc: '整车运输调度、线路管理和运费结算' },
  '零担运输': { title: '零担运输', desc: '零担货运受理、中转管理和末端配送' },
  '车辆管理': { title: '车辆管理', desc: '车辆档案、司机管理和GPS监控' },
  '入库管理': { title: '入库管理', desc: '收货单管理、质检和上架操作' },
  '出库管理': { title: '出库管理', desc: '拣货任务、复核打包和发货确认' },
  '库存查询': { title: '库存查询', desc: '库存总览、明细查询和库存预警' },
  '盘点管理': { title: '盘点管理', desc: '盘点任务、执行和差异处理' },
  '全部订单': { title: '全部订单', desc: '查看所有订单，支持筛选和导出' },
  '待审核': { title: '待审核订单', desc: '审核待处理的订单，批准或驳回' },
  '进行中': { title: '进行中订单', desc: '跟踪执行中的订单和处理异常' },
  '已完成': { title: '已完成订单', desc: '查看已完成和已取消的订单记录' },
  '客户列表': { title: '客户列表', desc: '管理客户档案、联系人和客户分级' },
  '合同管理': { title: '合同管理', desc: '合同列表、审批和到期预警' },
  '信用额度': { title: '信用额度', desc: '客户额度审批、调整和账期管理' },
  '业务统计': { title: '业务统计', desc: '日报、周报和月报业务量统计' },
  '营收分析': { title: '营收分析', desc: '营收总览、利润分析和成本分析' },
  '操作报表': { title: '操作报表', desc: '订舱效率、通关效率和异常统计' },
  '对账管理': { title: '对账管理', desc: '客户对账、供应商对账和差异处理' },
  '应收应付': { title: '应收应付', desc: '应收账款、应付账款和账龄分析' },
  '发票管理': { title: '发票管理', desc: '开票申请、发票核销和税务报表' },
  '成本核算': { title: '成本核算', desc: '成本归集、成本分摊和成本分析' },
  '组织架构': { title: '组织架构', desc: '部门管理和岗位管理' },
  '用户权限': { title: '用户权限', desc: '用户管理、角色管理和权限配置' },
  '基础数据': { title: '基础数据', desc: '港口管理、航线管理和费率维护' },
  '系统参数': { title: '系统参数', desc: '参数配置、数据字典和操作日志' },
};

const menuItems: MenuItem[] = [
  { icon: 'home', label: '主页', href: '/dashboard' },
  {
    icon: 'ship',
    label: '我要订舱',
    children: [
      { label: '出口订舱', href: '/shipping/export/booking', desc: '创建和管理出口订舱单', children: [
        { label: '整箱订舱', href: '/shipping/export/fcl' },
        { label: '拼箱订舱', href: '/shipping/export/lcl' },
        { label: '批量导入', href: '/shipping/export/batch' },
        { label: '订舱模板', href: '/shipping/export/template' },
      ]},
      { label: '进口到港', href: '/shipping/import/arrival', desc: '进口货物到港管理', children: [
        { label: '到港预报', href: '/shipping/import/forecast' },
        { label: '清关申报', href: '/shipping/import/customs' },
        { label: '提货安排', href: '/shipping/import/delivery' },
      ]},
      { label: '海运报价', href: '/shipping/quote', desc: '海运运价与报价', children: [
        { label: '运价查询', href: '/shipping/quote/search' },
        { label: '报价历史', href: '/shipping/quote/history' },
        { label: '费率管理', href: '/shipping/quote/rate' },
      ]},
      { label: '船期管理', href: '/shipping/schedule', desc: '船期表与维护', children: [
        { label: '船期查询', href: '/shipping/schedule/search' },
        { label: '船期订阅', href: '/shipping/schedule/subscribe' },
        { label: '船期对比', href: '/shipping/schedule/compare' },
      ]},
    ],
  },
  {
    icon: 'plane',
    label: '内部订舱',
    children: [
      { label: '空运订舱', href: '/air/booking', desc: '空运订舱与跟踪', children: [
        { label: '新建订舱', href: '/air/booking/new' },
        { label: '订舱列表', href: '/air/booking/list' },
        { label: '舱位管理', href: '/air/booking/space' },
      ]},
      { label: '空运报价', href: '/air/quote', desc: '空运运价管理', children: [
        { label: '运价查询', href: '/air/quote/search' },
        { label: '报价对比', href: '/air/quote/compare' },
      ]},
      { label: '航班管理', href: '/air/flight', desc: '航班时刻与舱位', children: [
        { label: '航班时刻表', href: '/air/flight/schedule' },
        { label: '舱位监控', href: '/air/flight/monitor' },
      ]},
    ],
  },
  {
    icon: 'consol',
    label: 'Consol',
    children: [
      { label: '整车运输', href: '/land/ftl', desc: '整车运输调度', children: [
        { label: '调度派车', href: '/land/ftl/dispatch' },
        { label: '线路管理', href: '/land/ftl/route' },
        { label: '运费结算', href: '/land/ftl/settle' },
      ]},
      { label: '零担运输', href: '/land/ltl', desc: '零担货运管理', children: [
        { label: '货物受理', href: '/land/ltl/accept' },
        { label: '中转管理', href: '/land/ltl/transfer' },
        { label: '末端配送', href: '/land/ltl/delivery' },
      ]},
      { label: '车辆管理', href: '/land/vehicle', desc: '车辆与司机', children: [
        { label: '车辆档案', href: '/land/vehicle/archive' },
        { label: '司机管理', href: '/land/vehicle/driver' },
        { label: 'GPS监控', href: '/land/vehicle/gps' },
      ]},
    ],
  },
  {
    icon: 'warehouse',
    label: '操作中心',
    children: [
      { label: '入库管理', href: '/warehouse/inbound', desc: '收货/质检/上架', children: [
        { label: '收货单', href: '/warehouse/inbound/receipt' },
        { label: '质检', href: '/warehouse/inbound/qc' },
        { label: '上架', href: '/warehouse/inbound/putaway' },
      ]},
      { label: '出库管理', href: '/warehouse/outbound', desc: '拣货/复核/发货', children: [
        { label: '拣货任务', href: '/warehouse/outbound/pick' },
        { label: '复核打包', href: '/warehouse/outbound/check' },
        { label: '发货确认', href: '/warehouse/outbound/ship' },
      ]},
      { label: '库存查询', href: '/warehouse/stock', desc: '实时库存', children: [
        { label: '库存总览', href: '/warehouse/stock/overview' },
        { label: '库存明细', href: '/warehouse/stock/detail' },
        { label: '库存预警', href: '/warehouse/stock/alert' },
      ]},
      { label: '盘点管理', href: '/warehouse/count', desc: '库存盘点', children: [
        { label: '盘点任务', href: '/warehouse/count/task' },
        { label: '盘点执行', href: '/warehouse/count/execute' },
        { label: '差异处理', href: '/warehouse/count/diff' },
      ]},
    ],
  },
  {
    icon: 'settlement',
    label: '结算中心',
    badge: '128',
    children: [
      { label: '全部订单', href: '/orders/all', desc: '所有订单列表', children: [
        { label: '海运订单', href: '/orders/all/sea' },
        { label: '空运订单', href: '/orders/all/air' },
        { label: '陆运订单', href: '/orders/all/land' },
      ]},
      { label: '待审核', href: '/orders/pending', badge: '23', desc: '待审核订单', children: [
        { label: '待审核', href: '/orders/pending/review' },
        { label: '审核驳回', href: '/orders/pending/rejected' },
      ]},
      { label: '进行中', href: '/orders/processing', desc: '执行中订单', children: [
        { label: '执行中', href: '/orders/processing/active' },
        { label: '异常订单', href: '/orders/processing/exception' },
      ]},
      { label: '已完成', href: '/orders/completed', desc: '已完成订单', children: [
        { label: '已完成', href: '/orders/completed/done' },
        { label: '已取消', href: '/orders/completed/cancelled' },
      ]},
    ],
  },
  {
    icon: 'tracking',
    label: '货物动态',
    children: [
      { label: '客户列表', href: '/customers/list', desc: '客户档案', children: [
        { label: '客户档案', href: '/customers/list/archive' },
        { label: '联系人管理', href: '/customers/list/contact' },
        { label: '客户分级', href: '/customers/list/level' },
      ]},
      { label: '合同管理', href: '/customers/contract', desc: '合同与协议', children: [
        { label: '合同列表', href: '/customers/contract/list' },
        { label: '合同审批', href: '/customers/contract/approve' },
        { label: '到期预警', href: '/customers/contract/expire' },
      ]},
      { label: '信用额度', href: '/customers/credit', desc: '信用与额度', children: [
        { label: '额度审批', href: '/customers/credit/approve' },
        { label: '额度调整', href: '/customers/credit/adjust' },
        { label: '账期管理', href: '/customers/credit/period' },
      ]},
    ],
  },
  {
    icon: 'custom',
    label: '定制服务',
    children: [
      { label: '业务统计', href: '/reports/business', desc: '业务量统计', children: [
        { label: '日报', href: '/reports/business/daily' },
        { label: '周报', href: '/reports/business/weekly' },
        { label: '月报', href: '/reports/business/monthly' },
      ]},
      { label: '营收分析', href: '/reports/revenue', desc: '营收与利润', children: [
        { label: '营收总览', href: '/reports/revenue/overview' },
        { label: '利润分析', href: '/reports/revenue/profit' },
        { label: '成本分析', href: '/reports/revenue/cost' },
      ]},
      { label: '操作报表', href: '/reports/operation', desc: '操作效率分析', children: [
        { label: '订舱效率', href: '/reports/operation/booking' },
        { label: '通关效率', href: '/reports/operation/customs' },
        { label: '异常统计', href: '/reports/operation/exception' },
      ]},
    ],
  },
  {
    icon: 'document',
    label: '文件中心',
    children: [
      { label: '对账管理', href: '/finance/reconciliation', desc: '客户/供应商对账', children: [
        { label: '客户对账', href: '/finance/reconciliation/customer' },
        { label: '供应商对账', href: '/finance/reconciliation/supplier' },
        { label: '对账差异', href: '/finance/reconciliation/diff' },
      ]},
      { label: '应收应付', href: '/finance/receivable', desc: '应收应付账款', children: [
        { label: '应收账款', href: '/finance/receivable/receive' },
        { label: '应付账款', href: '/finance/receivable/pay' },
        { label: '账龄分析', href: '/finance/receivable/age' },
      ]},
      { label: '发票管理', href: '/finance/invoice', desc: '发票开具与核销', children: [
        { label: '开票申请', href: '/finance/invoice/apply' },
        { label: '发票核销', href: '/finance/invoice/verify' },
        { label: '税务报表', href: '/finance/invoice/tax' },
      ]},
      { label: '成本核算', href: '/finance/cost', desc: '业务成本核算', children: [
        { label: '成本归集', href: '/finance/cost/collect' },
        { label: '成本分摊', href: '/finance/cost/allocate' },
        { label: '成本分析', href: '/finance/cost/analyze' },
      ]},
    ],
  },
  {
    icon: 'help',
    label: '帮助中心',
    children: [
      { label: '组织架构', href: '/settings/org', desc: '部门与岗位', children: [
        { label: '部门管理', href: '/settings/org/dept' },
        { label: '岗位管理', href: '/settings/org/position' },
      ]},
      { label: '用户权限', href: '/settings/permission', desc: '角色权限管理', children: [
        { label: '用户管理', href: '/settings/permission/user' },
        { label: '角色管理', href: '/settings/permission/role' },
        { label: '权限配置', href: '/settings/permission/config' },
      ]},
      { label: '基础数据', href: '/settings/master', desc: '港口/航线/费率', children: [
        { label: '港口管理', href: '/settings/master/port' },
        { label: '航线管理', href: '/settings/master/route' },
        { label: '费率维护', href: '/settings/master/rate' },
      ]},
      { label: '系统参数', href: '/settings/config', desc: '系统配置', children: [
        { label: '参数配置', href: '/settings/config/param' },
        { label: '数据字典', href: '/settings/config/dict' },
        { label: '操作日志', href: '/settings/config/log' },
      ]},
    ],
  },
  {
    icon: 'rate',
    label: '运价管理',
    children: [
      { label: '海运运价', href: '/rates/sea', desc: '海运运价管理', children: [
        { label: '费率表', href: '/rates/sea/table' },
        { label: '费率历史', href: '/rates/sea/history' },
        { label: '费率预警', href: '/rates/sea/alert' },
      ]},
      { label: '空运运价', href: '/rates/air', desc: '空运运价管理', children: [
        { label: '费率表', href: '/rates/air/table' },
        { label: '费率对比', href: '/rates/air/compare' },
      ]},
      { label: '陆运运价', href: '/rates/land', desc: '陆运运价管理', children: [
        { label: '费率表', href: '/rates/land/table' },
        { label: '线路定价', href: '/rates/land/route' },
      ]},
    ],
  },
  {
    icon: 'quote',
    label: '报价管理',
    children: [
      { label: '报价单', href: '/quotes/list', desc: '报价单管理', children: [
        { label: '报价列表', href: '/quotes/list/all' },
        { label: '待审批', href: '/quotes/list/pending' },
        { label: '已审批', href: '/quotes/list/approved' },
      ]},
      { label: '报价历史', href: '/quotes/history', desc: '历史报价查询', children: [
        { label: '客户报价', href: '/quotes/history/customer' },
        { label: '供应商报价', href: '/quotes/history/supplier' },
      ]},
      { label: '报价对比', href: '/quotes/compare', desc: '报价分析与对比', children: [
        { label: '同行对比', href: '/quotes/compare/peer' },
        { label: '历史趋势', href: '/quotes/compare/trend' },
      ]},
    ],
  },
];

const iconSvg: Record<string, React.ReactNode> = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z" fill="#479FF8"/>
      <rect x="9" y="14" width="6" height="4" rx="1" fill="#fff"/>
      <rect x="6" y="10" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="15" y="10" width="3" height="3" rx="0.8" fill="#fff"/>
      <path d="M3 11l9-7 9 7" fill="none" stroke="#3a8fd4" strokeWidth="1.2"/>
    </svg>
  ),
  ship: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M3 17l1.5 3.5h15L21 17H3z" fill="#479FF8"/>
      <path d="M5 14l1.5-5.5h11L19 14H5z" fill="#479FF8"/>
      <path d="M12 3l4.5 6.5h-9L12 3z" fill="#fff"/>
      <path d="M11.5 3.5v5h1v-5h-1z" fill="#479FF8"/>
      <circle cx="7.5" cy="16.5" r="1" fill="#fff"/>
      <circle cx="12" cy="16.5" r="1" fill="#fff"/>
      <circle cx="16.5" cy="16.5" r="1" fill="#fff"/>
      <path d="M4 19h16" stroke="#3a8fd4" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  plane: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect x="5" y="3" width="14" height="18" rx="2" fill="#479FF8"/>
      <rect x="8" y="3" width="8" height="3" rx="1" fill="#3a8fd4"/>
      <path d="M9.5 12l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="7" y="16" width="10" height="1.5" rx="0.5" fill="#fff"/>
      <rect x="7" y="13.5" width="7" height="1.5" rx="0.5" fill="#fff"/>
    </svg>
  ),
  consol: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect x="2" y="14" width="9" height="7" rx="1.5" fill="#479FF8"/>
      <rect x="13" y="14" width="9" height="7" rx="1.5" fill="#479FF8"/>
      <rect x="7" y="4" width="10" height="7" rx="1.5" fill="#479FF8"/>
      <rect x="4" y="16" width="3" height="2.5" rx="0.6" fill="#fff"/>
      <rect x="15" y="16" width="3" height="2.5" rx="0.6" fill="#fff"/>
      <rect x="9" y="6" width="3" height="2.5" rx="0.6" fill="#fff"/>
      <path d="M7 11v2M17 11v2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M12 11v2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="6" cy="17.5" r="0.8" fill="#3a8fd4"/>
      <circle cx="18" cy="17.5" r="0.8" fill="#3a8fd4"/>
      <circle cx="12" cy="7.5" r="0.8" fill="#3a8fd4"/>
    </svg>
  ),
  warehouse: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="#479FF8"/>
      <rect x="5" y="7" width="14" height="3" rx="1" fill="#3a8fd4"/>
      <path d="M10 8.5l3 1.5-3 1.5V8.5z" fill="#fff"/>
      <rect x="6" y="12" width="3" height="6" rx="1" fill="#fff"/>
      <rect x="10.5" y="14" width="3" height="4" rx="1" fill="#fff"/>
      <rect x="15" y="11" width="3" height="7" rx="1" fill="#fff"/>
      <circle cx="7.5" cy="15" r="0.7" fill="#479FF8"/>
      <circle cx="12" cy="16" r="0.7" fill="#479FF8"/>
      <circle cx="16.5" cy="14.5" r="0.7" fill="#479FF8"/>
    </svg>
  ),
  settlement: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" fill="#479FF8"/>
      <path d="M15 3v5h4" fill="#3a8fd4"/>
      <path d="M7 9h10M7 12h10M7 15h6" stroke="#fff" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="18" cy="17" r="2.5" fill="#fff"/>
      <text x="18" y="18.5" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#479FF8" fontFamily="Arial,sans-serif">$</text>
    </svg>
  ),
  tracking: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" fill="#479FF8"/>
      <path d="M3 7l9 4 9-4" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6"/>
      <path d="M12 11v10" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6"/>
      <line x1="7" y1="5.5" x2="12" y2="8.5" stroke="#fff" strokeWidth="1" opacity="0.5"/>
      <line x1="17" y1="5.5" x2="12" y2="8.5" stroke="#fff" strokeWidth="1" opacity="0.5"/>
      <rect x="8" y="13" width="8" height="2" rx="0.5" fill="#fff" opacity="0.5"/>
    </svg>
  ),
  custom: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M7 3h10l4 6-9 12-9-12 4-6z" fill="#479FF8"/>
      <path d="M7 3h10l4 6H3l4-6z" fill="#fff" opacity="0.3"/>
      <path d="M3 9h18l-9 12-9-12z" fill="#3a8fd4"/>
      <path d="M7 3L3 9l4-6z" fill="#fff" opacity="0.2"/>
      <path d="M12 3v6" stroke="#fff" strokeWidth="0.8" opacity="0.5"/>
      <path d="M8 9l4 12 4-12" stroke="#fff" strokeWidth="0.6" opacity="0.3" fill="none"/>
    </svg>
  ),
  document: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M3 6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" fill="#479FF8"/>
      <rect x="6" y="9" width="12" height="1.5" rx="0.5" fill="#fff"/>
      <rect x="6" y="12" width="12" height="1.5" rx="0.5" fill="#fff"/>
    </svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#479FF8"/>
      <path d="M9 9a3 3 0 015.5 1.5c0 2-2.5 2.5-2.5 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="17" r="1" fill="#fff"/>
    </svg>
  ),
  rate: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="3" fill="#479FF8"/>
      <rect x="2" y="4" width="20" height="5" rx="3" fill="#3a8fd4"/>
      <text x="7" y="17" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Arial,sans-serif">$</text>
      <rect x="13" y="12.5" width="6" height="1.5" rx="0.5" fill="#fff"/>
      <rect x="13" y="15.5" width="4" height="1.5" rx="0.5" fill="#fff"/>
    </svg>
  ),
  quote: (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2.5" fill="#479FF8"/>
      <rect x="7" y="4" width="10" height="4" rx="1" fill="#3a8fd4"/>
      <rect x="8" y="5" width="3" height="2" rx="0.5" fill="#fff"/>
      <rect x="13" y="5" width="3" height="2" rx="0.5" fill="#fff"/>
      <rect x="7" y="10" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="10.5" y="10" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="14" y="10" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="7" y="14" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="10.5" y="14" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="14" y="14" width="3" height="3" rx="0.8" fill="#fff"/>
      <rect x="7" y="18" width="6.5" height="2" rx="0.5" fill="#3a8fd4"/>
      <rect x="14" y="18" width="3" height="2" rx="0.5" fill="#2e7dc4"/>
    </svg>
  ),
};

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(56);
  const [pageTitle, setPageTitle] = useState('工作台');
  const [pageDesc, setPageDesc] = useState('查看今日业务概览、待办事项和关键指标');
  const [activeThirdMenu, setActiveThirdMenu] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['主页']);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('管理员');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roles, setRoles] = useState([
    { id: 1, name: '管理员', org: '总部管理中心' },
    { id: 2, name: '财务', org: '财务结算中心' },
    { id: 3, name: '操作员', org: '运营操作中心' },
    { id: 4, name: '客户', org: '客户服务中心' },
  ]);
  const [orgTooltip, setOrgTooltip] = useState<{ roleId: number; x: number; y: number } | null>(null);
  const [draggedRole, setDraggedRole] = useState<number | null>(null);
  const [dragOverRole, setDragOverRole] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((key: string, el: HTMLAnchorElement | null) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (el && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = el.getBoundingClientRect();
      const top = itemRect.top - navRect.top + 56;
      setPanelTop(top);
    }
    setHoveredMenu(key);
    setExpandedSub(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
      setExpandedSub(null);
    }, 150);
  }, []);

  const handlePanelEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  }, []);

  const handlePanelLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
      setExpandedSub(null);
    }, 150);
  }, []);

  const handleSubClick = (label: string) => {
    setExpandedSub(expandedSub === label ? null : label);
  };

  const handleMenuClick = (key: string, label: string) => {
    setActiveMenu(key);
    setActiveThirdMenu(null);
    const content = pageContents[key];
    if (content) {
      setPageTitle(content.title);
      setPageDesc(content.desc);
      setBreadcrumb(['主页', content.title]);
    }
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setRoleDropdownOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleProfileMenuClick = (action: string) => {
    setProfileOpen(false);
    if (action === 'logout') {
      console.log('退出登录');
    } else {
      console.log(action);
    }
  };

  const handleRoleSwitch = (roleName: string) => {
    setCurrentRole(roleName);
    setRoleDropdownOpen(false);
  };

  const handleDragStart = (roleId: number) => {
    setDraggedRole(roleId);
  };

  const handleDragOver = (e: React.DragEvent, roleId: number) => {
    e.preventDefault();
    if (draggedRole !== roleId) {
      setDragOverRole(roleId);
    }
  };

  const handleDragLeave = () => {
    setDragOverRole(null);
  };

  const handleDrop = (targetRoleId: number) => {
    if (draggedRole === null || draggedRole === targetRoleId) {
      setDraggedRole(null);
      setDragOverRole(null);
      return;
    }
    const newRoles = [...roles];
    const draggedIndex = newRoles.findIndex(r => r.id === draggedRole);
    const targetIndex = newRoles.findIndex(r => r.id === targetRoleId);
    const [removed] = newRoles.splice(draggedIndex, 1);
    newRoles.splice(targetIndex, 0, removed);
    setRoles(newRoles);
    setDraggedRole(null);
    setDragOverRole(null);
  };

  const handleDragEnd = () => {
    setDraggedRole(null);
    setDragOverRole(null);
  };

  const handlePageClick = (label: string) => {
    const content = subPageContents[label];
    if (content) {
      setPageTitle(content.title);
      setPageDesc(content.desc);
    }

    // Build breadcrumb path
    if (currentItem) {
      // Check if it's a second-level menu (no children match)
      const isSecondLevel = currentItem.children?.some(sub => sub.label === label);
      if (isSecondLevel) {
        setActiveThirdMenu(null);
        setBreadcrumb(['主页', currentItem.label, label]);
      } else {
        // It's a third-level menu
        setActiveThirdMenu(label);
        const secondLabel = currentItem.children?.find(sub =>
          sub.children?.some(third => third.label === label)
        )?.label;
        if (secondLabel) {
          setBreadcrumb(['主页', currentItem.label, secondLabel, label]);
        } else {
          setBreadcrumb(['主页', currentItem.label, label]);
        }
      }
    }
  };

  const currentItem = menuItems.find((item) => item.icon === hoveredMenu);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <nav className={styles.nav} ref={navRef} aria-label="主菜单">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.icon;
            const isHovered = hoveredMenu === item.icon;
            const hasChildren = !!item.children;

            return (
              <div key={item.icon} className={styles.navGroup}>
                <a
                  ref={(el) => { itemRefs.current[item.icon] = el; }}
                  href="#"
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${isHovered ? styles.navLinkHover : ''}`}
                  onMouseEnter={() => hasChildren && handleMouseEnter(item.icon, itemRefs.current[item.icon])}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.icon, item.label);
                    setMobileOpen(false);
                  }}
                >
                  <span className={styles.navIcon}>
                    {iconSvg[item.icon]}
                  </span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.badge}>{item.badge}</span>
                  )}
                </a>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Card Panel */}
      {hoveredMenu && currentItem?.children && (
        <div
          className={styles.cardPanel}
          style={{ top: panelTop }}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
        >
          <div className={styles.cardPanelInner}>
            {currentItem.children.map((sub) => {
              const isSubExpanded = expandedSub === sub.label;
              return (
                <div key={sub.label} className={styles.cardGroup}>
                  <div
                    className={styles.cardGroupTitle}
                    onClick={() => sub.children && sub.children.length > 0 && handleSubClick(sub.label)}
                  >
                    <a
                      href="#"
                      className={styles.cardGroupTitleText}
                      onClick={(e) => { e.preventDefault(); handlePageClick(sub.label); }}
                    >
                      {sub.label}
                    </a>
                    {sub.badge && (
                      <span className={styles.cardBadge}>{sub.badge}</span>
                    )}
                    {sub.children && sub.children.length > 0 && (
                      <svg
                        className={`${styles.cardChevron} ${isSubExpanded ? styles.cardChevronOpen : ''}`}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </div>
                  {/* Accordion: third-level items */}
                  <div
                    className={`${styles.cardAccordion} ${isSubExpanded ? styles.cardAccordionOpen : ''}`}
                  >
                    <div className={styles.cardAccordionInner}>
                      {sub.children && sub.children.length > 0 && (
                        <div className={styles.cardGroupItems}>
                          {sub.children.map((third) => {
                            const isThirdActive = activeThirdMenu === third.label;
                            return (
                              <a
                                key={third.label}
                                href="#"
                                className={`${styles.cardItem} ${isThirdActive ? styles.cardItemActive : ''}`}
                                onClick={(e) => { e.preventDefault(); handlePageClick(third.label); }}
                              >
                                {third.label}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top header bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <a href="#" className={styles.headerLogo}>
            <img
              src="/logo.png"
              alt="Myeverok"
              className={styles.headerLogoImg}
            />
            <span className={styles.headerLogoText}>MyEverok</span>
          </a>
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="切换菜单"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className={styles.breadcrumb}>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                )}
                {index === breadcrumb.length - 1 ? (
                  <span className={styles.breadcrumbCurrent}>{item}</span>
                ) : (
                  <span>{item}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.iconGroup}>
            <button className={`${styles.headerBtn} ${styles.headerBtnSm}`} title="即时通讯">
              <img src="/icon/jishitongxun.svg" alt="即时通讯" width="22" height="22" />
            </button>
            <button className={`${styles.headerBtn} ${styles.headerBtnSm}`} title="操作手册">
              <img src="/icon/caozuoshouce.svg" alt="操作手册" width="22" height="22" />
            </button>
            <button className={`${styles.headerBtn} ${styles.headerBtnSm}`} title="问答">
              <img src="/icon/qa.svg" alt="问答" width="22" height="22" />
            </button>
            <button className={`${styles.headerBtn} ${styles.headerBtnSm}`} title="法律条款">
              <img src="/icon/falvtiaokuan.svg" alt="法律条款" width="22" height="22" />
            </button>
          </div>
          <button className={styles.headerBtn} title="消息">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <span className={styles.headerBadge}>5</span>
          </button>
          <button className={styles.headerBtn} title="中英文切换">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 010 20"/><path d="M12 2a15.3 15.3 0 000 20"/></svg>
          </button>
          <div className={`${styles.userInfo} ${styles.userInfoClickable}`} onClick={toggleProfile}>
            <img src="/logo2.png" alt="头像" className={styles.avatar} />
            <div className={styles.userDetail}>
              <span className={styles.userName}>用户名：OP</span>
              <span className={styles.userAccount}>账号：GILLION</span>
            </div>
          </div>
          <button className={`${styles.headerBtn} ${styles.arrowBtn}`} title="角色切换">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={profileOpen ? styles.arrowOpen : ''}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        {/* Profile Dropdown */}
        {profileOpen && (
          <div className={styles.profileDropdown} ref={profileRef}>
            <div className={styles.profileDivider} />
            <div className={styles.profileRoleSection}>
              <div className={styles.profileRoleHeader}>
                <span className={styles.profileRoleLabel}>当前角色</span>
                <div className={styles.profileRoleCurrent} onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}>
                  <span>{currentRole}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={roleDropdownOpen ? styles.roleArrowOpen : ''}><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              {roleDropdownOpen && (
                <div className={styles.roleDropdown} ref={roleDropdownRef}>
                  <div className={styles.roleDropdownHeader}>拖拽可排序</div>
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`${styles.roleItem} ${currentRole === role.name ? styles.roleItemActive : ''} ${dragOverRole === role.id ? styles.roleItemDragOver : ''}`}
                      draggable
                      onDragStart={() => handleDragStart(role.id)}
                      onDragOver={(e) => handleDragOver(e, role.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(role.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleRoleSwitch(role.name)}
                    >
                      <span className={styles.roleDragHandle}>⋮⋮</span>
                      <span className={styles.roleName}>{role.name}</span>
                      {currentRole === role.name && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.roleCheck}><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      <span
                        className={styles.roleOrgIcon}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setOrgTooltip({ roleId: role.id, x: rect.right + 8, y: rect.top });
                        }}
                        onMouseLeave={() => setOrgTooltip(null)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="8" height="6" rx="1"/>
                          <rect x="14" y="2" width="8" height="6" rx="1"/>
                          <rect x="8" y="16" width="8" height="6" rx="1"/>
                          <line x1="6" y1="8" x2="6" y2="12"/>
                          <line x1="18" y1="8" x2="18" y2="12"/>
                          <line x1="6" y1="12" x2="18" y2="12"/>
                          <line x1="12" y1="12" x2="12" y2="16"/>
                        </svg>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {orgTooltip && (
                <div
                  className={styles.orgTooltip}
                  style={{ left: orgTooltip.x, top: orgTooltip.y }}
                >
                  <div className={styles.orgTooltipArrow} />
                  <div className={styles.orgTooltipContent}>
                    <span className={styles.orgTooltipLabel}>关联组织</span>
                    <span className={styles.orgTooltipValue}>{roles.find(r => r.id === orgTooltip.roleId)?.org}</span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.profileDivider} />
            <div className={styles.profileMenu}>
              <a href="#" className={styles.profileMenuItem} onClick={(e) => { e.preventDefault(); handleProfileMenuClick('个人设置'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                <span>个人设置</span>
              </a>
              <a href="#" className={styles.profileMenuItem} onClick={(e) => { e.preventDefault(); handleProfileMenuClick('修改密码'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span>修改密码</span>
              </a>
              <a href="#" className={styles.profileMenuItem} onClick={(e) => { e.preventDefault(); handleProfileMenuClick('退出登录'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>退出登录</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
