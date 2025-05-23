//cookie creation
export function setCookie(name, value, days = 365) {
  const cookieDate = new Date();
  cookieDate.setTime(cookieDate.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${cookieDate.toUTCString()};path=/`;
}

//getcookie
export function getCookie(name) {
  const cookie = document.cookie.split("; ");
  for (const c of cookie) {
    const [key, val] = c.split("=");
    if (key === name) return val;
  }
  return null;
}
