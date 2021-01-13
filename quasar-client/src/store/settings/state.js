export default function() {
  return {
    options: {
      language: localStorage.getItem("language") || "nb-no",
      darkMode: localStorage.getItem("darkMode") === "true" || true
    }
  };
}
