import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

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
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
