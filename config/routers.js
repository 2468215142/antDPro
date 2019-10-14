export const router = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/CustomLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          // 首页
          {
            path: '/welcome',
            name: '欢迎',
            icon: 'smile',
            component: './Welcome',
          },
          // 用户管理
          {
            path: '/users',
            name: '用户管理',
            icon: 'team',
            routes: [
              {
                path: '/users/userManage',
                name: '用户管理',
                icon: 'smile',
                component: './userManage/manage',
              },
            ],
          },
          // 音乐
          {
            path: '/music',
            name: '音乐',
            icon: 'customer-service',
            routes: [
              {
                path: '/music/visualization',
                name: '音频可视化',
                icon: 'audio',
                component: './music/visualization',
              },
            ],
          },

          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
