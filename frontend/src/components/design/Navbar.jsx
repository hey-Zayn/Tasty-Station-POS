import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Bell, Search, Menu, Settings, Sun, Moon, Computer, LogOut, User, CreditCard, Users, Check } from 'lucide-react'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useThemeStore } from '../../store/useThemeStore'
import { useAuthStore } from '../../store/useAuthStore'

const Navbar = () => {
    const { logout, authUser } = useAuthStore();
    const { theme, setTheme } = useThemeStore();

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-16 items-center px-4 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="size-7 bg-cyan-700 rounded-md flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">TS</span>
                    </div>
                    <h1 className="text-lg font-bold">
                        Tasty<span className="font-normal text-muted-foreground">Station</span>
                    </h1>
                </div>

                {/* Search - Desktop */}
                {authUser && <div className="hidden lg:flex flex-1 max-w-sm mx-8">
                    <div className="relative w-full group rounded-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-transparent"
                        />
                    </div>
                </div>}

                {/* Right Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Mobile Actions */}
                    {authUser && <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Search"
                    >
                        <Search className="h-5 w-5" />
                    </Button>}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        {authUser && <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full border border-background" />
                        </Button>}


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Theme settings"
                                    className="h-9 w-9 rounded-md hover:bg-accent transition-colors"
                                >
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-48 bg-background border-border shadow-lg rounded-lg"
                            >
                                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Theme
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-border my-1" />

                                <div className="p-1 space-y-0.5">
                                    <DropdownMenuItem
                                        className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors flex items-center gap-2"
                                        onClick={() => setTheme("light")}
                                    >
                                        <div className="flex items-center justify-center h-5 w-5">
                                            <Sun className="h-4 w-4" />
                                        </div>
                                        <span>Light</span>
                                        {theme === "light" && (
                                            <Check className="h-3 w-3 ml-auto text-primary" />
                                        )}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors flex items-center gap-2"
                                        onClick={() => setTheme("dark")}
                                    >
                                        <div className="flex items-center justify-center h-5 w-5">
                                            <Moon className="h-4 w-4" />
                                        </div>
                                        <span>Dark</span>
                                        {theme === "dark" && (
                                            <Check className="h-3 w-3 ml-auto text-primary" />
                                        )}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors flex items-center gap-2"
                                        onClick={() => setTheme("system")}
                                    >
                                        <div className="flex items-center justify-center h-5 w-5">
                                            <Computer className="h-4 w-4" />
                                        </div>
                                        <span>System</span>
                                        {theme === "system" && (
                                            <Check className="h-3 w-3 ml-auto text-primary" />
                                        )}
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {
                        authUser && <div className="flex items-center gap-3 pl-3 border-l">
                            <div className="flex flex-col items-end max-sm:hidden lg:block">
                                <span className="text-sm font-medium">{authUser.name}</span>
                                {/* <span className="text-xs text-muted-foreground">Admin</span> */}
                            </div>

                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 p-0 rounded-full overflow-hidden hover:bg-muted"
                                aria-label="User profile"
                            >
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Avatar className="h-full w-full">
                                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                JD
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="relative h-10 w-10 rounded-full p-0 hover:bg-accent transition-colors"
                                            >
                                                <Avatar className="h-full w-full ring-2 ring-background">
                                                    <AvatarImage
                                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                                                        alt="User avatar"
                                                    />
                                                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                                                        JD
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56 bg-background border-border shadow-lg rounded-lg"
                                        >
                                            <DropdownMenuLabel className="p-3 text-sm font-semibold">
                                                My Account
                                            </DropdownMenuLabel>

                                            <DropdownMenuSeparator className="bg-border" />

                                            <div className="p-1">
                                                <DropdownMenuItem className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors">
                                                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    Profile
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors">
                                                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    Billing
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors">
                                                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    Team
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="px-3 py-2.5 text-sm cursor-pointer rounded-md hover:bg-accent focus:bg-accent transition-colors">
                                                    <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    Settings
                                                </DropdownMenuItem>
                                            </div>

                                            <DropdownMenuSeparator className="bg-border" />

                                            <div className="p-2">
                                                <Button
                                                    onClick={logout}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="w-full justify-start text-sm font-medium py-2 px-3"
                                                >
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Log out
                                                </Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </DropdownMenu>
                            </Button>
                        </div>
                    }

                    {/* User Profile */}

                </div>
            </div>
        </nav>
    )
}

export default Navbar