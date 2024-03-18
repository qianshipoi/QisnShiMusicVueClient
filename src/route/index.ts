import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/main.vue'),
    meta: {
      keepActive: true
    },
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/main/index.vue'),
        meta: {
          keepActive: true
        }
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/main/Settings.vue'),
        meta: {
          keepActive: true
        }
      },
      {
        path: '/play',
        name: 'Play',
        component: () => import('../views/main/Play.vue'),
        meta: {
          keepActive: true
        }
      },
      {
        path: '/favorite',
        name: 'Favorite',
        component: () => import('../views/main/Favorite.vue'),
        meta: {
          keepActive: true
        }
      },
      {
        path: '/playlists/:id',
        name: 'Playlist',
        component: () => import('../views/main/Playlist.vue')
      },
      {
        path: '/found',
        name: 'Found',
        component: () => import('../views/main/Found.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: () => import('../views/Dialog.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
router.beforeEach((to, from, next) => {
  const winId = from.query['winId']
  if (winId && to.query['winId'] !== winId) {
    next({
      path: to.path,
      query: {
        ...to.query,
        winId,
      },
    });
  } else {
    next();
  }
})

router.afterEach((to) => {
  console.log(to);
})

export default router;
