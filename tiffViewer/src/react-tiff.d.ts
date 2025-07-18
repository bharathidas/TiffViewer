declare module "react-tiff" {
  import * as React from "react";

  export interface TIFFViewerProps {
    tiff: string;
    lang?: "en" | "de" | "fr" | "es" | "tr";
    paginate?: "top" | "bottom";
    buttonColor?: string;
    printable?: boolean;
    zoomable?: boolean;
  }

  export const TIFFViewer: React.FC<TIFFViewerProps>;
  export default TIFFViewer;
}
