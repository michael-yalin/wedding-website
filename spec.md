# 網頁開發需求說明書 (Web Development Specification)

## 1. 專案概述 (Project Overview)

本專案旨在開發一個客製化的**婚禮主題網頁**（包含婚禮資訊與出席意願調查表單）。網頁需要完全參考指定的線上範例進行風格仿製，並具備相簿功能，且使用者填寫的表單資料必須即時同步至指定 Google Sheets 表單。

## 2. 檔案與目錄結構 (Reference Folder Structure)

Agent 在開發與讀取資產時，請務必遵循以下專案資料夾結構：

```text
/yalin-wedding-project
│
├── index.html                 # 網頁主程式
├── style.css                  # 網頁樣式表
├── script.js                  # 前端邏輯與 Google Sheets 對接
│
└── /reference                 # 靜態資源資料夾（素材）
    ├── /網頁用圖               # 網頁要用的圖
    |    ├── background1.jpg
    |    ├── background2.jpg
    |    ├── background3.jpg
    |    ├── avatar_groom.jpg       # 新郎大頭照
    |    └── avatar_bride.jpg       # 新娘大頭照
    ├── /電子喜帖網站文字內容.pptx      # 電子喜帖網站文字內容
    └── /gallery                    # 相簿專用照片資料夾
        ├── photo1.jpg
        ├── photo2.jpg
        └── photo3.jpg

```

## 3. 視覺與風格需求 (Design & UI Style)

* **參考網站：** `https://littleroomweb.com/template/Flowers/`
* **風格複製：** 請深度參考上述網址的**配色方案、字體視覺、動畫特效、區塊排版與間距感**。
* **素材應用：**
* 主視覺背景請使用 `/reference/網頁用圖/background1.jpg`, `/reference/網頁用圖/background2.jpg`,`/reference/網頁用圖/background3.jpg`
* 新郎新娘介紹區塊請分別帶入 `/reference/avatar_groom.jpg` 與 `/reference/avatar_bride.jpg`。
* 網頁相關文字請參考 `/reference/電子喜帖網站文字內容.pptx`
* 網頁需包含一個「精彩相簿 (Gallery)」區塊，以網格 (Grid) 或輪播 (Carousel) 形式展示 `/reference/gallery/` 資料夾內的所有照片，風格需與參考網站一致（例如：點擊放大、淡入淡出效果）。



## 4. 功能需求 (Functional Requirements)

### A. 出席意願表單 (RSVP Form)

網頁需包含一個美觀的表單，供賓客填寫以下欄位（欄位細節可根據需求調整）：

1.姓名
2.Email
3.手機
4.參加人數(包含自己)
5.是否需要兒童餐椅
6.素食人數
7.是否需要紙本喜帖
8.喜帖寄送地址(郵遞區號+地址)
9.是否開車前往
10. LEAVE A MESSAGE

### B. Google Sheets 資料同步 (Backend Integration)

* **技術方案：** 請使用 **Google Apps Script (Web App)** 作為 API 媒介。
* **運作流程：** 1. 賓客點擊表單提交。
2. 前端 JavaScript 使用 `fetch()` 以 `POST` 或 `GET` 方式將 JSON 資料傳送至 Google Apps Script 部署的 Web App URL。
3. Google Apps Script 接收資料並自動寫入 Google Sheet 的最後一行。
4. 前端收到成功回應後，彈出風格相符的「提交成功」提示視窗（避免原生 alert，請使用自訂彈窗或 SweetAlert 風格）。

---

## 5. 給 Coding Agent (Claude) 的實作引導步驟

請 Agent 依據以下步驟分階段進行開發，並在每一步完成後確認效果：

1. **步驟一：建立基礎 HTML 結構**
* 依據參考網站排版，建立首頁大圖區、新人介紹、婚禮資訊（時間地點）、相簿區以及 RSVP 表單區。


2. **步驟二：CSS 視覺與響應式切版 (RWD)**
* 套用套件或自訂 CSS，確保網頁在**手機端與桌機端**皆有完美體驗，特別是相簿與表單的排版。


3. **步驟三：表單前端驗證與 JavaScript 互動**
* 加入必填欄位檢查，並撰寫 `submit` 事件的異步傳輸邏輯。


4. **步驟四：提供 Google Apps Script 程式碼與教學**
* 請提供一段標準的 Google Apps Script `doPost(e)` 或 `doGet(e)` 程式碼，並引導使用者如何在 Google Sheet 上進行部署、取得 Web App URL，最後將該 URL 填入 `script.js` 中。
