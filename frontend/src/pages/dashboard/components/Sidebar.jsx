import React, { useState } from 'react'
import {
    BadgeQuestionMark,
    BringToFront,
    Grid2x2Check,
    Hamburger,
    LayoutDashboard,
    LogOut,
    Settings,
    UserRoundCog,
    Users,
    ChevronLeft,
    ChevronRight,
    Package,
    ChefHat,
    UserCog,
    HelpCircle,
    Bell,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/useAuthStore'

const Sidebar = () => {

    const { logout } = useAuthStore()


    const [collapsed, setCollapsed] = useState(false)
    const [activeItem, setActiveItem] = useState('dashboard')

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 0, link: '/dashboard' },
        { id: 'orders', label: 'Order Line', icon: BringToFront, badge: 3, link: '/orders' },
        { id: 'tables', label: 'Manage Tables', icon: Grid2x2Check, badge: 0, link: '/tables' },
        { id: 'dishes', label: 'Manage Dishes', icon: Hamburger, badge: 12, link: '/dishes' },
        { id: 'inventory', label: 'Inventory', icon: Package, badge: 5, link: '/inventory' },
        { id: 'staff', label: 'Staff Management', icon: ChefHat, badge: 0, link: '/staff' },
        { id: 'users', label: 'Manage Users', icon: UserRoundCog, badge: 0, link: '/users' },
        { id: 'customers', label: 'Customers', icon: Users, badge: 0, link: '/customers' },
    ]

    const bottomItems = [
        { id: 'settings', label: 'Settings', icon: Settings, link: '/settings' },
        { id: 'help', label: 'Help Center', icon: HelpCircle, link: '/help' },
    ]

    return (
        <aside className={cn(
            "sticky top-15 flex flex-col h-[90vh] bg-background border-r transition-all duration-300",
            collapsed ? "w-20" : "w-64"
        )}>
            {/* Header */}
            <div className="p-6 border-b">
                <div className={cn(
                    "flex items-center justify-between",
                    collapsed && "justify-center"
                )}>
                    {!collapsed && (
                        <div className="flex items-center gap-3">
                            <div className="size-9 bg-cyan-700 rounded-lg flex items-center justify-center shadow-lg">
                                <Hamburger className="size-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">TastyStation</h1>
                                <p className="text-xs text-muted-foreground">Admin Panel</p>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="size-10 bg-cyan-700 rounded-lg flex items-center justify-center">
                            <Hamburger className="size-5 text-primary-foreground hidden " />
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <ChevronRight className="size-4" />
                        ) : (
                            <ChevronLeft className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeItem === item.id

                        return (
                            <Link key={item.id} to={item.link}>
                                <div
                                    onClick={() => setActiveItem(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group cursor-pointer",
                                        "hover:bg-muted hover:text-foreground",
                                        isActive
                                            ? "bg-cyan-700 text-primary-foreground shadow-sm"
                                            : "text-muted-foreground",

                                    )}
                                >
                                    <div className="relative">
                                        <Icon className={cn(
                                            "size-5 transition-transform",
                                            isActive && "text-primary-foreground",
                                            collapsed && "mx-auto"
                                        )} />
                                        {item.badge > 0 && (
                                            <span className={cn(
                                                "absolute -top-1.5 -right-1.5 size-5 rounded-full text-xs font-medium flex items-center justify-center",
                                                isActive
                                                    ? "bg-cyan-700 text-primary-foreground"
                                                    : "bg-cyan-700 text-primary-foreground"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {!collapsed && (
                                        <>
                                            <span className="font-medium flex-1 text-left">{item.label}</span>
                                            {isActive && (
                                                <div className="size-1.5 rounded-full bg-cyan-700/50 animate-pulse" />
                                            )}
                                        </>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 space-y-1">
                {bottomItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeItem === item.id

                    return (
                        <Link key={item.id} to={item.link}>
                            <div
                                onClick={() => setActiveItem(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                                    "hover:bg-muted hover:text-foreground",
                                    isActive
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className={cn(
                                    "size-5",
                                    collapsed && "mx-auto"
                                )} />
                                {!collapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </div>
                        </Link>
                    )
                })}



                {/* Logout Button */}
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut className="size-5" />
                    {!collapsed && (
                        <span className="font-medium">Logout</span>
                    )}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar