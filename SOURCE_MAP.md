# 受限來源對照

來源基準為 `fa3de7cb` 上的 TEST1 靜態審查快照 `0505e614`；不能以此基準代簽之後的新 runtime。

| 本包檔案 | 來源／變更 |
| --- | --- |
| `lib/read-bounded-public.mjs` | 從 `apps/client/src/observer/lookdev/assembly-projection.mjs` 分離 `FRAME_CAP`、本地 `check` 及 `readBoundedPublic`，保留函式文字及限制；不帶形狀/生成 imports。 |
| `tests/public-reader.test.mjs` | 從同目錄 `assembly-projection.test.mjs` 保留 `bounded streaming enforces bytes before parse and cancels excessive bodies including UTF-8` 原有斷言，只改相對 import。 |
| `observer-target.mjs` | 只讀交付 adapter；renderer 固定5219、observer固定8844；公開frame只作暫存可用性檢查，非世界驗證。 |
| `server.mjs`、`index.html`、`app.mjs`、`style.css` | 現版檢視入口；沒有替代場景及居民控制。 |
| `tests/observer-entry.test.mjs` | 封裝邊界測試，不使用真模型或原世界資料。 |

完整 `shared-test-observer.mjs` 的審查來源 SHA-256 為 `be3820023cef46dacd243896706f1bc4365f5afb130f6845183f1860a76966d7`，但未收入本包。它引用的 `construction.mjs`（SHA-256 `5d9425e99f22d8a0b8cd71419e81868c569b7e03c99121cb9c0ad8ba3d1ee16f`）會再引用生成相關來源；因此按保密限制排除，不以改寫副本冒稱原版完整驗證器。

這份對照只有相對程式路徑和來源雜湊，沒有私人機器路徑或執行資料。完整應用不在這個受限包內，裁決維持 PARTIAL。

依交接核對，目前公開客戶端同名模組與這份審查來源的雜湊相符；這只確認該模組內容，不是完整 runtime 已固定或 base-18 真模型成果已接受。
