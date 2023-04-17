export function updateQueryParams(params: Record<string, string>) {
  if (history.pushState) {
    const searchParams = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    const newUrl = [
      window.location.protocol,
      '//',
      window.location.host,
      window.location.pathname,
      '?',
      searchParams.toString(),
    ].join('');
    window.history.pushState({ path: newUrl }, '', newUrl);
  }
}
