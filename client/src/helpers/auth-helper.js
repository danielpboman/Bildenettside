export function authHeader() {
  let token = localStorage.getItem("jwt");

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
}
