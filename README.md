GoBinging
===
GoBinging 是一個讓使用者搜尋並收藏喜愛的餐廳之網站，網站上可看到詳細的餐廳介紹，藉評分系統能得知消費者對餐廳的滿意程度，讓苦惱該在哪聚餐的你不必再眉頭深鎖。<br> 

Features
============
1. 使用者可利用搜尋欄搜尋餐廳的名稱與分類
2. 點擊餐廳時會出現餐廳詳細資料<br> 
-----12/16/2020更新-----
3. 使用者可新增餐廳
4. 使用者可修改餐廳資料
5. 使用者可刪除餐廳資料
-----12/19/2020更新-----
6. 可改變首頁排序


prerequisites
================

## global packages

1. Node.js: v10.15.0 
2. nodemon: v2.0.6
3. npm: v6.4.1

## local packages

可於專案的 `package.json` 中查閱 `dependencies` 部分。<br> 

## database related

1. mongoDB: v4.2.11
2. Robo 3T: v1.4.2

installation and execution
=======

指令部分可參閱 `package.json` 中查閱 `scripts` 部分。<br> 

1. clone 這個專案，在終端機輸入:
```
git clone https://github.com/Jackson162/restaurant_list.git
```
2.  進入專案根目錄，安裝本地套件 (local packages)，在終端機輸入: 
```
npm install
```
3. 確認 mongoDB 執行後，連結 Robo 3T，建立一個資料庫，命名:
```
restaurant-list
```
4. 在終端機輸入指令來連結資料庫並新增種子資料:
```
npm run seed
```
5. 啟動伺服器，執行專案:
```
npm run dev
```
6. 打開瀏覽器，搜尋:
```
http://localhost/3000
```
