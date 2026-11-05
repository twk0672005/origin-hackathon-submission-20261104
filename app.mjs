const button = document.querySelector('#inspect');
const status = document.querySelector('#status');
const list = document.querySelector('#checks');
button.addEventListener('click', async () => {
  button.disabled = true; status.textContent = 'Checking the fixed public interface…'; list.replaceChildren();
  try {
    const response = await fetch('/api/availability', { method: 'GET', cache: 'no-store', credentials: 'omit' });
    if (!response.ok) throw new Error('ENTRY_CHECK_UNAVAILABLE');
    const result = await response.json();
    status.textContent = result.status === 'PUBLIC_INTERFACES_REACHABLE' ? 'Public interface readable; world identity, real model result, and autonomous actions remain unverified.' : 'External dependency not ready or data incompatible; no alternative scene.';
    for (const row of result.checks) {
      const item = document.createElement('li');
      item.textContent = `${row.kind} · ${row.available ? 'HTTP 200 / readable' : row.error} · ${row.endpoint}`;
      list.append(item);
    }
  } catch { status.textContent = 'Check failed; external service cannot be confirmed; no fallback or fake success.'; }
  finally { button.disabled = false; }
});
