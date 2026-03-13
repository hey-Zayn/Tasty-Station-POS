import React, { useEffect, useState, useMemo } from 'react';
import { useInventoryStore } from '@/store/useInventoryStore';
import {
    Package,
    Plus,
    Search,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    MoreVertical,
    Edit,
    Trash2,
    RefreshCw,
    Filter,
    ArrowUpDown,
    CheckCircle2
} from 'lucide-react';
import Pagination from '@/components/ui/custom-pagination';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';

const Inventory = () => {
    const { items, stats, isLoading, fetchInventory, fetchReports, addStockItem, updateStockItem, deleteStockItem, pagination } = useInventoryStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        quantity: 0,
        unit: "pcs",
        reorderLevel: 10,
        supplier: "",
        costPerUnit: 0
    });

    useEffect(() => {
        fetchInventory(1, 10);
        fetchReports();
    }, [fetchInventory, fetchReports]);

    const handlePageChange = (newPage) => {
        fetchInventory(newPage, 10);
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchTerm, selectedCategory]);

    const categories = useMemo(() => {
        const cats = new Set(items.map(item => item.category));
        return ["All", ...Array.from(cats)];
    }, [items]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === "quantity" || name === "reorderLevel" || name === "costPerUnit" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingItem) {
            await updateStockItem(editingItem._id, formData);
        } else {
            await addStockItem(formData);
        }
        setIsAddDialogOpen(false);
        setEditingItem(null);
        setFormData({ name: "", category: "", quantity: 0, unit: "pcs", reorderLevel: 10, supplier: "", costPerUnit: 0 });
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            reorderLevel: item.reorderLevel,
            supplier: item.supplier || "",
            costPerUnit: item.costPerUnit || 0
        });
        setIsAddDialogOpen(true);
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-white dark:bg-[#0F1113] min-h-screen transition-colors duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* <div className="space-y-1">
                    <h1 className="text-4xl font-[1000] tracking-tighter text-gray-900 dark:text-white flex items-center gap-3">
                        <Package className="h-10 w-10 text-teal-600" />
                        Inventory Control
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manage your warehouse and supply chain metrics</p>
                </div> */}


            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Total Items",
                        value: stats?.totalItems || 0,
                        icon: Package,
                        color: "text-blue-600",
                        bg: "bg-blue-50 dark:bg-blue-950/30",
                        borderColor: "border-blue-100 dark:border-blue-900/30",
                        description: "Stock items tracked",
                        trend: { value: "+12.5%", positive: true },
                        trending: true
                    },
                    {
                        label: "Low Stock",
                        value: stats?.lowStockCount || 0,
                        icon: AlertTriangle,
                        color: "text-amber-600",
                        bg: "bg-amber-50 dark:bg-amber-950/30",
                        borderColor: "border-amber-100 dark:border-amber-900/30",
                        description: "Below reorder threshold",
                        alert: (stats?.lowStockCount > 0),
                        status: "Requires Attention"
                    },
                    {
                        label: "Asset Value",
                        value: `$${(stats?.totalValue || 0).toLocaleString()}`,
                        icon: DollarSign,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50 dark:bg-emerald-950/30",
                        borderColor: "border-emerald-100 dark:border-emerald-900/30",
                        description: "Total inventory value",
                        trend: { value: "+5.2%", positive: true },
                        trending: true
                    },
                    {
                        label: "Reorders",
                        value: stats?.lowStockCount || 0,
                        icon: RefreshCw,
                        color: "text-purple-600",
                        bg: "bg-purple-50 dark:bg-purple-950/30",
                        borderColor: "border-purple-100 dark:border-purple-900/30",
                        description: "Pending procurement tasks",
                        status: "Active Tasks"
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <Card className={cn(
                            "h-full border overflow-hidden transition-all duration-200",
                            "hover:shadow-lg hover:border-border/70",
                            stat.borderColor,
                            stat.alert && "ring-1 ring-amber-500/20"
                        )}>
                            <CardContent className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2.5 rounded-lg shadow-sm",
                                            stat.bg,
                                            stat.alert && "animate-pulse"
                                        )}>
                                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {stat.label}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                {stat.trending && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            "h-5 px-1.5 text-xs font-normal",
                                                            stat.trend.positive
                                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                                : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                                                        )}
                                                    >
                                                        {stat.trend.value}
                                                    </Badge>
                                                )}
                                                {stat.status && (
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "h-5 px-1.5 text-xs border",
                                                            stat.alert
                                                                ? "border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-400"
                                                                : "border-border text-muted-foreground"
                                                        )}
                                                    >
                                                        {stat.status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Value Display */}
                                <div className="space-y-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className={cn(
                                            "text-2xl font-bold",
                                            stat.alert ? "text-amber-700 dark:text-amber-400" : "text-foreground"
                                        )}>
                                            {stat.value}
                                        </span>

                                        {stat.trending && (
                                            <span className={cn(
                                                "text-xs font-medium flex items-center",
                                                stat.trend.positive
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-rose-600 dark:text-rose-400"
                                            )}>
                                                {stat.trend.positive ? (
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 mr-1" />
                                                )}
                                                {stat.trend.value}
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {stat.description}
                                    </p>




                                    {/* Action Button for reorders */}
                                    {stat.label === "Reorders" && stats?.lowStockCount > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                        >
                                            <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                            Process Reorders
                                        </Button>
                                    )}
                                </div>

                                {/* Decorative Element */}
                                <div className={cn(
                                    "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                    stat.alert
                                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                        : stat.color === "text-blue-600"
                                            ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                            : stat.color === "text-emerald-600"
                                                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                                                : "bg-gradient-to-r from-purple-400 to-purple-600"
                                )} />
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between pb-2">
                <div className="relative w-full md:w-96  group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                    <Input
                        placeholder="Search items, categories, or suppliers..."
                        className="pl-12 h-14 bg-white dark:bg-teal-900/20 rounded-full border-2 border-teal-600 ring-1 ring-black/5 shadow-inner focus-visible:ring-2 focus-visible:ring-teal-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">



                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => { fetchInventory(); fetchReports(); }}
                            className="rounded-full border-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
                        </Button>

                        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                            setIsAddDialogOpen(open);
                            if (!open) {
                                setEditingItem(null);
                                setFormData({ name: "", category: "", quantity: 0, unit: "pcs", reorderLevel: 10, supplier: "", costPerUnit: 0 });
                            }
                        }}>
                            <DialogTrigger asChild>
                                <Button className="h-12 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-teal-600/20 transition-all active:scale-95 flex gap-2">
                                    <Plus className="h-5 w-5" />
                                    New Stock Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 border-none ring-1 ring-black/5 bg-white dark:bg-gray-900">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                                    <DialogDescription className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Enter item details for warehouse tracking</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Item Name</Label>
                                            <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g., Tomato Ketchup" className="rounded-xl border-2 h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Category</Label>
                                            <Input name="category" value={formData.category} onChange={handleFormChange} placeholder="e.g., Sauces" className="rounded-xl border-2 h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Unit</Label>
                                            <Input name="unit" value={formData.unit} onChange={handleFormChange} placeholder="e.g., kg, pcs" className="rounded-xl border-2 h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Current Quantity</Label>
                                            <Input name="quantity" type="number" value={formData.quantity} onChange={handleFormChange} className="rounded-xl border-2 h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Reorder Level</Label>
                                            <Input name="reorderLevel" type="number" value={formData.reorderLevel} onChange={handleFormChange} className="rounded-xl border-2 h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Cost Per Unit (Rs)</Label>
                                            <Input name="costPerUnit" type="number" value={formData.costPerUnit} onChange={handleFormChange} className="rounded-xl border-2 h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase text-gray-400 tracking-wider">Supplier</Label>
                                            <Input name="supplier" value={formData.supplier} onChange={handleFormChange} placeholder="e.g., Green Farm Co." className="rounded-xl border-2 h-12" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 font-black uppercase tracking-widest text-white rounded-2xl shadow-xl shadow-teal-600/20">
                                            {editingItem ? "Update Item" : "Save Stock Item"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>



                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-14 px-6 rounded-full border border-teal-800 ring-1 ring-black/5 text-teal-600 dark:bg-transparent flex gap-2 font-black uppercase text-xs tracking-widest">
                                    <Filter className="h-4 w-4" />
                                    {selectedCategory === "All" ? "All Categories" : selectedCategory}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-xl p-2 min-w-[200px] border-none shadow-2xl bg-white dark:bg-teal-900">
                                {categories.map(cat => (
                                    <DropdownMenuItem
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className="rounded-xl h-10 font-bold uppercase text-[10px] tracking-widest cursor-pointer hover:bg-teal-600"
                                    >
                                        {cat}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-[#16191C] rounded-md shadow-md border border-gray-200 dark:border-teal-800 overflow-hidden">
                <Table>
                    <TableHeader className="bg-teal-600 dark:bg-teal-900/90">
                        <TableRow className="h-16 border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="w-[300px] text-white font-black uppercase text-[10px] tracking-widest pl-8">Stock Item</TableHead>
                            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Category</TableHead>
                            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right">In Stock</TableHead>
                            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right">Unit Cost</TableHead>
                            <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item, idx) => {
                                const isLowStock = item.quantity <= item.reorderLevel;
                                return (
                                    <motion.tr
                                        key={item._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group h-20 border-b border-gray-100 dark:border-gray-800 hover:bg-teal-50/20 dark:hover:bg-teal-900/10 transition-colors"
                                    >
                                        <TableCell className="pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-inner", isLowStock ? "bg-amber-100/50 text-amber-600" : "bg-teal-100/50 text-teal-600")}>
                                                    {item.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-white capitalize leading-tight">{item.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.supplier || "Internal Store"}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-lg h-7 font-black uppercase text-[9px] tracking-widest bg-gray-50 dark:bg-gray-800 border-none text-gray-500">
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {isLowStock ? (
                                                <div className="flex items-center justify-center gap-1.5 text-amber-600">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span className="text-[10px] font-[1000] uppercase tracking-tighter">Low Stock</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-[10px] font-[1000] uppercase tracking-tighter">Healthy</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <p className={cn("text-base font-black tracking-tight", isLowStock ? "text-amber-600" : "dark:text-white")}>
                                                {item.quantity} <span className="text-[10px] font-bold text-gray-400 lowercase">{item.unit}</span>
                                            </p>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Min: {item.reorderLevel}</p>
                                        </TableCell>
                                        <TableCell className="text-right font-black text-gray-900 dark:text-white">
                                            Rs {item.costPerUnit?.toLocaleString() || 0}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteStockItem(item._id)} className="h-9 w-9 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </TableBody>
                </Table>

                <div className="p-4 border-t bg-gray-50/10 dark:bg-gray-800/5">
                    <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </div>

                {filteredItems.length === 0 && !isLoading && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="h-20 w-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300">
                            <Search size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">No Items Matching</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Try adjusting your filters or search keywords</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
