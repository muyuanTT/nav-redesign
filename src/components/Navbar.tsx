'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, placement: 'bottom' as 'top' | 'bottom' });
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const tooltipHeight = 40;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placement = spaceBelow > tooltipHeight + 10 ? 'bottom' : 'top';
      setPos({
        x: rect.left + rect.width / 2,
        y: placement === 'bottom' ? rect.bottom : rect.top,
        placement,
      });
    }
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  }, []);

  return (
    <div
      ref={ref}
      className={styles.tooltipWrapper}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className={`${styles.tooltip} ${pos.placement === 'top' ? styles.tooltipTop : ''}`}
            style={{ left: pos.x, top: pos.y }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <div className={styles.tooltipArrow} />
            {text}
          </div>,
          document.body
        )}
    </div>
  );
}

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
  '地图': { title: '地图', desc: '业务数据地图可视化，全球航线与港口分布' },
  '驾驶舱': { title: '驾驶舱', desc: '核心业务指标实时监控与数据分析' },
  '工作台': { title: '工作台', desc: '个人工作台，快速处理待办事项' },
  '海运委托': { title: '海运委托', desc: '海运委托管理，创建和跟踪海运委托单' },
  '空运委托': { title: '空运委托', desc: '空运委托管理，创建和跟踪空运委托单' },
  '铁路委托': { title: '铁路委托', desc: '铁路委托管理，创建和跟踪铁路委托单' },
  '我的订单': { title: '我的订单', desc: '查看和管理所有委托订单' },
  '我要对单': { title: '我要对单', desc: '对单管理，核对海运、空运、铁路对单' },
  '财务费用': { title: '财务费用', desc: '财务费用管理，费用确认和发票管理' },
  '我的地址': { title: '我的地址', desc: '管理收货和发货地址' },
  '海运对单': { title: '海运对单', desc: '海运对单核对和管理' },
  '空运对单': { title: '空运对单', desc: '空运对单核对和管理' },
  '铁路对单': { title: '铁路对单', desc: '铁路对单核对和管理' },
  '费用确认': { title: '费用确认', desc: '费用确认和审核' },
  '内部订舱': { title: '内部订舱', desc: '内部订舱管理，统一调度订舱资源' },
  'CONSOL操作': { title: 'CONSOL操作', desc: '集装箱拼箱操作管理' },
  '确认出运计划': { title: '确认出运计划', desc: '确认拼箱出运计划' },
  'PO清单': { title: 'PO清单', desc: '采购订单清单管理' },
  '内部操作权限设置': { title: '内部操作权限设置', desc: '设置内部操作权限' },
  '仓库设置': { title: '仓库设置', desc: '仓库基础信息设置' },
  '供应商设置': { title: '供应商设置', desc: '供应商基础信息设置' },
  '客户编号设置': { title: '客户编号设置', desc: '客户编号规则设置' },
  '箱型设置': { title: '箱型设置', desc: '集装箱型规格设置' },
  '供应商表现统计': { title: '供应商表现统计', desc: '供应商绩效统计分析' },
  '客户关系及偏好设置': { title: '客户关系及偏好设置', desc: '客户关系和偏好配置' },
  '优选箱型设置': { title: '优选箱型设置', desc: '优选集装箱型配置' },
  '挑货提醒设置': { title: '挑货提醒设置', desc: '挑货提醒规则设置' },
  'LCL': { title: 'LCL', desc: '拼箱运价计算器' },
  'SEA CALCULATOR CONFIG': { title: 'SEA CALCULATOR CONFIG', desc: '海运计算器配置' },
  'AIR': { title: 'AIR', desc: '空运运价计算器' },
  'AIR CALCULATOR CONFIG': { title: 'AIR CALCULATOR CONFIG', desc: '空运计算器配置' },
  'SEA+AIR CALCULATOR CONFIG': { title: 'SEA+AIR CALCULATOR CONFIG', desc: '海空联运计算器配置' },
  'SEA+AIR': { title: 'SEA+AIR', desc: '海空联运运价计算器' },
  '拼箱池': { title: '拼箱池', desc: '拼箱货物池管理' },
  '代理确认出运': { title: '代理确认出运', desc: '代理确认拼箱出运' },
  'Mix Consol基础数据维护': { title: 'Mix Consol基础数据维护', desc: '拼箱基础数据维护' },
  '拼箱部门权限维护': { title: '拼箱部门权限维护', desc: '拼箱部门权限管理' },
  '整车运输': { title: '整车运输', desc: '整车运输调度、线路管理和运费结算' },
  '零担运输': { title: '零担运输', desc: '零担货运受理、中转管理和末端配送' },
  '车辆管理': { title: '车辆管理', desc: '车辆档案、司机管理和GPS监控' },
  '电商确认': { title: '电商确认', desc: '电商订舱确认管理，海运、空运、铁路订舱确认' },
  '委托单': { title: '委托单', desc: '委托单管理，海运、空运、铁路委托单列表' },
  '海运订舱': { title: '海运订舱', desc: '海运订舱管理，舱位预定、销售和管理' },
  '空运订舱': { title: '空运订舱', desc: '空运订舱管理，订舱确认和舱位管理' },
  'Booking Desk': { title: 'Booking Desk', desc: 'Booking Desk管理，SI查询和集量维护' },
  '海运订舱确认': { title: '海运订舱确认', desc: '海运电商订舱确认' },
  '空运订舱确认': { title: '空运订舱确认', desc: '空运电商订舱确认' },
  '铁路订舱确认': { title: '铁路订舱确认', desc: '铁路电商订舱确认' },
  '海运委托单列表': { title: '海运委托单列表', desc: '海运委托单列表查看和管理' },
  '空运委托单列表': { title: '空运委托单列表', desc: '空运委托单列表查看和管理' },
  '铁路委托单列表': { title: '铁路委托单列表', desc: '铁路委托单列表查看和管理' },
  '订舱管理': { title: '订舱管理', desc: '订舱单创建、编辑和跟踪管理' },
  '舱位预定': { title: '舱位预定', desc: '集装箱舱位预定管理' },
  '舱位管理': { title: '舱位管理', desc: '集装箱舱位状态和管理' },
  '舱位销售管理': { title: '舱位销售管理', desc: '舱位销售策略和管理' },
  '船公司运价Filing确认': { title: '船公司运价Filing确认', desc: '船公司运价Filing确认管理' },
  '订舱确认': { title: '订舱确认', desc: '订舱确认管理' },
  'SI查询': { title: 'SI查询', desc: 'SI信息查询管理' },
  '集量维护': { title: '集量维护', desc: '集量数据维护管理' },
  'LTD维护': { title: 'LTD维护', desc: 'LTD数据维护管理' },
  '权限维护': { title: '权限维护', desc: '权限配置和管理' },
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
  {
    icon: 'home',
    label: '主页',
    href: '/dashboard',
    children: [
      { label: '地图', href: '/dashboard/map', desc: '业务数据地图可视化' },
      { label: '驾驶舱', href: '/dashboard/cockpit', desc: '核心指标驾驶舱' },
      { label: '工作台', href: '/dashboard/workbench', desc: '个人工作台' },
    ],
  },
  {
    icon: 'ship',
    label: '我要订舱',
    children: [
      { label: '海运委托', href: '/shipping/sea', desc: '海运委托管理' },
      { label: '空运委托', href: '/shipping/air', desc: '空运委托管理' },
      { label: '铁路委托', href: '/shipping/rail', desc: '铁路委托管理' },
      { label: '我的订单', href: '/shipping/orders', desc: '我的订单列表' },
      { label: '我要对单', href: '/shipping/reconciliation', desc: '对单管理', children: [
        { label: '海运对单', href: '/shipping/reconciliation/sea' },
        { label: '空运对单', href: '/shipping/reconciliation/air' },
        { label: '铁路对单', href: '/shipping/reconciliation/rail' },
      ]},
      { label: '财务费用', href: '/shipping/finance', desc: '财务费用管理', children: [
        { label: '费用确认', href: '/shipping/finance/confirm' },
        { label: '发票管理', href: '/shipping/finance/invoice' },
      ]},
      { label: '我的地址', href: '/shipping/address', desc: '我的地址管理' },
    ],
  },
  {
    icon: 'plane',
    label: '内部订舱',
    children: [
      { label: '内部订舱', href: '/air/internal', desc: '内部订舱管理' },
      { label: '海运订舱', href: '/air/sea', desc: '海运订舱管理' },
      { label: '空运订舱', href: '/air/air', desc: '空运订舱管理' },
      { label: '铁路订舱', href: '/air/rail', desc: '铁路订舱管理' },
    ],
  },
  {
    icon: 'consol',
    label: 'Consol',
    children: [
      { label: 'MY iCONSOLBOX', href: '/consol/iconbox', desc: 'CONSOL操作与设置', children: [
        { label: 'CONSOL操作', href: '/consol/iconbox/operation' },
        { label: '确认出运计划', href: '/consol/iconbox/plan' },
        { label: 'PO清单', href: '/consol/iconbox/po' },
        { label: '内部操作权限设置', href: '/consol/iconbox/permission' },
        { label: '仓库设置', href: '/consol/iconbox/warehouse' },
        { label: '供应商设置', href: '/consol/iconbox/supplier' },
        { label: '客户编号设置', href: '/consol/iconbox/customer' },
        { label: '箱型设置', href: '/consol/iconbox/container' },
        { label: '供应商表现统计', href: '/consol/iconbox/performance' },
        { label: '客户关系及偏好设置', href: '/consol/iconbox/preference' },
        { label: '优选箱型设置', href: '/consol/iconbox/prefer-container' },
        { label: '挑货提醒设置', href: '/consol/iconbox/alert' },
      ]},
      { label: 'ICONSOL CALCULATOR', href: '/consol/calculator', desc: '运价计算器', children: [
        { label: 'LCL', href: '/consol/calculator/lcl' },
        { label: 'SEA CALCULATOR CONFIG', href: '/consol/calculator/sea-config' },
        { label: 'AIR', href: '/consol/calculator/air' },
        { label: 'AIR CALCULATOR CONFIG', href: '/consol/calculator/air-config' },
        { label: 'SEA+AIR CALCULATOR CONFIG', href: '/consol/calculator/sea-air-config' },
        { label: 'SEA+AIR', href: '/consol/calculator/sea-air' },
      ]},
      { label: 'Mix Consol', href: '/consol/mix', desc: '拼箱管理', children: [
        { label: '拼箱池', href: '/consol/mix/pool' },
        { label: '代理确认出运', href: '/consol/mix/confirm' },
        { label: 'Mix Consol基础数据维护', href: '/consol/mix/master' },
        { label: '拼箱部门权限维护', href: '/consol/mix/dept-permission' },
      ]},
    ],
  },
  {
    icon: 'warehouse',
    label: '操作中心',
    children: [
      { label: '电商确认', href: '/warehouse/ecommerce', desc: '电商订舱确认管理', children: [
        { label: '海运订舱确认', href: '/warehouse/ecommerce/sea' },
        { label: '空运订舱确认', href: '/warehouse/ecommerce/air' },
        { label: '铁路订舱确认', href: '/warehouse/ecommerce/rail' },
      ]},
      { label: '委托单', href: '/warehouse/orders', desc: '委托单管理', children: [
        { label: '海运委托单列表', href: '/warehouse/orders/sea' },
        { label: '空运委托单列表', href: '/warehouse/orders/air' },
        { label: '铁路委托单列表', href: '/warehouse/orders/rail' },
      ]},
      { label: '海运订舱', href: '/warehouse/sea-booking', desc: '海运订舱管理', children: [
        { label: '订舱管理', href: '/warehouse/sea-booking/manage' },
        { label: '舱位预定', href: '/warehouse/sea-booking/reserve' },
        { label: '舱位管理', href: '/warehouse/sea-booking/space' },
        { label: '舱位销售管理', href: '/warehouse/sea-booking/sales' },
        { label: '船公司运价Filing确认', href: '/warehouse/sea-booking/filing' },
      ]},
      { label: '空运订舱', href: '/warehouse/air-booking', desc: '空运订舱管理', children: [
        { label: '订舱管理', href: '/warehouse/air-booking/manage' },
        { label: '订舱确认', href: '/warehouse/air-booking/confirm' },
        { label: '舱位管理', href: '/warehouse/air-booking/space' },
      ]},
      { label: 'Booking Desk', href: '/warehouse/booking-desk', desc: 'Booking Desk管理', children: [
        { label: 'Booking Desk', href: '/warehouse/booking-desk/desk' },
        { label: 'SI查询', href: '/warehouse/booking-desk/si' },
        { label: '集量维护', href: '/warehouse/booking-desk/volume' },
        { label: 'LTD维护', href: '/warehouse/booking-desk/ltd' },
        { label: '权限维护', href: '/warehouse/booking-desk/permission' },
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
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(56);
  const [pageTitle, setPageTitle] = useState('工作台');
  const [pageDesc, setPageDesc] = useState('查看今日业务概览、待办事项和关键指标');
  const [activeThirdMenu, setActiveThirdMenu] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('管理员');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roles, setRoles] = useState([
    { id: 1, name: '管理员', orgs: ['总部管理中心', '深圳分公司', '上海分公司'] },
    { id: 2, name: '财务', orgs: ['财务结算中心', '深圳分公司财务部'] },
    { id: 3, name: '操作员', orgs: ['运营操作中心', '广州运营部', '上海运营部'] },
    { id: 4, name: '客户', orgs: ['客户服务中心', '北京客服部'] },
  ]);
  const [orgTooltip, setOrgTooltip] = useState<{ roleId: number; x: number; y: number; arrowTop: number; isLeft: boolean } | null>(null);
  const [draggedRole, setDraggedRole] = useState<number | null>(null);
  const [dragOverRole, setDragOverRole] = useState<number | null>(null);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['海运委托', '我的订单']));

  const toggleFavorite = useCallback((label: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(['海运委托', '我的订单', '对账管理']);
  const [searchResults, setSearchResults] = useState<Array<{ label: string; path: string }>>([]);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(56);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const allSearchableItems = useMemo(() => [
    { label: '海运委托', path: '/shipping/sea' },
    { label: '空运委托', path: '/shipping/air' },
    { label: '铁路委托', path: '/shipping/rail' },
    { label: '我的订单', path: '/shipping/orders' },
    { label: '我要对单', path: '/shipping/reconciliation' },
    { label: '财务费用', path: '/shipping/finance' },
    { label: '我的地址', path: '/shipping/address' },
    { label: '内部订舱', path: '/air/internal' },
    { label: '海运订舱', path: '/air/sea' },
    { label: '空运订舱', path: '/air/air' },
    { label: '铁路订舱', path: '/air/rail' },
    { label: 'CONSOL操作', path: '/consol/iconbox/operation' },
    { label: '拼箱池', path: '/consol/mix/pool' },
    { label: '电商确认', path: '/warehouse/ecommerce' },
    { label: '委托单', path: '/warehouse/orders' },
    { label: '海运订舱', path: '/warehouse/sea-booking' },
    { label: '空运订舱', path: '/warehouse/air-booking' },
    { label: 'Booking Desk', path: '/warehouse/booking-desk' },
    { label: '全部订单', path: '/orders/all' },
    { label: '待审核', path: '/orders/pending' },
    { label: '进行中', path: '/orders/processing' },
    { label: '已完成', path: '/orders/completed' },
    { label: '客户列表', path: '/customers/list' },
    { label: '合同管理', path: '/customers/contract' },
    { label: '信用额度', path: '/customers/credit' },
    { label: '业务统计', path: '/reports/business' },
    { label: '营收分析', path: '/reports/revenue' },
    { label: '操作报表', path: '/reports/operation' },
    { label: '对账管理', path: '/finance/reconciliation' },
    { label: '应收应付', path: '/finance/receivable' },
    { label: '发票管理', path: '/finance/invoice' },
    { label: '成本核算', path: '/finance/cost' },
    { label: '组织架构', path: '/settings/org' },
    { label: '用户权限', path: '/settings/permission' },
    { label: '基础数据', path: '/settings/master' },
    { label: '系统参数', path: '/settings/config' },
    { label: '运价管理', path: '/rates/sea' },
    { label: '报价管理', path: '/quotes/list' },
    { label: '文件中心', path: '/finance/document' },
    { label: '帮助中心', path: '/settings/help' },
  ], []);

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allSearchableItems.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  }, [allSearchableItems]);

  const handleSearchSubmit = useCallback((label: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== label);
      return [label, ...filtered].slice(0, 5);
    });
    setSearchQuery('');
    setSearchResults([]);
    setSearchDrawerOpen(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const getItemIcon = useCallback((label: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '海运委托': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 17l2 3h16l2-3"/><path d="M5 14l2-6h10l2 6"/><path d="M12 4v4"/><path d="M10 8h4"/><circle cx="8" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="16" cy="19" r="1"/></svg>,
      '空运委托': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="3" width="8" height="3" rx="1"/><path d="M9.5 12l2 2 3.5-3.5"/><rect x="7" y="16" width="10" height="1.5" rx="0.5"/></svg>,
      '铁路委托': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2"/><rect x="3" y="3" width="18" height="5" rx="2"/><circle cx="7" cy="13" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="17" cy="13" r="1.5"/><path d="M7 17v3M12 17v3M17 17v3"/></svg>,
      '我的订单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '我要对单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      '财务费用': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      '我的地址': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      '海运报价': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 17l2 3h16l2-3"/><path d="M5 14l2-6h10l2 6"/><path d="M12 4v4"/><path d="M10 8h4"/><circle cx="8" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="16" cy="19" r="1"/></svg>,
      '客户列表': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      '出口订舱': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '库存查询': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2.5"/><rect x="5" y="7" width="14" height="3" rx="1"/><path d="M10 8.5l3 1.5-3 1.5V8.5z"/><rect x="6" y="12" width="3" height="6" rx="1"/><rect x="10.5" y="14" width="3" height="4" rx="1"/><rect x="15" y="11" width="3" height="7" rx="1"/></svg>,
      '对账管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      '进口到港': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 17l2 3h16l2-3"/><path d="M5 14l2-6h10l2 6"/><path d="M12 4v4"/><path d="M10 8h4"/><circle cx="8" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="16" cy="19" r="1"/></svg>,
      '船期管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
      '航班管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="3" width="8" height="3" rx="1"/><path d="M9.5 12l2 2 3.5-3.5"/><rect x="7" y="16" width="10" height="1.5" rx="0.5"/></svg>,
      '整车运输': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '零担运输': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '车辆管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="8" rx="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M3 11l2-5h14l2 5"/></svg>,
      '入库管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>,
      '出库管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V9"/><path d="M7 14l5-5 5 5"/><path d="M5 3h14"/></svg>,
      '盘点管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3"/></svg>,
      '全部订单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '待审核': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
      '进行中': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M12 7v5l3 3"/></svg>,
      '已完成': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      '合同管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
      '信用额度': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
      '业务统计': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
      '营收分析': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      '操作报表': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3"/></svg>,
      '应收应付': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      '发票管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
      '成本核算': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3"/></svg>,
      '组织架构': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="8" height="6" rx="1"/><rect x="14" y="2" width="8" height="6" rx="1"/><rect x="8" y="16" width="8" height="6" rx="1"/><line x1="6" y1="8" x2="6" y2="12"/><line x1="18" y1="8" x2="18" y2="12"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="12" x2="12" y2="16"/></svg>,
      '用户权限': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
      '基础数据': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
      '系统参数': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
      '运价管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="3"/><rect x="2" y="4" width="20" height="5" rx="3"/><text x="7" y="17" fontSize="8" fontWeight="bold" fill="currentColor">$</text><rect x="13" y="12.5" width="6" height="1.5" rx="0.5"/><rect x="13" y="15.5" width="4" height="1.5" rx="0.5"/></svg>,
      '报价管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2.5"/><rect x="7" y="4" width="10" height="4" rx="1"/><rect x="8" y="5" width="3" height="2" rx="0.5"/><rect x="13" y="5" width="3" height="2" rx="0.5"/><rect x="7" y="10" width="3" height="3" rx="0.8"/><rect x="10.5" y="10" width="3" height="3" rx="0.8"/><rect x="14" y="10" width="3" height="3" rx="0.8"/></svg>,
      '文件中心': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"/><rect x="6" y="9" width="12" height="1.5" rx="0.5"/><rect x="6" y="12" width="12" height="1.5" rx="0.5"/></svg>,
      '帮助中心': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 015.5 1.5c0 2-2.5 2.5-2.5 4"/><circle cx="12" cy="17" r="1"/></svg>,
      '海运对单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      '空运对单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      '铁路对单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      '费用确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      '内部订舱': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="3" width="8" height="3" rx="1"/><path d="M9.5 12l2 2 3.5-3.5"/><rect x="7" y="16" width="10" height="1.5" rx="0.5"/></svg>,
      'CONSOL操作': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '确认出运计划': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      'PO清单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
      '仓库设置': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2.5"/><rect x="5" y="7" width="14" height="3" rx="1"/><path d="M10 8.5l3 1.5-3 1.5V8.5z"/><rect x="6" y="12" width="3" height="6" rx="1"/><rect x="10.5" y="14" width="3" height="4" rx="1"/><rect x="15" y="11" width="3" height="7" rx="1"/></svg>,
      '供应商设置': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="8" rx="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M3 11l2-5h14l2 5"/></svg>,
      '客户编号设置': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      '箱型设置': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '供应商表现统计': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
      '拼箱池': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '代理确认出运': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      'Mix Consol基础数据维护': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
      '拼箱部门权限维护': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
      '电商确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      '委托单': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '海运订舱': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 17l2 3h16l2-3"/><path d="M5 14l2-6h10l2 6"/><path d="M12 4v4"/><path d="M10 8h4"/><circle cx="8" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="16" cy="19" r="1"/></svg>,
      '空运订舱': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="3" width="8" height="3" rx="1"/><path d="M9.5 12l2 2 3.5-3.5"/><rect x="7" y="16" width="10" height="1.5" rx="0.5"/></svg>,
      '铁路订舱': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2"/><rect x="3" y="3" width="18" height="5" rx="2"/><circle cx="7" cy="13" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="17" cy="13" r="1.5"/><path d="M7 17v3M12 17v3M17 17v3"/></svg>,
      'Booking Desk': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><rect x="8" y="21" width="8" height="2"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
      '海运订舱确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      '空运订舱确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      '铁路订舱确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      '海运委托单列表': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '空运委托单列表': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '铁路委托单列表': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h9l5 5v13a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M15 3v5h4"/><path d="M7 9h10M7 12h10M7 15h6"/></svg>,
      '订舱管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      '舱位预定': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '舱位管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="14" width="9" height="7" rx="1.5"/><rect x="13" y="14" width="9" height="7" rx="1.5"/><rect x="7" y="4" width="10" height="7" rx="1.5"/><rect x="4" y="16" width="3" height="2.5" rx="0.6"/><rect x="15" y="16" width="3" height="2.5" rx="0.6"/><rect x="9" y="6" width="3" height="2.5" rx="0.6"/></svg>,
      '舱位销售管理': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
      '船公司运价Filing确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
      '订舱确认': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>,
      'SI查询': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
      '集量维护': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
      'LTD维护': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>,
      '权限维护': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    };
    return iconMap[label] || <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
  }, []);

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const orgTooltipRef = useRef<HTMLDivElement>(null);

  // 更新选中条位置和高度
  useEffect(() => {
    const activeIndex = menuItems.findIndex(item => item.icon === activeMenu);
    if (activeIndex >= 0 && navRef.current) {
      const navItems = navRef.current.querySelectorAll('[data-nav-item]');
      if (navItems[activeIndex]) {
        const itemRect = navItems[activeIndex].getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        setIndicatorTop(itemRect.top - navRect.top);
        setIndicatorHeight(itemRect.height);
      }
    }
  }, [activeMenu]);
  const orgLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      setBreadcrumb([content.title]);
    }
    // 一级菜单点击导航
    if (key === 'home') {
      router.push('/dashboard');
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

    if (currentItem) {
      // 检查是否是二级菜单且有三级子菜单
      const secondLevelSub = currentItem.children?.find(sub => sub.label === label);
      const isSecondWithChildren = secondLevelSub && secondLevelSub.children && secondLevelSub.children.length > 0;

      if (isSecondWithChildren) {
        // 二级菜单且有三级子菜单：不切换选中条，只展开/折叠
        setActiveThirdMenu(null);
        setBreadcrumb([currentItem.label, label]);
      } else {
        // 叶子节点（三级菜单 或 没有子菜单的二级菜单）：切换选中条
        setActiveMenu(currentItem.icon);

        const isThirdLevel = currentItem.children?.some(sub =>
          sub.children?.some(third => third.label === label)
        );

        if (isThirdLevel) {
          setActiveThirdMenu(label);
          const secondLabel = currentItem.children?.find(sub =>
            sub.children?.some(third => third.label === label)
          )?.label;
          if (secondLabel) {
            setBreadcrumb([currentItem.label, secondLabel, label]);
          } else {
            setBreadcrumb([currentItem.label, label]);
          }
        } else {
          // 没有子菜单的二级菜单（叶子节点）：如地图、驾驶舱、工作台
          setActiveThirdMenu(null);
          setBreadcrumb([currentItem.label, label]);
        }

        // 导航到对应页面
        const currentIcon = currentItem.icon;
        if (currentIcon === 'home' && label === '地图') {
          router.push('/dashboard/map');
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
        <div className={styles.sidebarSearch} onClick={() => setSearchDrawerOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <nav className={styles.nav} ref={navRef} aria-label="主菜单">
          {activeMenu && (
            <div
              className={styles.activeIndicator}
              style={{ top: indicatorTop, height: indicatorHeight }}
            />
          )}
          {menuItems.map((item) => {
            const isActive = activeMenu === item.icon;
            const isHovered = hoveredMenu === item.icon;
            const hasChildren = !!item.children;

            return (
              <div key={item.icon} className={styles.navGroup} data-nav-item>
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
              const hasActiveThird = activeThirdMenu && sub.children?.some(third => third.label === activeThirdMenu);
              return (
                <div key={sub.label} className={styles.cardGroup}>
                  <div
                    className={`${styles.cardGroupTitle} ${hasActiveThird ? styles.cardGroupTitleActive : ''}`}
                    onClick={() => {
                      if (sub.children && sub.children.length > 0) {
                        handleSubClick(sub.label);
                      } else {
                        handlePageClick(sub.label);
                      }
                    }}
                  >
                    <span className={styles.cardGroupTitleText}>
                      {sub.label}
                    </span>
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
            <Tooltip text="即时通讯">
              <button className={`${styles.headerBtn} ${styles.headerBtnSm}`}>
                <img src="/icon/jishitongxun.svg" alt="即时通讯" width="22" height="22" />
              </button>
            </Tooltip>
            <Tooltip text="操作手册">
              <button className={`${styles.headerBtn} ${styles.headerBtnSm}`}>
                <img src="/icon/caozuoshouce.svg" alt="操作手册" width="22" height="22" />
              </button>
            </Tooltip>
            <Tooltip text="问答">
              <button className={`${styles.headerBtn} ${styles.headerBtnSm}`}>
                <img src="/icon/qa.svg" alt="问答" width="22" height="22" />
              </button>
            </Tooltip>
            <Tooltip text="法律条款">
              <button className={`${styles.headerBtn} ${styles.headerBtnSm}`}>
                <img src="/icon/falvtiaokuan.svg" alt="法律条款" width="22" height="22" />
              </button>
            </Tooltip>
          </div>
          <Tooltip text="消息">
            <button className={styles.headerBtn}>
              <span className={styles.headerBtnAnim}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              </span>
              <span className={styles.headerBadge}>5</span>
            </button>
          </Tooltip>
          <Tooltip text="中英文切换">
            <button className={styles.headerBtn}>
              <span className={styles.headerBtnLang}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 010 20"/><path d="M12 2a15.3 15.3 0 000 20"/></svg>
              </span>
            </button>
          </Tooltip>
          <div className={`${styles.userInfo} ${styles.userInfoClickable}`} onClick={toggleProfile}>
            <img src="/logo2.png" alt="头像" className={styles.avatar} />
            <div className={styles.userDetail}>
              <span className={styles.userName}>用户名：OP</span>
              <span className={styles.userAccount}>账号：GILLION</span>
            </div>
          </div>
          <button className={`${styles.headerBtn} ${styles.arrowBtn}`} onClick={toggleProfile}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={profileOpen ? styles.arrowOpen : ''}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>

        {/* Profile Dropdown */}
        {profileOpen && (
          <div className={styles.profileDropdown} ref={profileRef}>
            <div className={styles.profileDivider} />
            <div className={`${styles.profileRoleSection} ${roleDropdownOpen ? styles.profileRoleSectionOpen : ''}`}>
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
                          const tooltipWidth = 220;
                          const tooltipHeight = 180;
                          const gap = -4;
                          const iconCenterY = rect.top + rect.height / 2;

                          // 默认浮窗在图标右侧，箭头在浮窗左侧
                          let x = rect.right + gap;
                          let isLeft = false;

                          // 超出右边界，显示在左侧
                          if (x + tooltipWidth > window.innerWidth) {
                            x = rect.left - tooltipWidth - gap;
                            isLeft = true;
                          }

                          // 浮窗垂直居中于图标
                          let y = iconCenterY - tooltipHeight / 2;

                          // 超出下边界，向上偏移
                          if (y + tooltipHeight > window.innerHeight) {
                            y = window.innerHeight - tooltipHeight - 10;
                          }

                          // 超出上边界，向下偏移
                          if (y < 10) {
                            y = 10;
                          }

                          // 箭头中心指向图标中心（箭头高度14px，中心偏移7px）
                          const arrowTop = Math.max(12, Math.min(iconCenterY - y - 7, tooltipHeight - 12));

                          setOrgTooltip({ roleId: role.id, x, y, arrowTop, isLeft });
                        }}
                        onMouseLeave={() => {
                          orgLeaveTimeoutRef.current = setTimeout(() => {
                            if (!orgTooltipRef.current?.contains(document.activeElement as Node)) {
                              setOrgTooltip(null);
                            }
                          }, 100);
                        }}
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
            </div>
            <div className={`${styles.profileDivider} ${roleDropdownOpen ? styles.profileDividerHidden : ''}`} />
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

        {/* Org Tooltip - rendered outside profileDropdown to avoid overflow:hidden clipping */}
        {orgTooltip && (() => {
          const role = roles.find(r => r.id === orgTooltip.roleId);
          if (!role) return null;
          return (
            <div
              ref={orgTooltipRef}
              className={styles.orgTooltip}
              style={{ left: orgTooltip.x, top: orgTooltip.y, pointerEvents: 'auto' }}
              onMouseEnter={() => {
                if (orgLeaveTimeoutRef.current) {
                  clearTimeout(orgLeaveTimeoutRef.current);
                  orgLeaveTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => setOrgTooltip(null)}
            >
              <div
                className={`${styles.orgTooltipArrow} ${orgTooltip.isLeft ? styles.orgTooltipArrowRight : ''}`}
                style={orgTooltip.isLeft ? { left: 'auto', right: -7, top: orgTooltip.arrowTop } : { left: -7, top: orgTooltip.arrowTop }}
              />
              <div className={styles.orgTooltipContent}>
                <div className={styles.orgTooltipHeader}>
                  <span className={styles.orgTooltipHeaderIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="8" height="6" rx="1"/>
                      <rect x="14" y="2" width="8" height="6" rx="1"/>
                      <rect x="8" y="16" width="8" height="6" rx="1"/>
                      <line x1="6" y1="8" x2="6" y2="12"/>
                      <line x1="18" y1="8" x2="18" y2="12"/>
                      <line x1="6" y1="12" x2="18" y2="12"/>
                      <line x1="12" y1="12" x2="12" y2="16"/>
                    </svg>
                  </span>
                  {role.name}
                </div>
                <div className={styles.orgTooltipBody}>
                  {role.orgs.length > 0 ? (
                    role.orgs.map((org, idx) => (
                      <div key={idx} className={styles.orgTooltipItem}>
                        <span className={styles.orgTooltipItemDot} />
                        {org}
                      </div>
                    ))
                  ) : (
                    <div className={styles.orgTooltipEmpty}>暂无关联组织</div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </header>

      {/* Search Drawer */}
      {searchDrawerOpen && (
        <>
          <div className={styles.searchOverlay} onClick={() => setSearchDrawerOpen(false)} />
          <div className={styles.searchDrawer}>
            <div className={styles.searchDrawerHeader}>
              <div className={styles.searchInputWrapper}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="搜索菜单、功能..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  autoFocus
                />
              </div>
            </div>
            <div className={styles.searchDrawerBody}>
              {searchQuery ? (
                <div className={styles.searchSection}>
                  <div className={styles.searchSectionTitle}>搜索结果 ({searchResults.length})</div>
                  {searchResults.length > 0 ? (
                    <div className={styles.searchSectionList}>
                      {searchResults.map(item => (
                        <div key={item.label} className={styles.searchItemRow}>
                          <a
                            href="#"
                            className={styles.searchItem}
                            onClick={(e) => { e.preventDefault(); handleSearchSubmit(item.label); }}
                          >
                            <span className={styles.searchItemIcon}>{getItemIcon(item.label)}</span>
                            <span>{item.label}</span>
                          </a>
                          <button
                            className={`${styles.favoriteBtn} ${favorites.has(item.label) ? styles.favoriteActive : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(item.label); }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(item.label) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.searchEmpty}>未找到匹配项</div>
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.searchSection}>
                    <div className={styles.searchSectionTitle}>最近使用</div>
                    <div className={styles.searchSectionList}>
                      {searchHistory.map(label => (
                        <div key={label} className={styles.searchItemRow}>
                          <a
                            href="#"
                            className={styles.searchItem}
                            onClick={(e) => { e.preventDefault(); handleSearchSubmit(label); }}
                          >
                            <span className={styles.searchItemIcon}>{getItemIcon(label)}</span>
                            <span>{label}</span>
                          </a>
                          <button
                            className={`${styles.favoriteBtn} ${favorites.has(label) ? styles.favoriteActive : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(label); }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorites.has(label) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {searchHistory.length === 0 && (
                        <div className={styles.searchEmpty}>暂无搜索历史</div>
                      )}
                    </div>
                  </div>
                  <div className={styles.searchSection}>
                    <div className={styles.searchSectionTitle}>我的收藏</div>
                    <div className={styles.searchSectionList}>
                      {Array.from(favorites).map(label => (
                        <div key={label} className={styles.searchItemRow}>
                          <a
                            href="#"
                            className={styles.searchItem}
                            onClick={(e) => { e.preventDefault(); handleSearchSubmit(label); }}
                          >
                            <span className={styles.searchItemIcon}>{getItemIcon(label)}</span>
                            <span>{label}</span>
                          </a>
                          <button
                            className={`${styles.favoriteBtn} ${styles.favoriteActive}`}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(label); }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {favorites.size === 0 && (
                        <div className={styles.searchEmpty}>暂无收藏</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
