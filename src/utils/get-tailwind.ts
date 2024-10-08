// eslint-disable-next-line import/no-unresolved
import cssText from "data-text:~style.css";

// Style lifecycle for Tailwind: https://docs.plasmo.com/quickstarts/with-tailwindcss#in-content-scripts-ui
export const getTailwind = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};
