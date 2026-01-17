import React, { useEffect, useMemo, useState } from 'react';
import useKitchenStore from '@/store/useKitchenStore';
import { Flame, Timer, CheckCircle2, ChevronRight } from 'lucide-react';

// Modular Components
// import KitchenHeader from '../components/kitchen/KitchenHeader';
import KitchenColumn from '../components/kitchen/KitchenColumn';

const KitchenDashboard = () => {
    const { kitchenOrders, fetchKitchenOrders, updateStatus } = useKitchenStore();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        handleRefresh();
        const interval = setInterval(fetchKitchenOrders, 15000); // Live sync every 15s
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchKitchenOrders();
        setIsRefreshing(false);
    };

    const ordersByStatus = useMemo(() => ({
        Pending: kitchenOrders.filter(o => o.status === "Pending"),
        Preparing: kitchenOrders.filter(o => o.status === "Preparing"),
        Ready: kitchenOrders.filter(o => o.status === "Ready"),
    }), [kitchenOrders]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0C0D] p-6 md:p-10 transition-colors duration-500">
            <div className="max-w-[1800px] mx-auto">
                {/* <KitchenHeader
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                /> */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Incoming Column */}
                    <KitchenColumn
                        title="Incoming"
                        icon={Flame}
                        orders={ordersByStatus.Pending}
                        onUpdate={updateStatus}
                        nextStatus="Preparing"
                        actionLabel="Accept Order"
                        actionIcon={ChevronRight}
                    />

                    {/* In Preparation Column */}
                    <KitchenColumn
                        title="In Preparation"
                        icon={Timer}
                        orders={ordersByStatus.Preparing}
                        onUpdate={updateStatus}
                        nextStatus="Ready"
                        actionLabel="Finish Cooking"
                        actionIcon={CheckCircle2}
                    />

                    {/* Ready for Pickup Column */}
                    <KitchenColumn
                        title="Ready for Pickup"
                        icon={CheckCircle2}
                        orders={ordersByStatus.Ready}
                        onUpdate={updateStatus}
                        nextStatus="Completed"
                        actionLabel="Mark Distributed"
                        actionIcon={CheckCircle2}
                    />
                </div>
            </div>
        </div>
    );
};

export default KitchenDashboard;
