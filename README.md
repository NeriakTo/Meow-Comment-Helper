# 🐱 喵嗚評語助手 (Meow Comment Helper) V4.0

> **時光屋版 (Time Capsule Edition)** > 專為國小導師設計的 AI 輔助評語撰寫系統，結合溫暖的貓咪介面與強大的資料管理功能。

![Version](https://img.shields.io/badge/version-4.0-orange)
![Tech](https://img.shields.io/badge/Vue.js-3.0-green)
![AI](https://img.shields.io/badge/Gemini-2.0-blue)

## 📖 專案概述 (Overview)
本系統為基於 Web 的單頁應用程式 (SPA)，旨在協助老師利用生成式 AI (Gemini)，將口語觀察紀錄轉化為教育專業評語及八字箴言。V4.0 版本新增「多班級管理」與「Excel 逆向匯入」功能，讓歷史資料得以保存與遷移。

## ✨ 核心功能 (Features)
* **🐱 療癒貓咪 UI**：全介面貓化設計，讓期末行政工作不再枯燥，基本上是為了我家太座大人而設計。
* **🚀 多班級管理**：支援建立多個學年度班級，資料獨立儲存。
* **📂 時光機匯入**：可讀取舊版 Excel 報表，自動還原為可編輯的班級資料。
* **🤖 雙重生成引擎**：一次生成「70-80字評語」與「學籍卡八字箴言」。
* **🛡️ 資料隱私優先**：所有運算皆在瀏覽器端 (Client-side) 進行，個資不離線。

---

## 🛠️ 安裝與使用 (Installation)

本專案無需安裝 Node.js 或後端伺服器，僅需瀏覽器即可執行。

### 方法一：直接使用 (GitHub Pages)
前往線上部署網址：[請在此填入您的 GitHub Pages 網址]

### 方法二：本地執行
1. 下載本專案程式碼。
2. 建立 `config.js` 檔案（參考下方的設定說明）。
3. 直接雙擊 `index.html` 開啟。

### ⚙️ 設定檔說明 (Configuration)
為了資安考量，API Key 不應上傳至 GitHub。請在根目錄建立 `config.js`：

```javascript
// config.js
window.APP_CONFIG = {
    GEMINI_API_KEY: "您的_Google_Gemini_API_Key_請在此輸入"
};