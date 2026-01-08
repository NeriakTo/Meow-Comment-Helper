# 🐱 喵嗚評語助手 (Meow Comment Helper) V4.0

> **時光屋旗艦版 (Time Capsule Edition)**
> 專為國小導師設計的 AI 輔助評語撰寫系統，結合溫暖的貓咪介面與強大的資料管理功能。

![Version](https://img.shields.io/badge/version-4.0-orange)
![Tech](https://img.shields.io/badge/Vue.js-3.0-green)
![AI](https://img.shields.io/badge/Gemini-2.0-blue)

## 📖 專案概述 (Overview)
本系統為基於 Web 的單頁應用程式 (SPA)，旨在協助導師利用生成式 AI (Gemini)，將口語觀察紀錄轉化為教育專業評語及八字箴言。V4.0 版本新增「多班級管理」與「Excel 逆向匯入」功能，讓歷史資料得以保存與遷移。

## ✨ 核心功能 (Features)
* **🐱 療癒貓咪 UI**：全介面貓化設計，讓期末行政工作不再枯燥，基本上是為了我家太座大人而設計。
* **🚀 多班級管理**：支援建立多個學年度班級，資料獨立儲存。
* **📂 時光機匯入**：可讀取舊版 Excel 報表，自動還原為可編輯的班級資料。
* **🤖 雙重生成引擎**：一次生成「70-80字評語」與「學籍卡八字箴言」。
* **🛡️ 資料隱私優先**：所有運算皆在瀏覽器端 (Client-side) 進行，個資不離線。

---

## 🚀 使用說明 (Usage Guide)

本系統提供 **「線上版」** 與 **「單機版」** 兩種使用方式，請依您的需求選擇。

### 🌐 方法一：使用線上發佈版本 (GitHub Pages)
最推薦的方式！無需下載任何檔案，只要有網址即可使用。

1. **開啟網頁**：前往部署好的 GitHub Pages 網址（例如：`https://neriakto.github.io/Meow-Comment-Helper/`）。
2. **輸入金鑰**：
   * 首次進入時，畫面右上方會顯示紅色的 **「🚫 罐罐鑰匙 (未輸入)」**。
   * 請在該輸入框中貼上您的 **Google Gemini API Key**。
3. **自動記憶**：
   * 系統會自動將 Key 儲存在您的瀏覽器暫存區 (LocalStorage)。
   * **下次開啟網頁時，系統會自動帶入 Key，無需再次輸入。**
   * *注意：若更換電腦或清除瀏覽器快取，則需重新輸入。*

### 💻 方法二：下載單機版 (Local Version)
適合希望在無網路環境整理資料（生成評語仍需網路），或希望進階管理設定的使用者。

#### 模式 A：快速使用 (無 Config 檔)
1. 點擊綠色的 `Code` 按鈕 -> `Download ZIP` 下載本專案。
2. 解壓縮後，直接雙擊 `index.html` 開啟。
3. 操作方式同線上版，**直接在網頁右上角輸入框貼上 API Key** 即可開始使用。

#### 模式 B：自動載入 (建立 Config 檔)
如果您希望將 Key 寫死在檔案中，避免誤刪快取後需要重填：
1. 在專案根目錄建立一個新檔案 `config.js`。
2. 填入以下內容並儲存：
   ```javascript
   window.APP_CONFIG = {
       GEMINI_API_KEY: "在此貼上您的_AIza_開頭金鑰"
   };
3. 重新整理網頁，右上角即會顯示綠色的 「罐罐鑰匙 (OK)」，且輸入框會被鎖定。

## 📐 系統分析與設計 (System Analysis & Design)

### 1. 系統架構 (Architecture)
採用 **Client-Serverless** 架構。前端負責邏輯與狀態管理，直接與 Google Gemini API 溝通。

* **前端框架**：Vue.js 3 (Composition API)
* **樣式框架**：Tailwind CSS
* **資料處理**：SheetJS (xlsx)
* **資料儲存**：Browser LocalStorage

### 2. 資料結構 (Data Schema)
系統資料儲存於 LocalStorage 的 `gemini_comments_v4_db` 鍵值中。

```json
{
  "activeClassId": "class_2026_302",
  "classes": {
    "class_id_xxxxxxxx": {
      "name": "114學年 302班",
      "students": [
        {
          "id": "01",
          "name": "王小明",
          "raw_comment": "原始紀錄...",
          "polished_comment": "生成評語...",
          "motto": "八字箴言..."
        }
      ]
    }
  }
}
```

### 3. 功能需求 (Functional Requirements)
| ID | 模組 | 功能描述 |
| :--- | :--- | :--- |
| FR-01 | 系統核心 | 支援介面輸入或 Config 檔載入 API Key，具備狀態記憶功能 |
| FR-02 | 班級管理 | 支援新增、切換、刪除班級 |
| FR-03 | 資料匯入 | 支援解析舊版 Excel 還原班級資料 |
| FR-04 | 內容生成 | 依據「三明治法」生成評語與箴言 (JSON Mode) |
| FR-05 | 報表輸出 | 匯出包含座號、姓名、箴言、評語的 Excel |

---

## 📝 版本歷程 (Changelog)
* **V4.0 (2026-01-08)**：新增多班級管理、Excel 逆向匯入、貓咪主題 UI。
* **V3.0**：加入姓名綁定、八字箴言生成。
* **V2.0**：遷移至 Gemini 模型，加入領域標籤。
* **V1.0**：基礎評語生成功能。

## 📄 版權說明 (License)

MIT License. 歡迎教育工作者自由使用與修改。
