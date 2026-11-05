const button = document.querySelector('#inspect');
const status = document.querySelector('#status');
const list = document.querySelector('#checks');
button.addEventListener('click', async () => {
  button.disabled = true; status.textContent = '正在檢查固定公開介面…'; list.replaceChildren();
  try {
    const response = await fetch('/api/availability', { method: 'GET', cache: 'no-store', credentials: 'omit' });
    if (!response.ok) throw new Error('ENTRY_CHECK_UNAVAILABLE');
    const result = await response.json();
    status.textContent = result.status === 'PUBLIC_INTERFACES_REACHABLE' ? '公開介面可讀；世界身份、真模型及自主動作仍未驗證。' : '外部依賴未就緒或資料不相容，沒有替代場景。';
    for (const row of result.checks) {
      const item = document.createElement('li');
      item.textContent = `${row.kind} · ${row.available ? 'HTTP 200 / 可讀' : row.error} · ${row.endpoint}`;
      list.append(item);
    }
  } catch { status.textContent = '檢查失敗，無法確認外部服務；沒有回退或假成功。'; }
  finally { button.disabled = false; }
});
