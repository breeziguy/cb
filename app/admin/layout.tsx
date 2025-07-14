import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Default redirect if profile is not found, could be a new user
    return redirect('/dashboard');
  }
  
  const role = profile.role;

  if (role === 'admin') {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex flex-col w-full ml-85 max-4xl:ml-70 max-3xl:ml-60 max-xl:ml-0">
          <AdminHeader />
          <main className="p-6 pt-22">{children}</main>
        </div>
      </div>
    );
  }
  
  if (role === 'creator') {
    return redirect('/creators');
  }

  return redirect('/dashboard'); // default for customer or unknown
} 