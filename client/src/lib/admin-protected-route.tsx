import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type AdminProtectedRouteProps = {
  path?: string;
  component?: () => React.JSX.Element;
  children?: React.ReactNode;
};

export function AdminProtectedRoute({ path, component: Component, children }: AdminProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return path ? (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return path ? (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    ) : (
      <Redirect to="/dashboard" />
    );
  }

  if (path && Component) {
    return <Route path={path} component={Component} />;
  }
  
  return <>{children}</>;
}
