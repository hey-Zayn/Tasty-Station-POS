import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    DollarSign,
    Users,
    Package,
    Clock,
    BarChart3,
    PieChart as PieChartIcon,
    Activity
} from 'lucide-react'
import { PieChartDashboard } from '../components/PieChartDashboard'
import { ChartRadarDotsDashboard } from '../components/ChartRadarDotsDashboard'
import OrderTable from '../components/OrderTable'

const DashboardHome = () => {
    // Mock data for POS dashboard
    const stats = [
        {
            title: "Total Revenue",
            value: "Rs 52,480",
            change: "+12.5%",
            isPositive: true,
            icon: <DollarSign className="h-5 w-5" />,
            period: "This Month",
            color: "bg-cyan-500/10 text-cyan-700"
        },
        {
            title: "Total Orders",
            value: "1,284",
            change: "+8.2%",
            isPositive: true,
            icon: <ShoppingBag className="h-5 w-5" />,
            period: "Today",
            color: "bg-cyan-500/10 text-cyan-700"
        },
        {
            title: "Average Order Value",
            value: "Rs 2,450",
            change: "+5.3%",
            isPositive: true,
            icon: <BarChart3 className="h-5 w-5" />,
            period: "This Month",
            color: "bg-cyan-500/10 text-cyan-700"
        },
        {
            title: "Pending Orders",
            value: "24",
            change: "-3.2%",
            isPositive: false,
            icon: <Clock className="h-5 w-5" />,
            period: "Awaiting Process",
            color: "bg-orange-500/10 text-orange-700"
        }
    ];

    const quickActions = [
        { title: "New Sale", icon: <ShoppingBag className="h-4 w-4" />, color: "bg-cyan-700 hover:bg-cyan-800" },
        { title: "Add Product", icon: <Package className="h-4 w-4" />, color: "bg-cyan-700 hover:bg-cyan-800" },
        { title: "View Inventory", icon: <Activity className="h-4 w-4" />, color: "bg-cyan-700 hover:bg-cyan-800" },
        { title: "Customer List", icon: <Users className="h-4 w-4" />, color: "bg-cyan-700 hover:bg-cyan-800" }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            {/* Header */}
            {/* <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">POS Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of your point of sale operations and analytics</p>
            </div> */}

            {/* Quick Actions */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className={`${action.color} text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm`}
                        >
                            {action.icon}
                            <span className="font-medium text-sm">{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.color.split(' ')[0]}`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge
                                            variant="outline"
                                            className={`flex items-center gap-1 border-none ${stat.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}
                                        >
                                            {stat.isPositive ? (
                                                <TrendingUp className="h-3 w-3" />
                                            ) : (
                                                <TrendingDown className="h-3 w-3" />
                                            )}
                                            {stat.change}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {stat.period}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Analytics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales by Category */}
                    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <PieChartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                            </div>
                            <CardDescription>
                                Revenue distribution across product categories
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <PieChartDashboard />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Metrics */}
                    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
                            </div>
                            <CardDescription>
                                Key performance indicators over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ChartRadarDotsDashboard />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Latest transactions and order status</p>
                    </div>
                    <button className="px-4 py-2 bg-cyan-700 text-white text-sm font-medium rounded-lg hover:bg-cyan-800 transition-colors">
                        View All Orders
                    </button>
                </div>

                <div className="">
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <OrderTable />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Top Selling Product
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-cyan-700" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Wireless Earbuds Pro</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">48 units sold today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Peak Hour
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                <Clock className="h-5 w-5 text-cyan-700" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">2:00 PM - 4:00 PM</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Most orders placed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Customer Satisfaction
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-cyan-700" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">94.2%</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Positive feedback rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardHome