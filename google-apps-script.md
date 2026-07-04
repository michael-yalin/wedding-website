# Google Apps Script 部署教學（RSVP 表單 → Google Sheets）

`script.js` 使用 jQuery 的 `$.ajax({ type: "get", ... })`，把 RSVP 表單資料以網址參數的方式送到你的 Google Apps Script Web App，Apps Script 收到後寫入 Google Sheet 最後一列。

## 步驟一：建立 Google Sheet

1. 開一個新的 Google Sheet，命名為例如「Yalin & Michael 婚禮 RSVP」。
2. 在第一列（Row 1）建立以下欄位標題（順序需與程式碼一致）：

   ```
   提交時間 | 姓名 | Email | 手機 | 出席與否 | 參加人數 | 兒童餐椅 | 素食人數 | 紙本喜帖 | 寄送地址 | 是否開車 | 留言
   ```

## 步驟二：貼上 Apps Script 程式碼

1. 在該 Google Sheet 中，點選上方選單 **擴充功能 (Extensions) → Apps Script**。
2. 刪除預設的 `Code.gs` 內容，貼上以下程式碼：

```javascript
// ====== 請先修改這裡 ======
var GROOM_EMAIL = 'michael@example.com';   // 新郎信箱
var BRIDE_EMAIL = 'yalin@example.com';     // 新娘信箱
var COUPLE_NAMES = 'Michael & Yalin';
var WEDDING_DATE_TEXT = '2026.10.11（日）台北漢來大飯店';
// ==========================

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    var p = e.parameter;

    sheet.appendRow([
      p.SUBMITTIME || new Date(),
      p.NAME || '',
      p.EMAIL || '',
      p.PHONE || '',
      p.ATTEND || '',
      p.ATTENDCOUNT || '',
      p.CHILDCHAIR || '',
      p.VEGCOUNT || '',
      p.INVITATION || '',
      p.ADDRESS || '',
      p.DRIVING || '',
      p.MESSAGE || ''
    ]);

    sendNotificationEmails(p);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmails(p) {
  var attendLine = p.ATTEND === '出席'
    ? '出席人數：' + (p.ATTENDCOUNT || '-') + ' 人'
    : '無法出席';

  var detailLines = [
    '姓名：' + (p.NAME || ''),
    'Email：' + (p.EMAIL || ''),
    '手機：' + (p.PHONE || ''),
    '出席狀況：' + (p.ATTEND || ''),
    attendLine,
    '兒童餐椅：' + (p.CHILDCHAIR || ''),
    '素食人數：' + (p.VEGCOUNT || '0'),
    '紙本喜帖：' + (p.INVITATION || ''),
    '寄送地址：' + (p.ADDRESS || '（無）'),
    '是否開車：' + (p.DRIVING || ''),
    '留言：' + (p.MESSAGE || '（無）')
  ].join('\n');

  // 1) 寄給新郎新娘：通知有新的 RSVP 回覆
  var coupleRecipients = [GROOM_EMAIL, BRIDE_EMAIL].filter(String).join(',');
  if (coupleRecipients) {
    MailApp.sendEmail({
      to: coupleRecipients,
      subject: '[婚禮 RSVP] ' + (p.NAME || '賓客') + ' 已回覆表單',
      body: '有新的 RSVP 回覆：\n\n' + detailLines
    });
  }

  // 2) 寄給填表的賓客：感謝與確認信
  if (p.EMAIL) {
    var guestBody =
      (p.NAME || '') + ' 您好，\n\n' +
      '感謝您填寫 ' + COUPLE_NAMES + ' 的婚禮 RSVP 表單，我們已經收到您的回覆：\n\n' +
      detailLines + '\n\n' +
      '婚禮時間地點：' + WEDDING_DATE_TEXT + '\n' +
      '期待與您相聚！\n\n' +
      COUPLE_NAMES;

    MailApp.sendEmail({
      to: p.EMAIL,
      subject: '[' + COUPLE_NAMES + '] 已收到您的 RSVP 回覆',
      body: guestBody
    });
  }
}
```

3. 把最上面 `GROOM_EMAIL` / `BRIDE_EMAIL` 換成新郎新娘實際的信箱，`WEDDING_DATE_TEXT` 也可依需求調整。
4. 點擊左上角專案名稱，改成例如「Wedding RSVP API」，然後儲存（Ctrl/Cmd + S）。

## 步驟三：部署為 Web App

1. 點選右上角 **部署 (Deploy) → 新增部署 (New deployment)**。
2. 點選左側齒輪圖示，選擇類型為 **網頁應用程式 (Web app)**。
3. 設定：
   - **說明**：Wedding RSVP v1（隨意填寫）
   - **執行身分 (Execute as)**：我 (你的 Google 帳號)
   - **誰可以存取 (Who has access)**：**任何人 (Anyone)**（務必選這個，否則前端無法呼叫）
4. 點選 **部署 (Deploy)**。
5. 第一次部署時 Google 會要求「授權存取權限」，依畫面指示選擇你的帳號 → 點選「進階」→「前往 (專案名稱)（不安全）」→ 允許。
   （這是正常現象，因為這是你自己撰寫、尚未經 Google 審核的腳本。）
6. 部署完成後，會顯示一組 **網頁應用程式網址 (Web app URL)**，格式類似：

   ```
   https://script.google.com/macros/s/AKfycb.................../exec
   ```

   **複製這組網址。**

## 步驟四：把網址填入 `script.js`

打開專案裡的 `script.js`，找到最上方這一行：

```javascript
const GOOGLE_SHEET_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

換成你剛剛複製的網址，例如：

```javascript
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

儲存後重新整理網頁，填寫 RSVP 表單並送出，就會看到資料出現在 Google Sheet 最後一列。

## 之後修改程式碼怎麼辦？

如果你之後又修改了 Apps Script 內容，**必須重新部署**：
1. 部署 (Deploy) → 管理部署 (Manage deployments)。
2. 點選現有部署旁的鉛筆圖示（編輯）。
3. 版本 (Version) 選擇「新版本 (New version)」→ 部署 (Deploy)。

（用「編輯」重新部署，網址通常不變；如果是「新增部署」，網址會變，記得回來更新 `script.js`。）

## 關於自動寄信通知

`sendNotificationEmails()` 會在每次表單成功送出、資料寫入 Sheet 之後自動寄出兩封信：

1. **給新郎新娘**：寄到 `GROOM_EMAIL` 和 `BRIDE_EMAIL`，通知「某某人已經回覆 RSVP」，內容包含賓客填寫的所有欄位。
2. **給填表的賓客**：用賓客填的 Email 寄一封確認信，告知已收到回覆、再次附上婚禮時間地點。

這是用 Apps Script 內建的 `MailApp.sendEmail()`，寄件人會顯示成你部署時登入的那個 Google 帳號（步驟三「執行身分」選的那個帳號），不需要額外設定 SMTP 或 API 金鑰。

**寄信額度**：`MailApp` 用的是你 Google 帳號本身的每日寄信配額——一般 Gmail 帳號約 100 封/天，Google Workspace 帳號約 1500 封/天。婚禮賓客量通常遠低於這個額度，不用擔心；但如果你短時間內反覆測試表單，也會計入額度。

**如果不想寄某一封**：例如不想寄確認信給賓客，只想自己收到通知，把 `sendNotificationEmails` 裡「2) 寄給填表的賓客」那一段整段刪掉即可；反之若只想寄給賓客不想通知自己，刪掉「1) 寄給新郎新娘」那段。

## 疑難排解

- **表單送出但 Sheet 沒資料**：確認「誰可以存取」設定為「任何人」，且網址結尾是 `/exec` 而非 `/dev`。
- **想確認 Web App 是否正常運作**：直接把網址貼到瀏覽器網址列開啟，應該會看到 `{"result":"error", ...}`（因為沒有帶參數），這代表服務本身是活著的；正式提交表單時會帶參數並寫入資料。
- **信件跑到垃圾信匣**：第一次收到來自這個 Google 帳號的信，Gmail/其他信箱有時會判定為垃圾信，請提醒新郎新娘與賓客第一次留意檢查垃圾信匣。
- **改了程式碼後信件行為沒變**：跟資料寫入一樣，修改 `Code.gs` 後要照「之後修改程式碼怎麼辦」重新部署新版本才會生效。
