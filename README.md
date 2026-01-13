# 🐱 喵嗚評語助手 (Meow Comment Helper) V5.0

> **雲端同步旗艦版 (Cloud Sync Edition)**
> 專為國小導師設計的 AI 輔助評語撰寫系統，支援「Google 試算表」作為個人雲端資料庫，資料隨身帶著走！

![Version](https://img.shields.io/badge/version-5.0-blue)
![Tech](https://img.shields.io/badge/Vue.js-3.0-green)
![Backend](https://img.shields.io/badge/Google_Apps_Script-BYOB-orange)
![AI](https://img.shields.io/badge/Gemini-2.0-blue)

## 📖 專案概述 (Overview)
本系統為基於 Web 的單頁應用程式 (SPA)，旨在協助導師利用生成式 AI (Gemini)，將口語觀察紀錄轉化為教育專業評語及八字箴言。**V5.0 版本導入 BYOB (Bring Your Own Backend) 架構**，使用者可利用個人的 Google 試算表作為資料庫，實現跨裝置資料同步，同時保有 100% 的資料隱私權。

## ✨ 核心功能 (Features)
* **☁️ 雲端同步 (New)**：一鍵將班級資料備份至您的 Google 雲端硬碟，回家也能繼續工作。
* **🏡 跨裝置接力 (New)**：在學校電腦上傳，回家用筆電下載繼續寫，無縫接軌。
* **🔒 資料自主 (New)**：後端程式碼透明，資料儲存在您自己的 Google 帳號中，隱私絕不外洩。
* **🐱 療癒貓咪 UI**：全介面貓化設計，讓期末行政工作不再枯燥，基本上是為了我家太座大人而設計。
* **🚀 多班級管理**：支援建立多個學年度班級，資料獨立儲存。
* **🤖 雙重生成引擎**：一次生成「70-80字評語」與「學籍卡八字箴言」。

---

## ☁️ 雲端後端設定教學 (初次使用必讀)

若您希望啟用「跨裝置同步」功能，請先花 3 分鐘建立您專屬的雲端資料庫。
*(若僅需單機使用，可跳過此步驟)*

### 步驟 1：建立雲端資料庫
1. 開啟並登入 Google 帳號。
2. 建立一個新的 [Google 試算表](https://sheets.new)，命名為 `喵嗚評語資料庫`。
3. 點選上方選單 **「擴充功能」** -> **「Apps Script」**。

### 步驟 2：部署後端程式
1. 清空編輯器中的程式碼。
2. 複製以下程式碼並貼上：
   ```javascript
   function doPost(e) {
     var lock = LockService.getScriptLock(); lock.tryLock(10000);
     try {
       SpreadsheetApp.getActive().getRange("A1").setValue(e.postData.contents);
       SpreadsheetApp.getActive().getRange("A2").setValue("最後更新: " + new Date());
       return ContentService.createTextOutput(JSON.stringify({'result':'success'})).setMimeType(ContentService.MimeType.JSON);
     } catch(e) { return ContentService.createTextOutput(JSON.stringify({'result':'error'})).setMimeType(ContentService.MimeType.JSON); }
     finally { lock.releaseLock(); }
   }
   function doGet(e) {
     var data = SpreadsheetApp.getActive().getRange("A1").getValue();
     return ContentService.createTextOutput(data || JSON.stringify({})).setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. 點擊右上角 **「部署」** -> **「新增部署作業」**。
4. 點擊齒輪圖示 -> 選擇 **「網頁應用程式」**。
   * 說明：`貓貓後台`
   * 執行身分：**我 (Me)**
   * 誰可以存取：**所有人 (Anyone)** *(⚠️ 必要設定，讓評語助手能連線)*
5. 點擊 **「部署」** -> **「複製網頁應用程式網址」**。

### 步驟 3：連線同步
1. 回到評語助手網頁，點擊上方 **「☁️ 雲端同步」**。
2. 貼上剛剛複製的網址。
3. 點擊 **「上傳備份」** 測試，若出現綠色成功訊息即完成！

---

## 🚀 使用說明 (Usage Guide)

本系統提供 **「線上版」** 與 **「單機版」** 兩種使用方式，請依您的需求選擇。

### 🌐 方法一：使用線上發佈版本 (GitHub Pages)
最推薦的方式！無需下載任何檔案，只要有網址即可使用。

1. **開啟網頁**：前往部署好的 GitHub Pages 網址（例如：`https://您的帳號.github.io/meow-comment-helper/`）。
2. **輸入金鑰**：
   * 首次進入時，畫面右上方會顯示紅色的 **「🚫 罐罐鑰匙 (未輸入)」**。
   * 請在該輸入框中貼上您的 **Google Gemini API Key**。
3. **設定雲端 (選用)**：
   * 點擊上方 **「☁️ 雲端同步」** 按鈕。
   * 貼上您在上方步驟取得的 **Google Script 網址 (GAS URL)**。
   * 點擊 **「上傳備份」** 測試連線。
4. **自動記憶**：
   * 系統會自動將 Key 與 URL 儲存在您的瀏覽器暫存區 (LocalStorage)。

### 💻 方法二：下載單機版 (Local Version)
適合希望在無網路環境整理資料（生成評語仍需網路），或希望進階管理設定的使用者。

#### 模式 A：快速使用 (無 Config 檔)
1. 點擊綠色的 `Code` 按鈕 -> `Download ZIP` 下載本專案。
2. 解壓縮後，直接雙擊 `index.html` 開啟。
3. 操作方式同線上版，直接在介面輸入 Key 與 URL 即可。

#### 模式 B：自動載入 (建立 Config 檔)
如果您希望將設定寫死在檔案中，避免誤刪快取後需要重填：
1. 在專案根目錄建立一個新檔案 `config.js`。
2. 填入以下內容並儲存：
   ```javascript
   window.APP_CONFIG = {
       GEMINI_API_KEY: "在此貼上您的_AIza_開頭金鑰",
       GAS_URL: "在此貼上您的_Google_Script_網址"
   };
   ```
3. 重新整理網頁，右上角即會顯示綠色的 「罐罐鑰匙 (OK)」，且輸入框會被鎖定。

---

## 📐 系統分析與設計 (System Analysis & Design)

### 1. 系統架構 (Architecture)
V5.0 採用 **Client-Serverless + BYOB (Bring Your Own Backend)** 架構。前端負責邏輯與生成，後端資料庫由使用者自行託管於 Google Sheets。

* **前端框架**：Vue.js 3 (Composition API)
* **樣式框架**：Tailwind CSS
* **資料處理**：SheetJS (xlsx)
* **資料儲存**：Browser LocalStorage + Google Sheets (Cloud)
* **通訊協定**：HTTPS (JSON Payload)

### 2. 資料結構 (Data Schema)
系統資料儲存於 LocalStorage 的 `gemini_comments_v4_db` 鍵值中，雲端同步時則將此物件完整轉為 JSON 字串存入試算表 A1 儲存格。

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
| FR-03 | 雲端同步 | 支援將資料上傳/下載至使用者指定的 Google Sheet (V5.0 新增) |
| FR-04 | 內容生成 | 依據「三明治法」生成評語與箴言 (JSON Mode) |
| FR-05 | 報表輸出 | 匯出包含座號、姓名、箴言、評語的 Excel |

---

## 📝 版本歷程 (Changelog)
* **V5.0 (2026-01-08)**：新增 Google Sheets 雲端同步功能 (BYOB 架構)。
* **V4.0**：新增多班級管理、Excel 逆向匯入、貓咪主題 UI。
* **V3.0**：加入姓名綁定、八字箴言生成。
* **V2.0**：遷移至 Gemini 模型，加入領域標籤。
* **V1.0**：基礎評語生成功能。

## 📄 版權說明 (License)
MIT License. 歡迎教育工作者自由使用與修改。