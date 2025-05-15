import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  return <img src="/tsdroqlogo.png" alt="App Logo" {...props} />;
}
