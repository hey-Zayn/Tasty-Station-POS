import React, { useEffect } from "react";
import {
    TrendingUp, ShoppingBag, Users, Package,
    ArrowUpRight, ArrowDownRight, Clock, ChevronRight,
    Utensils, AlertTriangle, UserCheck, CalendarDays,
    LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useDashboardStore from "@/store/useDashboardStore";
import { format } from "date-fns";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

const AdminDashboard = () => {
    const { dashboardData, isLoading, fetchDashboardSummary } = useDashboardStore();

    useEffect(() => {
        fetchDashboardSummary();
        const interval = setInterval(fetchDashboardSummary, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (!dashboardData && isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[80vh]">
                <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                    <LayoutDashboard className="size-12" />
                    <p className="font-medium">Loading Dashboard Intelligence...</p>
                </div>
            </div>
        );
    }

    const { summary, lowStockItems, recentOrders, recentClients } = dashboardData || {};

    const COLORS = ["#0d9488", "#fbbf24", "#f43f5e", "#64748b"];
    const pieData = summary ? [
        { name: "Occupied", value: summary.occupancy.occupied },
        { name: "Reserved", value: summary.occupancy.reserved },
        { name: "Available", value: summary.occupancy.available }
    ] : [];

    return (
        <div className="p-6 space-y-8 bg-background/50 h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-teal-950">Overview</h1>
                    <p className="text-muted-foreground font-medium">Real-time restaurant performance & intelligence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-teal-500/5 text-teal-700 border-teal-500/20 py-1.5 px-3">
                        <Clock className="size-3 mr-2 animate-pulse" /> Live System Active
                    </Badge>
                </div>
            </div>

            {/* Top Row Stas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Today's Revenue"
                    value={`$${summary?.todayRevenue?.toLocaleString()}`}
                    sub="Gross Earnings"
                    icon={TrendingUp}
                    trend="+12.5%"
                    trendUp={true}
                    color="teal"
                />
                <StatCard
                    label="Total Orders"
                    value={summary?.todayOrders}
                    sub="Completed Transactions"
                    icon={ShoppingBag}
                    trend="+4"
                    trendUp={true}
                    color="amber"
                />
                <StatCard
                    label="Active Staff"
                    value={summary?.activeStaff}
                    sub="On-duty Members"
                    icon={UserCheck}
                    color="indigo"
                />
                <StatCard
                    label="Low Stock Alerts"
                    value={summary?.lowStockCount}
                    sub="Requires Attention"
                    icon={AlertTriangle}
                    trend={summary?.lowStockCount > 0 ? "Critical" : "Stable"}
                    trendUp={false}
                    color={summary?.lowStockCount > 0 ? "rose" : "emerald"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Occupancy Chart */}
                <Card className="lg:col-span-1 shadow-sm border-teal-500/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Utensils className="size-5 text-teal-700" /> Dining Occupancy
                        </CardTitle>
                        <CardDescription>Real-time table status distribution.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                            {pieData.map((d, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-muted-foreground uppercase">{d.name}:</span>
                                    <span>{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders Timeline */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="size-5 text-teal-700" /> Recent Activity
                            </CardTitle>
                            <CardDescription>Live feed of latest transactions.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-teal-700 font-bold group">
                            View All <ChevronRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                                {recentOrders?.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-transparent hover:border-teal-500/20 hover:bg-muted/40 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-background rounded-full flex items-center justify-center shadow-sm border border-muted group-hover:scale-110 transition-transform">
                                                <ShoppingBag className="size-5 text-teal-700" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-teal-950 uppercase tracking-tight">{order.orderId}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.client?.name || "Walk-in"} • {format(new Date(order.createdAt), "hh:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-teal-700">${order.totalAmount.toLocaleString()}</p>
                                            <Badge variant="outline" className="text-[10px] mt-1 scale-90 origin-right">
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <Card className="border-rose-500/10 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-rose-700">
                            <AlertTriangle className="size-5" /> Inventory Warnings
                        </CardTitle>
                        <CardDescription>Items running below critical reorder levels.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {lowStockItems?.map((item) => (
                                <div key={item._id} className="flex items-center justify-between p-3 bg-rose-50/30 border border-rose-100/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 bg-rose-100 rounded flex items-center justify-center">
                                            <Package className="size-4 text-rose-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Category: {item.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-rose-600">{item.quantity} {item.unit}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">Level: {item.reorderLevel}</p>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full mt-2 variant-ghost bg-rose-500 text-white hover:bg-rose-600">
                                Restock Inventory
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* New Customers */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarDays className="size-5 text-teal-700" /> Recently Onboarded
                        </CardTitle>
                        <CardDescription>New additions to your customer directory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[250px] pr-4">
                            <div className="space-y-4">
                                {recentClients?.map((client) => (
                                    <div key={client._id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center font-black text-xs">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-teal-950 uppercase tracking-tight">{client.name}</p>
                                                <p className="text-[10px] text-muted-foreground">Joined {format(new Date(client.createdAt), "MMM d")}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-teal-600">${client.totalSpent.toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">Lifetime</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, sub, icon: Icon, trend, trendUp, color }) => {
    const colorMap = {
        teal: "bg-teal-500",
        amber: "bg-amber-500",
        rose: "bg-rose-500",
        indigo: "bg-indigo-500",
        emerald: "bg-emerald-500"
    };

    return (
        <Card className="overflow-hidden border-none shadow-lg relative group">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">{label}</p>
                        <h3 className="text-3xl font-black tracking-tighter text-teal-950">{value}</h3>
                        <p className="text-xs font-medium text-muted-foreground">{sub}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${colorMap[color]} text-white shadow-lg shadow-${color}-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                        <Icon className="size-5" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center gap-2">
                        {trendUp !== undefined && (
                            <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                {trendUp ? <ArrowUpRight className="size-3 mr-0.5" /> : <ArrowDownRight className="size-3 mr-0.5" />}
                                {trend}
                            </div>
                        )}
                        {trendUp === undefined && (
                            <Badge variant="secondary" className="text-[10px] h-5 font-bold">{trend}</Badge>
                        )}
                    </div>
                )}
            </CardContent>
            <div className={`absolute bottom-0 left-0 h-1 w-full ${colorMap[color]} opacity-30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]`} />
        </Card>
    );
};

export default AdminDashboard;
