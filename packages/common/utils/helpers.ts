export function stopwatch(name = 'Timer') {
  const startTime = new Date().getTime();

  function stop() {
    const duration = new Date().getTime() - startTime;

    // Helper is meant to be used for debugging purposes.
    // eslint-disable-next-line no-console
    console.log(`${name}: duration ${duration / 1000}s (${duration}ms)`);
  }

  return stop;
}

export function delay(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
}
