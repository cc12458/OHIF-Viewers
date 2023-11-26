# Image Viewer

> 基于 [OHIF](https://docs.ohif.org/) 3.7.0 改造

## 开发说明

1. 环境
    - [Yarn 1.17.3+](https://yarnpkg.com/en/docs/install)
    - [Node 16+](https://nodejs.org/en/)
    - Yarn Workspaces should be enabled on your machine:
        - `yarn config set workspaces-experimental true`

2. 开发
    - 切换到 `3.7.0-dev` 分支
    - 安装依赖 `yarn install`
    - 运行 `yarn run start`

## 部署说明

1. 修改 `.env` 环境变量 ([platform/app/.env](platform/app/.env))

   ```dotenv 
   PUBLIC_URL=/
   APP_CONFIG=config/image/default.js
   ```

2. 修改或新增 `config.js` 配置文件 ([config/image/default.js](platform/app/public/config/image/default.js))

   ```javascript
   window.config = {
     routerBasename: '/',
     useSharedArrayBuffer: 'AUTO',
     showStudyList: true,
     forbidReturn: true,
   }
   ```

   **注意：** `PUBLIC_URL` 和 `config.routerBasename`

   > [build-for-non-root-path](https://docs.ohif.org/deployment/build-for-production/#build-for-non-root-path)

   | 部分配置             | 枚举值/值类型                | 默认值   | 说明                                                         |
| ---------------------- | ---------------------------- | -------- | ------------------------------------------------------------ |
   | `forbidReturn`         | `boolean`                    | `false`  | 二级页 *header* 没有返回按钮                                 |
   | `hideHeaderSpace`      | `boolean`                    | `false`  | *header* 没有多余空间是否隐藏左右 logo 和 设置按钮           |
   | `panelMode`            | `'left'` `'bottom'` `'auto'` | `'auto'` | *studies* 面板的位置，<br />left：左侧收缩<br />bottom：固定底部<br />auto：根据宽高比计算（0.75） |
   | `clickToClosePanel`    | `boolena` `number`           | `false`  | 点击项目关闭面板<br />`boolean` ：是否<br />`number`:  临界值（innerWidth小于该值） |
   | `useSharedArrayBuffer` | `'TRUE'` `'FALSE'` `'AUTO'` | `'TRUE'` | 是否使用 `sharedArrayBuffer`<br />*TRUE* : 使用<br />*FALSE* : 不使用（影响性能）<br />*AUTO* : 不支持自动回退 |
   |更多配置：|||[OHIF Config files](https://docs.ohif.org/configuration/configurationFiles)|
   
   

3. 构建 `yarn run build` 或 `yarn run build:no-cache`
4. 修改 `dist/manifest.json` 文件

   例如：
   ```dotenv
   PUBLIC_URL=/CloudView/
   ```

   `/assets/` 替换成 `/PUBLIC_URL/assets/`

   ```json
   {
     "icons": [
       {
         "src": "/CloudView/assets/android-chrome-36x36.png"  
       }
    ]
   }
   ```

### 示例

#### `.env` 

> [platform/app/.env](platform/app/.env)

```dotenv
PUBLIC_URL=/CloudView/
APP_CONFIG=config/image/CloudView.js
USE_HASH_ROUTER=false
```

#### `config.js` 

> [platform/app/public/config/image/CloudView.js](platform/app/public/config/image/CloudView.js)

```js
window.config = {
  routerBasename: '/CloudView',
  showStudyList: true,
  forbidReturn: true,
  useSharedArrayBuffer: 'AUTO',
  // 其他配置...
};
```

> 其他配置参考 ：
>
> - [default.js](platform/app/public/config/image/default.js) 
> - [OHIF Config files](https://docs.ohif.org/configuration/configurationFiles)



构建后

#### `manifest.json`

> [platform/app/dist/manifest.json](platform/app/dist/manifest.json)

将 `/assets/` 替换成 `/CloudView/assets/`

```json
{
  "name": "Image Viewer",
  "description": "Image Viewer",
  "icons": [
    {
      "src": "/CloudView/assets/android-chrome-36x36.png",
      "sizes": "36x36",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/CloudView/assets/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
