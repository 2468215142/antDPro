// 开发代理
// /home
const targetHome = `http://192.168.31.87:9000`;
const targetCompany = `http://10.1.70.62:9000`;

export const proxyConfig = {
  '/home': {
    target: targetHome,
    changeOrigin: true,
    pathRewrite: {
      '^/home': '',
    },
  },
  '/company': {
    target: targetCompany,
    changeOrigin: true,
    pathRewrite: {
      '^/company': '',
    },
  },
};
