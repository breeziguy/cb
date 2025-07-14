import AdminDashboardPage from '@/app/admin/_templates/AdminDashboardPage';
import {
    getTotalCustomers,
    getTotalCreators,
    getTotalBriefs,
    getTopCreators,
    getBriefsLast12Months,
} from '@/lib/admin/stats';
import { supabase } from '@/lib/supabase-admin';

export default async function Page() {
    const [
        totalCustomers,
        totalCreators,
        totalBriefs,
        topCreators,
        briefsLast12Months,
    ] = await Promise.all([
        getTotalCustomers(),
        getTotalCreators(),
        getTotalBriefs(),
        getTopCreators(),
        getBriefsLast12Months(),
    ]);

    console.log('briefsLast12Months', briefsLast12Months);

    return (
        <AdminDashboardPage
            totalCustomers={totalCustomers}
            totalCreators={totalCreators}
            totalBriefs={totalBriefs}
            topCreators={topCreators}
            briefsLast12Months={briefsLast12Months}
        />
    );
} 