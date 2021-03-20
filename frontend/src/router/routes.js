import * as api from 'src/api';

const getRoutes = async () => {
  const auth = await api.getAuth();

  if (!auth) {
    return []
  }

  return auth.isAdmin ? [
    {
      path: '/admin',
      component: () => import('layouts/MainLayout.vue'),
      meta: { auth },
      children: [
        { path: '', component: () => import('pages/Index.vue') }
      ]
    },
    {
      path: '/:catchAll(.*)*',
      redirect: '/admin',
    }
  ] : [
    {
      path: '/display',
      component: () => import('layouts/MainLayout.vue'),
      meta: { auth },
      children: [
        { path: '', component: () => import('pages/Index.vue') }
      ]
    },
    {
      path: '/:catchAll(.*)*',
      redirect: '/display',
    }
  ]
}

export default getRoutes
