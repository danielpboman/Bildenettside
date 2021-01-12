export default function() {
  return {
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("identity"),
    loggingIn: false,
    users: []
  };
}
