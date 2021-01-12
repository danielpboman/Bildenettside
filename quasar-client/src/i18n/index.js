import enUs from "./en.us";
import enUS from "./en.us";
import nbNO from "./nb.no";

export default {
  "en-us": enUS,
  "nb-no": nbNO
};

const options = [
  {
    label: enUS.language,
    value: enUS.label
  },
  {
    label: nbNO.language,
    value: nbNO.label
  }
];
export { options };
