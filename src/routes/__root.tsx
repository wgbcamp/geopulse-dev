import { createRootRoute, Link, Outlet, HeadContent, Navigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Header } from '../components/Header';
import DataExplainer from '@/components/dataExplainer';

const RootComponent = () => {
  return (
    <>
      <HeadContent />
      <DataExplainer />
      <Header />
      <Outlet />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <Navigate to="/" />
})
