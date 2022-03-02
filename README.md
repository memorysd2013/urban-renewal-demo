# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

目標：

用 Vue 做一個新北市都市更新地點的查詢網頁（如 demo），用戶查詢前必須先登入 Google 並且綁定 Facebook

使用的 API：
1. 都更地點 API （附件一）
2. 都更地點 Polygon API（附件二）

條件：
1. Google Login 與 Facebook Login 要用原生方法, 不要 firebase
2. 地圖呈現用 leaflet.js
3. 顯示 User Location Pin 的 tooltip 要顯示 facebook 與 google 大頭貼
4. 都更地點 API 回傳資料用 list 方式呈現到頁面也同步呈現到地圖上
5. 都更地點 Polygon API 回傳資料呈現到地圖上