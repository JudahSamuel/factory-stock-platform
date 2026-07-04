import AdminSidebar from "./AdminSidebar";
import LanguageToggle from "./LanguageToggle";

export default function AdminLayout({ children }) {

    return (

        <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

            {/* Sidebar */}

            <AdminSidebar />

            {/* Main Content */}

            <div className="flex-1 flex flex-col">

                {/* Top Navbar */}

                <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-800">

                            Lasya Enterprises ERP

                        </h1>

                        <p className="text-sm text-gray-500">

                            Enterprise Resource Planning System

                        </p>

                    </div>

                    <div className="flex items-center gap-4">

                        <LanguageToggle />

                    </div>

                </header>

                {/* Page Content */}

                <main className="flex-1 p-8">

                    {children}

                </main>

            </div>

        </div>

    );

}