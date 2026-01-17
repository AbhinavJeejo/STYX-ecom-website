import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
  CartesianGrid,
  Legend
} from "recharts";
import '../../styles/adminstyles/Analytics.css'
const CHART_COLORS = {
  completed: "#10b981",
  pending: "#f59e0b",
  cancelled: "#ef4444",
  newCustomer: "#3b82f6",
  regular: "#8b5cf6",
  loyal: "#10b981",
  revenue: "#6366f1"
};

function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const delivered = orders.filter(o => o.status === "delivered");
    const processing = orders.filter(o => o.status === "processing");
    const cancelled = orders.filter(o => o.status === "cancelled");

    const totalRevenue = delivered.reduce((s, o) => s + (o.total || 0), 0);

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastMonthRevenue = delivered
      .filter(o => new Date(o.date) >= lastMonth)
      .reduce((s, o) => s + (o.total || 0), 0);

    const newCustomers = users.filter(u => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt) >= lastMonth;
    }).length;

    const loyalCustomers = users.filter(u => (u.orders || 0) > 5).length;
    const regularCustomers = users.filter(u => (u.orders || 0) > 1 && (u.orders || 0) <= 5).length;

    const revenueByMonth = delivered.reduce((acc, order) => {
      const m = new Date(order.date).toLocaleString("en-US", { month: "short" });
      acc[m] = (acc[m] || 0) + order.total;
      return acc;
    }, {});

    const revenueData = Object.keys(revenueByMonth).map(m => ({
      month: m,
      revenue: revenueByMonth[m],
      target: revenueByMonth[m] * 0.9
    }));

    setStats({
      orderStatus: [
        { name: "Completed", value: delivered.length, color: CHART_COLORS.completed },
        { name: "Pending", value: processing.length, color: CHART_COLORS.pending },
        { name: "Cancelled", value: cancelled.length, color: CHART_COLORS.cancelled }
      ],
      customerSegmentation: [
        { name: "New", value: newCustomers, color: CHART_COLORS.newCustomer },
        { name: "Regular", value: regularCustomers, color: CHART_COLORS.regular },
        { name: "Loyal", value: loyalCustomers, color: CHART_COLORS.loyal }
      ],
      revenueData,
      kpis: {
        totalOrders: orders.length,
        totalRevenue,
        monthlyRevenue: lastMonthRevenue,
        customerGrowth: users.length ? ((newCustomers / users.length) * 100).toFixed(1) : 0,
        avgOrderValue: delivered.length ? totalRevenue / delivered.length : 0,
        conversionRate: users.length ? ((orders.length / users.length) * 100).toFixed(1) : 0
      }
    });

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-bar">
          <div className="loading-progress" />
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Total Revenue',
      value: `$${stats.kpis.totalRevenue.toLocaleString()}`,
      trend: '+12.5%',
      icon: '$',
      gradient: { start: '#667eea', end: '#764ba2' }
    },
    {
      label: 'Total Orders',
      value: stats.kpis.totalOrders,
      trend: '+8.2%',
      icon: '🛒',
      gradient: { start: '#f093fb', end: '#f5576c' }
    },
    {
      label: 'Monthly Growth',
      value: `${stats.kpis.customerGrowth}%`,
      subtitle: 'New customers',
      icon: '👥',
      gradient: { start: '#4facfe', end: '#00f2fe' }
    },
    {
      label: 'Avg. Order Value',
      value: `$${stats.kpis.avgOrderValue.toFixed(2)}`,
      trend: '+5.7%',
      icon: '📈',
      gradient: { start: '#fa709a', end: '#fee140' }
    }
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-inner">
        <div className="analytics-header">
          <h1 className="analytics-title">Sales Analytics Dashboard</h1>
          <p className="analytics-subtitle">Monitor your sales performance and customer insights</p>
        </div>

        <div className="kpi-grid">
          {kpiCards.map((card, index) => (
            <div
              key={index}
              className="kpi-card"
              style={{
                '--gradient-start': card.gradient.start,
                '--gradient-end': card.gradient.end
              }}
            >
              <div className="kpi-card-header">
                <div className="kpi-card-content">
                  <div className="kpi-label">{card.label}</div>
                  <div className="kpi-value">{card.value}</div>
                  {card.trend && (
                    <span className="trend-chip">
                      ↗ {card.trend}
                    </span>
                  )}
                  {card.subtitle && (
                    <div className="kpi-subtitle">{card.subtitle}</div>
                  )}
                </div>
                <div className="kpi-icon">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="chart-grid">
          <div className="chart-col-8">
            <div className="chart-card">
              <div className="chart-card-header">
                <div className="chart-header-content">
                  <div>
                    <h3 className="chart-title">Revenue Trend</h3>
                    <p className="chart-subtitle">Monthly revenue vs. target</p>
                  </div>
                  <span className="refresh-chip">
                    🔄 Last 6 months
                  </span>
                </div>
              </div>
              <div className="chart-card-content">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: 12, fontWeight: 500 }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: 12, fontWeight: 500 }}
                      />
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                        contentStyle={{
                          borderRadius: 12,
                          border: 'none',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }}
                      />
                      <Legend iconType="circle" />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke={CHART_COLORS.revenue}
                        strokeWidth={3}
                        dot={{ r: 5, fill: CHART_COLORS.revenue, strokeWidth: 2, stroke: '#fff' }}
                        name="Actual Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Target"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-col-4">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-title">Order Status</h3>
                <p className="chart-subtitle">Distribution by status</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-wrapper-small">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.orderStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {stats.orderStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} orders`, name]}
                        contentStyle={{
                          borderRadius: 12,
                          border: 'none',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="status-list">
                  {stats.orderStatus.map((item, index) => (
                    <div key={index} className="status-item">
                      <div className="status-left">
                        <div className="status-dot" style={{ backgroundColor: item.color }} />
                        <span className="status-name">{item.name}</span>
                      </div>
                      <strong className="status-value">
                        {item.value} ({((item.value / stats.kpis.totalOrders) * 100).toFixed(1)}%)
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="chart-col-6">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-title">Customer Segmentation</h3>
                <p className="chart-subtitle">Customer distribution by type</p>
              </div>
              <div className="chart-card-content">
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.customerSegmentation}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: 12, fontWeight: 600 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: 12, fontWeight: 500 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} customers`, 'Count']}
                        contentStyle={{
                          borderRadius: 12,
                          border: 'none',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {stats.customerSegmentation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-col-6">
            <div className="chart-card">
              <div className="chart-card-header">
                <h3 className="chart-title">Performance Metrics</h3>
                <p className="chart-subtitle">Key performance indicators</p>
              </div>
              <div className="chart-card-content">
                <div className="metrics-grid">
                  <div className="metric-box metric-box-primary">
                    <div className="metric-value metric-value-primary">
                      {stats.kpis.conversionRate}%
                    </div>
                    <div className="metric-label">Conversion Rate</div>
                  </div>
                  <div className="metric-box metric-box-success">
                    <div className="metric-value metric-value-success">
                      ${stats.kpis.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="metric-label">This Month Revenue</div>
                  </div>
                </div>

                <div className="performance-section">
                  <h4 className="performance-title">Order Status Overview</h4>
                  {stats.orderStatus.map((status, index) => (
                    <div key={index} className="progress-item">
                      <div className="progress-header">
                        <span
                          className="progress-badge"
                          style={{
                            backgroundColor: `${status.color}15`,
                            color: status.color,
                            borderColor: `${status.color}40`
                          }}
                        >
                          {status.name}
                        </span>
                        <strong className="progress-count">{status.value} orders</strong>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(status.value / stats.kpis.totalOrders) * 100}%`,
                            backgroundColor: status.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;