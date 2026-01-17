import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { useTableStore } from '@/store/useTableStore';

const AddTableModal = ({ isOpen, onClose, tableToEdit = null }) => {
    const { createTable, updateTable, isLoading } = useTableStore();

    // Zones - could be dynamic later
    const ZONES = ["Indoor", "Outdoor", "VIP", "Terrace", "Bar"];
    const STATUSES = ["Available", "Occupied", "Reserved"];

    const [formData, setFormData] = useState({
        name: "",
        capacity: 4,
        zone: "Indoor",
        status: "Available"
    });

    useEffect(() => {
        if (tableToEdit) {
            setFormData({
                name: tableToEdit.name,
                capacity: tableToEdit.capacity,
                zone: tableToEdit.zone,
                status: tableToEdit.status
            });
        } else {
            setFormData({ name: "", capacity: 4, zone: "Indoor", status: "Available" });
        }
    }, [tableToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let result;
        if (tableToEdit) {
            result = await updateTable(tableToEdit._id, formData);
        } else {
            result = await createTable(formData);
        }

        if (result.success) {
            onClose();
        } else {
            alert(result.message || "Operation failed");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{tableToEdit ? "Edit Table" : "Add New Table"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Table Name</Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            placeholder="e.g. T-01"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">Capacity</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            className="col-span-3"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="zone" className="text-right">Zone</Label>
                        <select
                            id="zone"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.zone}
                            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        >
                            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <select
                            id="status"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-teal-600 hover:bg-teal-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {tableToEdit ? "Update Table" : "Create Table"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTableModal;
