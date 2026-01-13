/*
 * 🐱 喵嗚評語助手 - 雲端後端核心 (Google Apps Script)
 * 請將此程式碼完整複製到您的 Google Sheet -> 擴充功能 -> Apps Script 中
 */

function doPost(e) {
    // 鎖定機制，避免同時上傳導致資料損毀
    var lock = LockService.getScriptLock();
    lock.tryLock(10000); // 等待 10 秒
  
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // 1. 取得前端傳來的資料
      var rawData = e.postData.contents;
      // 驗證是否為有效 JSON，若無效會跳到 catch
      var jsonData = JSON.parse(rawData);
      
      // 2. 儲存資料到 A1 儲存格 (核心資料庫)
      // 我們將整個班級資料打包成一個 JSON 字串存入
      sheet.getRange("A1").setValue(JSON.stringify(jsonData));
      
      // 3. 在 A2 紀錄最後更新時間 (方便查看)
      sheet.getRange("A2").setValue("最後更新： " + new Date().toLocaleString());
  
      // 4. 回傳成功訊息 (JSON 格式)
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'success', 'timestamp': new Date() }))
        .setMimeType(ContentService.MimeType.JSON);
  
    } catch (e) {
      // 錯誤處理
      return ContentService
        .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    } finally {
      lock.releaseLock();
    }
  }
  
  function doGet(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 讀取 A1 的資料
    var data = sheet.getRange("A1").getValue();
    
    // 如果 A1 是空的 (第一次使用)，回傳一個空的初始結構
    if (!data) {
      data = JSON.stringify({ activeClassId: 'default', classes: {} });
    }
  
    // 回傳資料給前端
    return ContentService
      .createTextOutput(data)
      .setMimeType(ContentService.MimeType.JSON);
  }