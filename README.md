# 不浪費一個人行動｜Demo 站（GitHub Pages 密碼版）

網站內容已用密碼加密。`index.html` 裡只有密碼頁與密文，沒有網站原文，
放在公開的 repository 也讀不到內容；輸入正確密碼後，才會在瀏覽器中解密顯示。

## 檔案結構

| 檔案 | 用途 | 要推上 GitHub 嗎 |
| --- | --- | --- |
| `index.html` | 密碼頁＋加密後的網站 | 要 |
| `robots.txt` | 禁止搜尋引擎爬取 | 要 |
| `.nojekyll` | 讓 GitHub Pages 直接提供檔案，不經過 Jekyll | 要 |
| `tools/encrypt.mjs`、`tools/gate.html` | 加密工具與密碼頁範本 | 要（不含任何機密） |
| `_private/ntw-demo.html` | **網站原文，未加密** | **不要**（已列在 .gitignore） |

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
- 預約表單是 Demo，不會實際送出資料。
- 頁面上的「全台唯五 GRI 供應商」、9% 等內容尚待佐證，正式上線前需確認。
