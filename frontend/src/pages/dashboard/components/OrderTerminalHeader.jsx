import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, RefreshCcw, Search, X } from "lucide-react";


const OrderTerminalHeader = ({
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    filter,
    setFilter,
    stats,
    isLoading,
    onRefresh
}) => {
    const statusTabs = [
        { id: 'all', label: 'All', value: 'All', count: stats?.total || 0 },
        { id: 'pending', label: 'Incoming', value: 'Pending', count: stats?.pending || 0 },
        { id: 'preparing', label: 'Preparing', value: 'Preparing', count: stats?.preparing || 0 },
        { id: 'ready', label: 'Ready', value: 'Ready', count: stats?.ready || 0 },
        { id: 'completed', label: 'Completed', value: 'Completed', count: stats?.completed || 0 },
    ];



    return (
        <header className="space-y-8 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                        Order <span className="text-teal-500 italic">Terminal</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">
                        {stats?.total || 0} tickets synced
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('card')}
                            className={cn(
                                "gap-2 rounded-xl transition-all font-bold px-4",
                                viewMode === 'card'
                                    ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-md scale-[1.02]"
                                    : "text-gray-500 hover:text-teal-500"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                            Cards
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className={cn(
                                "gap-2 rounded-xl transition-all font-bold px-4",
                                viewMode === 'table'
                                    ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-md scale-[1.02]"
                                    : "text-gray-500 hover:text-teal-500"
                            )}
                        >
                            <List className="h-4 w-4" />
                            Table
                        </Button>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                        <Input
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-teal-500/20 font-medium"
                        />
                    </div>

                    <Button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="h-12 px-6 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 gap-3 border-none"
                    >
                        <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        Sync
                    </Button>
                </div>
            </div>

            <Tabs value={filter} onValueChange={setFilter} className="w-full">
                <TabsList className="h-auto p-0 bg-transparent gap-4">
                    {statusTabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.value}
                            className={cn(
                                "group relative px-8 py-3.5 rounded-2xl border-2 transition-all font-black uppercase tracking-tighter text-sm",
                                filter === tab.value
                                    ? "bg-teal-500 border-teal-500 text-white shadow-xl shadow-teal-500/20"
                                    : "bg-gray-100 dark:bg-gray-800/50 border-transparent text-gray-500 hover:bg-white dark:hover:bg-gray-800"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                {tab.label}
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded-lg text-xs",
                                    filter === tab.value ? "bg-white text-teal-600" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                )}>
                                    {tab.count}
                                </span>
                            </span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </header>
    );
};

export default OrderTerminalHeader;