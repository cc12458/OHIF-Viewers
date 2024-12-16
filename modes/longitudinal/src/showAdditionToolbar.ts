export function showAdditionToolbar() {
  const el = document.querySelector<HTMLElement>(`#addition-toolbar`);
  if (el) {
    el.style.display = 'flex';
    return () => {
      el.style.display = 'none';
    };
  }
  return () => void 0;
}
