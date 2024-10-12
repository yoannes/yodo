interface Timers {
  [key: string]: ReturnType<typeof setTimeout>;
}

export const debounce = (() => {
  const timers: Timers = {};

  return (callback: () => void, ms: number, id?: string) => {
    if (!id) {
      id = "debounce";
    }

    if (timers[id] === undefined) {
      delete timers[id];
    }

    clearTimeout(timers[id]);
    timers[id] = setTimeout(callback, ms);
  };
  // debounce(function(){ functionToCall(); }, milliseconds );
})();
