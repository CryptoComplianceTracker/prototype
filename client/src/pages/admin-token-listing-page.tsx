import TokenRegistrationList from "@/components/token-registration-list";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";
import { Loader2 } from "lucide-react";

export default function AdminTokenListingPage() {
  return (
    <AdminProtectedRoute>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Token Management</h1>
        <TokenRegistrationList isAdmin={true} />
      </div>
    </AdminProtectedRoute>
  );
}