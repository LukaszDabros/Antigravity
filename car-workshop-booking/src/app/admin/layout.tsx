import AdminSidebar from '@/components/admin/Sidebar';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-black text-zinc-100">
            <AdminSidebar />
            <main className="flex-1 h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
