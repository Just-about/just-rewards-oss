// eslint-disable-next-line import/no-unresolved
import sharedCssText from "data-text:@ja-packages/config/styles/shared.css";
// eslint-disable-next-line import/no-unresolved
import baseCssText from "data-text:~style.css";

// Style lifecycle for Tailwind: https://docs.plasmo.com/quickstarts/with-tailwindcss#in-content-scripts-ui
export const getTailwind = () => {
  const style = document.createElement("style");

  const validSharedCssText = sharedCssText.replaceAll(":root", ":host(plasmo-csui)");

  style.textContent = `${validSharedCssText}\n${baseCssText}`;
  return style;
};
