import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(
  props: ImgHTMLAttributes<HTMLImageElement>,
) {
  return <img src="/tsdr3PLlogo.png" alt="App Logo" {...props} />;
}
