import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import LoginPage from '@/components/pages/LoginPage';
import DashboardPage from '@/components/pages/DashboardPage';
import OrdersPage from '@/components/pages/OrdersPage';
import OrderDetailPage from '@/components/pages/OrderDetailPage';
import OrderFormPage from '@/components/pages/OrderFormPage';
import UsersPage from '@/components/pages/UsersPage';
import UserFormPage from '@/components/pages/UserFormPage';
import ReportsPage from '@/components/pages/ReportsPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "orders/new",
        element: <OrderFormPage />,
      },
      {
        path: "orders/:id",
        element: <OrderDetailPage />,
      },
      {
        path: "orders/:id/edit",
        element: <OrderFormPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/new",
        element: <UserFormPage />,
      },
      {
        path: "users/:id/edit",
        element: <UserFormPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
