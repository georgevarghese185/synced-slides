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
      props: { drawer: true },
      meta: { auth },
      children: [
        { path: 'slides', component: () => import('pages/Slides.vue') },
        { path: 'slides/new', component: () => import('pages/Slide.vue') },
        { path: 'slides/:id', component: () => import('pages/Slide.vue') },
        { path: 'displays', component: () => import('pages/Displays.vue') },
        { path: 'displays/new', component: () => import('pages/Display.vue') },
        { path: 'displays/:id', component: () => import('pages/Display.vue') },
        { path: 'presentation', component: () => import('pages/PresentationControl.vue') }
      ]
    },
    {
      path: '/:catchAll(.*)*',
      redirect: '/admin/presentation',
    }
  ] : [
    {
      path: '/display',
      component: () => import('layouts/MainLayout.vue'),
      params: { drawer: false },
      children: [
        { path: 'presentation', component: () => import('pages/Presentation.vue') }
      ]
    },
    {
      path: '/:catchAll(.*)*',
      redirect: '/display/presentation',
    }
  ]
}

export default getRoutes
