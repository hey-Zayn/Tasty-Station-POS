import React, { useEffect, useState } from 'react';
import { useTableStore } from '@/store/useTableStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Grid2x2Check, Calendar, Users, Clock, MoreVertical, Edit, Trash2, LayoutGrid, Armchair } from 'lucide-react';
import { cn } from "@/lib/utils";
import TableCard from '../Components/Tables/TableCard';
import AddTableModal from '../Components/Tables/AddTableModal';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

const AdminTables = () => {
    const { tables, getTables, deleteTable, reserveTable, cancelReservation, isLoading } = useTableStore();
    const [activeZone, setActiveZone] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);

    // Booking Form State
    const [bookingForm, setBookingForm] = useState({
        bookedBy: "",
        contact: "",
        guests: 1,
        date: "",
        notes: ""
    });

    useEffect(() => {
        getTables();
    }, [getTables]);

    // Derived State: Zones
    const zones = ["All", ...new Set(tables.map(t => t.zone))];

    // Filtering
    const filteredTables = tables.filter(table => {
        const matchesZone = activeZone === "All" || table.zone === activeZone;
        const matchesSearch = table.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesZone && matchesSearch;
    });

    const handleAddClick = () => {
        setEditingTable(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (table) => {
        setEditingTable(table);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            await deleteTable(id);
            if (selectedTable?._id === id) setSelectedTable(null);
        }
    };

    const handleTableClick = (table) => {
        setSelectedTable(table);
        // Reset booking form
        setBookingForm({
            bookedBy: "",
            contact: "",
            guests: 1,
            date: new Date().toISOString().slice(0, 16),
            notes: ""
        });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTable) return;

        const result = await reserveTable(selectedTable._id, bookingForm);
        if (result.success) {
            alert("Table reserved successfully!");
            getTables();
        } else {
            alert("Failed to reserve: " + result.message);
        }
    };

    const handleCancelReservation = async () => {
        if (!selectedTable) return;
        if (window.confirm("Cancel this reservation?")) {
            const result = await cancelReservation(selectedTable._id);
            if (result.success) {
                getTables();
            } else {
                alert("Failed to cancel: " + result.message);
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-5rem)] bg-gray-50 dark:bg-black/20 overflow-hidden">

            {/* Left Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-teal-600" />
                            Table Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredTables.length} tables found • {tables.filter(t => t.status === 'Occupied').length} Occupied
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                            <Input
                                placeholder="Search tables..."
                                className="pl-9 w-64 bg-white dark:bg-gray-900 rounded-full border-gray-200 focus:border-teal-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAddClick} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all">
                            <Plus className="h-4 w-4 mr-2" /> Add Table
                        </Button>
                    </div>
                </div>

                {/* Zone Tabs */}
                <div className="px-8 pt-6 pb-2">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {zones.map(zone => (
                            <button
                                key={zone}
                                onClick={() => setActiveZone(zone)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                    activeZone === zone
                                        ? "bg-gray-900 text-white border-gray-900 shadow-md dark:bg-white dark:text-black dark:border-white"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900 dark:bg-transparent dark:border-gray-700 dark:text-gray-400"
                                )}
                            >
                                {zone}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-10 custom-scrollbar">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Grid2x2Check className="h-10 w-10 mb-4 opacity-20 animate-pulse" />
                            <p>Loading layout...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 pt-8 pb-20">
                            {/* Create New Placeholder Card - Moved to Start */}
                            <div
                                onClick={handleAddClick}
                                className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center h-48 cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all group min-h-[12rem]"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900 transition-colors">
                                    <Plus className="h-6 w-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
                                </div>
                                <span className="mt-3 text-sm font-medium text-gray-500 group-hover:text-teal-600">Add New Table</span>
                            </div>

                            {filteredTables.map(table => (
                                <div key={table._id} className="relative group/card flex justify-center">
                                    <TableCard
                                        table={table}
                                        onClick={handleTableClick}
                                    />
                                    {/* Quick Actions (only visible on hover) */}
                                    <div className="absolute top-0 right-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-20">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50 border border-gray-100">
                                                    <MoreVertical className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(table); }}>
                                                    <Edit className="h-4 w-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(table._id); }} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State Logic Check - Only if strictly 0 tables (excluding the add button visually) */}
                            {tables.length === 0 && !isLoading && filteredTables.length === 0 && (
                                <div className="col-span-full py-10 text-center hidden">
                                    {/* Hidden because we show the Add button now */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Stats/Details */}
            <div className={cn(
                "w-[380px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-2xl z-30 transition-transform duration-300 ease-in-out transform",
                selectedTable ? "translate-x-0" : "translate-x-full hidden lg:flex lg:translate-x-0 lg:w-[320px] lg:border-l lg:shadow-none"
            )}>
                {/* Header for Sidebar */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="font-semibold text-lg flex items-center">
                        Details
                    </h2>
                    {selectedTable && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTable(null)} className="lg:hidden">
                            Close
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {selectedTable ? (
                        <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
                            {/* Title Block */}
                            <div className="text-center">
                                <div className="w-20 h-20 bg-teal-50 rounded-full mx-auto flex items-center justify-center mb-4">
                                    <Armchair className="w-10 h-10 text-teal-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedTable.name}</h3>
                                <p className="text-sm text-gray-500">{selectedTable.zone} Zone</p>
                                <div className="mt-3 inline-flex">
                                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                                        selectedTable.status === "Available" ? "bg-teal-100 text-teal-700" :
                                            selectedTable.status === "Occupied" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {selectedTable.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-gray-50/50 border-gray-100 shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Users className="h-5 w-5 text-gray-400 mb-2" />
                                        <span className="text-2xl font-bold">{selectedTable.capacity}</span>
                                        <span className="text-xs text-muted-foreground">Seats</span>
                                    </CardContent>
                                </Card>
                                <Card className="bg-gray-50/50 border-gray-100 shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <Clock className="h-5 w-5 text-gray-400 mb-2" />
                                        <span className="text-xl font-bold">-</span>
                                        <span className="text-xs text-muted-foreground">Active Time</span>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Booking Action */}
                            {selectedTable.status === "Available" ? (
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-semibold text-gray-700">New Reservation</h4>
                                    <form onSubmit={handleBookingSubmit} className="space-y-3">
                                        <div className="space-y-1">
                                            <Label>Guest Name</Label>
                                            <Input
                                                value={bookingForm.bookedBy}
                                                onChange={(e) => setBookingForm({ ...bookingForm, bookedBy: e.target.value })}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Contact Phone</Label>
                                            <Input
                                                value={bookingForm.contact}
                                                onChange={(e) => setBookingForm({ ...bookingForm, contact: e.target.value })}
                                                placeholder="+1 234 567 890"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label>Guests</Label>
                                                <Input
                                                    type="number" min="1" max={selectedTable.capacity}
                                                    value={bookingForm.guests}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, guests: parseInt(e.target.value) })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Time</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={bookingForm.date}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Notes</Label>
                                            <Input
                                                value={bookingForm.notes}
                                                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                                                placeholder="Allergies, intro..."
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                                            Confirm Reservation
                                        </Button>
                                    </form>
                                </div>
                            ) : selectedTable.status === "Reserved" ? (
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Reservation Info
                                    </h4>
                                    <div className="bg-amber-50 p-4 rounded-lg space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Booked By:</span>
                                            <span className="font-medium">{selectedTable.reservation?.bookedBy}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Contact:</span>
                                            <span className="font-medium">{selectedTable.reservation?.contact}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Guests:</span>
                                            <span className="font-medium">{selectedTable.reservation?.guests}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Date:</span>
                                            <span className="font-medium">
                                                {selectedTable.reservation?.date ? new Date(selectedTable.reservation?.date).toLocaleString() : "N/A"}
                                            </span>
                                        </div>
                                        {selectedTable.reservation?.notes && (
                                            <div className="pt-2 border-t border-amber-200">
                                                <p className="text-gray-500 text-xs">Notes:</p>
                                                <p className="italic">{selectedTable.reservation?.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                    <Button onClick={handleCancelReservation} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                                        Cancel Reservation
                                    </Button>
                                </div>
                            ) : null}

                            {/* Action Buttons */}
                            <div className="space-y-3 pt-4 border-t">
                                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={() => handleEditClick(selectedTable)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Table Details
                                </Button>
                                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteClick(selectedTable._id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Table
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-4 opacity-60">
                            <Grid2x2Check className="h-16 w-16 text-gray-200" />
                            <div>
                                <h3 className="text-gray-900 font-medium">No Table Selected</h3>
                                <p className="text-sm">Select a table to see details.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AddTableModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tableToEdit={editingTable}
            />

        </div>
    );
};

export default AdminTables;