import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreVertical,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    ShoppingCart,
    User,
    CreditCard,
    DollarSign,
    Package,
    Download,
    Printer
} from 'lucide-react';

const OrderTable = () => {
    // Demo order data
    const orders = [
        {
            id: "ORD-001",
            customer: "John Smith",
            email: "john.smith@example.com",
            date: "2024-01-15",
            status: "completed",
            method: "Credit Card",
            amount: "$250.00",
            items: 3,
            course: "Web Development Bootcamp"
        },
        {
            id: "ORD-002",
            customer: "Sarah Johnson",
            email: "sarah.j@example.com",
            date: "2024-01-14",
            status: "pending",
            method: "PayPal",
            amount: "$149.99",
            items: 1,
            course: "React Advanced Patterns"
        },
        {
            id: "ORD-003",
            customer: "Michael Chen",
            email: "m.chen@example.com",
            date: "2024-01-13",
            status: "processing",
            method: "Stripe",
            amount: "$499.99",
            items: 2,
            course: "Full Stack Masterclass"
        },
        {
            id: "ORD-004",
            customer: "Emma Wilson",
            email: "emma.w@example.com",
            date: "2024-01-12",
            status: "cancelled",
            method: "Credit Card",
            amount: "$99.99",
            items: 1,
            course: "UI/UX Design Fundamentals"
        },
        {
            id: "ORD-005",
            customer: "David Brown",
            email: "david.b@example.com",
            date: "2024-01-11",
            status: "completed",
            method: "Bank Transfer",
            amount: "$349.99",
            items: 2,
            course: "Data Science Essentials"
        },
        {
            id: "ORD-006",
            customer: "Lisa Anderson",
            email: "lisa.a@example.com",
            date: "2024-01-10",
            status: "completed",
            method: "Credit Card",
            amount: "$199.99",
            items: 1,
            course: "Mobile App Development"
        },
        {
            id: "ORD-007",
            customer: "Robert Taylor",
            email: "rob.t@example.com",
            date: "2024-01-09",
            status: "pending",
            method: "PayPal",
            amount: "$299.99",
            items: 1,
            course: "Cybersecurity Basics"
        },
        {
            id: "ORD-008",
            customer: "Maria Garcia",
            email: "maria.g@example.com",
            date: "2024-01-08",
            status: "processing",
            method: "Stripe",
            amount: "$599.99",
            items: 3,
            course: "AI & Machine Learning"
        }
    ];

    // Status badge configuration
    const getStatusConfig = (status) => {
        switch (status) {
            case 'completed':
                return {
                    label: 'Completed',
                    icon: CheckCircle,
                    variant: 'default',
                    className: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                };
            case 'pending':
                return {
                    label: 'Pending',
                    icon: Clock,
                    variant: 'secondary',
                    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
                };
            case 'processing':
                return {
                    label: 'Processing',
                    icon: TrendingUp,
                    variant: 'default',
                    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                };
            case 'cancelled':
                return {
                    label: 'Cancelled',
                    icon: XCircle,
                    variant: 'destructive',
                    className: 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                };
            default:
                return {
                    label: status,
                    icon: Clock,
                    variant: 'outline'
                };
        }
    };

    // Payment method configuration
    const getMethodConfig = (method) => {
        switch (method) {
            case 'Credit Card':
                return {
                    icon: CreditCard,
                    className: 'text-blue-600'
                };
            case 'PayPal':
                return {
                    icon: DollarSign,
                    className: 'text-blue-500'
                };
            case 'Stripe':
                return {
                    icon: CreditCard,
                    className: 'text-purple-600'
                };
            case 'Bank Transfer':
                return {
                    icon: DollarSign,
                    className: 'text-green-600'
                };
            default:
                return {
                    icon: CreditCard,
                    className: 'text-gray-600'
                };
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full bg-card rounded-lg border p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
                    <p className="text-sm text-muted-foreground">
                        Overview of your recent course purchases
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                            const statusConfig = getStatusConfig(order.status);
                            const methodConfig = getMethodConfig(order.method);
                            const StatusIcon = statusConfig.icon;
                            const MethodIcon = methodConfig.icon;

                            return (
                                <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                            {order.id}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{order.customer}</div>
                                            <div className="text-sm text-muted-foreground">{order.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.course}</div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Package className="h-3 w-3" />
                                            {order.items} item{order.items > 1 ? 's' : ''}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(order.date)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`inline-flex items-center gap-1 ${statusConfig.className}`}
                                        >
                                            <StatusIcon className="h-3 w-3" />
                                            {statusConfig.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MethodIcon className={`h-4 w-4 ${methodConfig.className}`} />
                                            <span>{order.method}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {order.amount}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <User className="h-4 w-4" />
                                                    Contact Customer
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive">
                                                    <XCircle className="h-4 w-4" />
                                                    Cancel Order
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                    Showing {orders.length} of {orders.length} orders
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                        1
                    </Button>
                    <Button variant="outline" size="sm">
                        2
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderTable;