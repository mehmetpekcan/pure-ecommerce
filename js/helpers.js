const localStorage = window.localStorage;

const setLocalStorage = (name, value) =>
  localStorage.setItem(name, JSON.stringify(value));
const getLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

const storage = {
  set: setLocalStorage,
  get: getLocalStorage,
};

export { storage };
