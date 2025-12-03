document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    document.querySelectorAll('video').forEach(v => {
      v.currentTime = 0;
      v.play().catch(() => {});
    });
  }
});
