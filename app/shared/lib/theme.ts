export type Theme = "light" | "dark";

export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return prefersDark ? "dark" : "light";
}

export const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",s==="dark"||s==="light"?s:d?"dark":"light")}catch(e){}})();`;
