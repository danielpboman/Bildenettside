export function authHeader() {
  let token = localStorage.getItem("identity");

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
}
