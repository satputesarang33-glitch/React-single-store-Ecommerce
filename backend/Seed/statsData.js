export const operationalStats = {
  kpis: {
    grossRevenue: {
      value: 148920.00,
      formatted: '$148,920.00',
      change: '+14.2%',
      comparisonText: 'vs prev. month',
      sparkline: [22, 28, 25, 42, 38, 55, 68]
    },
    storeOrders: {
      value: 1428,
      formatted: '1,428',
      change: '+5.6%',
      comparisonText: 'vs 48 today',
      sparkline: [12, 19, 15, 25, 22, 30, 38]
    },
    activeCustomers: {
      value: 892,
      formatted: '892 Patrons',
      change: '+12.4%',
      comparisonText: 'vs 94.2% ret.',
      sparkline: [14, 18, 24, 28, 35, 42, 48]
    },
    avgOrderValue: {
      value: 104.28,
      formatted: '$104.28',
      change: '+3.1%',
      comparisonText: 'vs bundle checkout',
      sparkline: [95, 98, 102, 100, 105, 103, 108]
    }
  },
  velocity: {
    actualGross: '$148.9K',
    targetBenchmark: '$135.0K',
    peakDropDay: '$18.4K',
    weeklyData: [
      { week: 'WEEK 01 (OCT 1-7)', revenue: 28400, target: 26000, orders: 280, aov: 101.4 },
      { week: 'WEEK 02 (OCT 8-14)', revenue: 34200, target: 31000, orders: 320, aov: 106.8 },
      { week: 'WEEK 03 (OCT 15-21 DROP)', revenue: 52100, target: 44000, orders: 490, aov: 106.3 },
      { week: 'WEEK 04 (OCT 22-31)', revenue: 34220, target: 34000, orders: 338, aov: 101.2 }
    ]
  },
  inventoryAlerts: [
    {
      id: 'alt-1',
      productName: 'Mono Low-Top Sneaker',
      sku: 'UC-FW-086-CW',
      colorway: 'Chalk White',
      stock: 2,
      urgency: '1 DAYS RUNWAY',
      level: 'critical',
      action: 'Urgent Restock'
    },
    {
      id: 'alt-2',
      productName: 'Chronos Minimal Watch',
      sku: 'UC-TM-044-BK',
      colorway: 'Obsidian Matte',
      stock: 7,
      urgency: '3 DAYS RUNWAY',
      level: 'critical',
      action: 'Restock'
    },
    {
      id: 'alt-3',
      productName: 'Titanium Geom Eyewear',
      sku: 'UC-AC-073-GM',
      colorway: 'Gunmetal Gray',
      stock: 35,
      urgency: 'INCOMING PO',
      level: 'restock',
      action: 'PO #8841 Active'
    }
  ],
  categoryShare: [
    { name: 'Curated Footwear', percentage: 39, amount: '$58,078.80' },
    { name: 'Precision Horology', percentage: 26, amount: '$38,719.20' },
    { name: 'Structured Carry Goods', percentage: 22, amount: '$32,762.40' },
    { name: 'Technical Minimal Apparel', percentage: 14, amount: '$20,848.80' }
  ],
  logistics: {
    onTimeDispatch: '99.1%',
    onTimeDispatchDiff: '+0.4% from Target',
    avgDeliveryTime: '1.8 Days',
    avgDeliverySla: 'Express Priority SLA',
    regionalHub: 'Zurich North',
    hubDescription: 'Sorting & Global Express Outpost',
    status: 'ACTIVE'
  }
};
