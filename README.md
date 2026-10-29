# 不浪費一個人行動｜Demo 站（GitHub Pages 密碼版）

網站內容已用密碼加密。`index.html` 裡只有密碼頁與密文，沒有網站原文，
輸入正確密碼後，才會在瀏覽器中解密顯示。
注意：目前 repository 也有追蹤 `_private/` 原始 HTML；加密僅保護預覽入口，不能保護 repository 中的原始內容。

## 檔案結構

| 檔案 | 用途 | 要推上 GitHub 嗎 |
| --- | --- | --- |
| `index.html` | 密碼頁＋加密後的網站 | 要 |
| `robots.txt` | 禁止搜尋引擎爬取 | 要 |
| `.nojekyll` | 讓 GitHub Pages 直接提供檔案，不經過 Jekyll | 要 |
| `tools/encrypt.mjs`、`tools/gate.html` | 加密工具與密碼頁範本 | 要（不含任何機密） |
| `_private/ntw-demo.html` | **網站原文，未加密** | 目前已追蹤，供協作與正式站整合 |

## 部署步驟

1. 在 GitHub 建立 repository，名稱建議不要太好猜（例如不要直接叫 ntw-demo）。
2. 把上表中「要」推上去的檔案推到 `main` 分支。
3. 到 repository 的 **Settings → Pages**：
   - Source：**Deploy from a branch**
   - Branch：**main**，資料夾：**/ (root)**
4. 等待約 1 分鐘，網址會是 `https://<你的帳號>.github.io/<repository 名稱>/`。

## 更新網站或更換密碼

把新的網站 HTML 放到 `_private/ntw-demo.html`，然後執行（需要 Node.js 18 以上）：

```bash
node tools/encrypt.mjs _private/ntw-demo.html 新的密碼
```

執行後 `index.html` 會被重新產生，把它推上 GitHub 即可。
每次加密都會產生不同的密文，舊密碼會立即失效。

## 避免被搜尋引擎收錄

- 密碼頁與解密後的網站都加上了 `noindex, nofollow`，這是主要的防護。
- `robots.txt` 只有放在網域根目錄才會被讀取。
  如果網址是 `帳號.github.io/repository名稱/`，這個檔案不會生效，但不影響上面的 noindex 設定。
- 不要在其他公開網頁貼出這個網址。

## 注意

- 密碼請用 **10 個字元以上** 的英數組合；密碼越短，越容易被猜中。
- 同一個瀏覽器分頁重新整理時會自動解鎖；關閉分頁後需要重新輸入。
- 根目錄加密預覽 `index.html` 仍是原有 Demo；繁中原始頁 `_private/ntw-demo.html` 已同步正式留單 API，兩者目前不同步。
- 頁面上的「全台唯五 GRI 供應商」、9% 等內容尚待佐證，正式上線前需確認。

## LUMO 留單串接（2026-10-29）

繁中原始頁 `_private/ntw-demo.html` 同步自 LUMO 正式版本 `796c13e3707f280cd9555e571c5c4738ca5a4f50`。版面、圖片與文案沿用媒體版本，加入既有正式站的浮動諮詢入口與共用表單流程。

- 頁尾與浮動表單使用同源 `POST /api/public/contact-requests`，成功後才顯示已收到；驗證失敗、網路／HTTP 錯誤不顯示成功，429 顯示稍後再試。
- 必須勾選隱私同意；正式部署需提供 `/landings/legal/privacy.html`。姓名、Email、公司、職稱、選填電話及諮詢主題送至 LUMO 留單 API，來源固定為 `website`／`landing:no-one-wasted`，後台「訪客留單」可查。
- 成功後，在 `https://www.lumo-career.com` 且正式站 GTM Loader 已載入時，推送 `generate_lead`，只帶 `campaign: no-one-wasted` 與 `form_id`；不把聯絡資料放入 dataLayer。這不等於已串 Meta CAPI 或 Meta 已收到轉換。
- GTM Loader 與 CSP 由 LUMO 部署設定提供，本 repo 不存 CAPI Token 或其他憑證。API 與隱私頁不由 GitHub Pages 提供；不能直接將相對路徑改為正式站網址就當成跨域串接完成。
- GitHub Pages 加密入口、簡中原始頁與簡中預覽維持原狀。本次只同步繁中正式來源；如要更新加密預覽，請持有原密碼的同仁先確定預覽環境的 API 路由，再依上方工具重新產生，避免把無後端的靜態預覽當成可收單網站。

後續調整視覺時，請保留表單的 `name`、隱私同意、API 成功／失敗判斷與成功事件；將修改回合併至 LUMO 後，仍需走正式站建置與發布，GitHub PR 合併不會自動更新 LUMO。
