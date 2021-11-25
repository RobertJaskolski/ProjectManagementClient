import React, { lazy, Suspense } from 'react';
import AuthSpinner from 'components/AuthSpinner/AuthSpinner';
import { Redirect } from 'react-router-dom';

// Layouts
import AuthLayout from 'layouts/AuthLayout/AuthLayout';
import MainLayout from 'layouts/MainLayout/MainLayout';

// paths
export const getLoginPath = '/auth/login';
export const getRegisterPath = '/auth/register';
export const getForgotPasswordPath = '/auth/forgotpassword';
export const getDashboardPath = '/dashboard/overview';
export const getUserDetailsPath = '/user/details';

// containers
const Login = lazy(() => import('containers/Login/Login'));
const Register = lazy(() => import('containers/Register/Register'));
const ForgotPassword = lazy(() => import('containers/ForgotPassword/ForgotPassword'));
const Dashboard = lazy(() => import('containers/Dashboard/Dashboard'));
const UserDetails = lazy(() => import('containers/UserDetails/UserDetails'));

export const routes = [
  {
    path: `${getDashboardPath}`,
    exact: true,
    name: 'Dashboard',
    state: 'dashboard',
    component: () => (
      <MainLayout>
        <Suspense fallback={<AuthSpinner />}>
          <Dashboard />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: `${getUserDetailsPath}`,
    exact: true,
    name: 'UserDetails',
    state: 'userDetails',
    component: () => (
      <MainLayout>
        <Suspense fallback={<AuthSpinner />}>
          <UserDetails />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: `/`,
    exact: false,
    name: 'Redirect',
    state: 'Redirect',
    component: () => <Redirect to={getDashboardPath} />,
  },
];

export const publicRoutes = [
  {
    path: `${getLoginPath}`,
    exact: true,
    name: 'Login',
    state: 'login',
    component: () => (
      <AuthLayout>
        <Suspense fallback={<AuthSpinner />}>
          <Login />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: `${getRegisterPath}`,
    exact: true,
    name: 'Register',
    state: 'register',
    component: () => (
      <AuthLayout>
        <Suspense fallback={<AuthSpinner />}>
          <Register />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: `${getForgotPasswordPath}`,
    exact: true,
    name: 'Forgot Password',
    state: 'forgotPassword',
    component: () => (
      <AuthLayout>
        <Suspense fallback={<AuthSpinner />}>
          <ForgotPassword />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: `/`,
    exact: false,
    name: 'Redirect',
    state: 'Redirect',
    component: () => <Redirect to={getLoginPath} />,
  },
];
