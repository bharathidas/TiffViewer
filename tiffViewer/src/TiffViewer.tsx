import { ReactElement, createElement } from "react";

import { TiffViewerContainerProps } from "../typings/TiffViewerProps";
import { TiffViewerInput, toLanguage, toPaginate } from "./components/TiffViewerInput";
import "./ui/TiffViewer.css";

const DEFAULT_HEIGHT = "600px";
const DEFAULT_BUTTON_COLOR = "#c53030";

// "600" is read as "600px"; anything else is passed to CSS as it is. Empty values use the default height.
export function toCssSize(value: string | undefined): string {
    const size = value?.trim();
    if (!size) {
        return DEFAULT_HEIGHT;
    }
    return /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size;
}

export function TiffViewer(props: TiffViewerContainerProps): ReactElement {
    const { bgImageKey, heightKey, languageKey, paginateKey, buttonColorKey, printableKey, zoomableKey } = props;

    return (
        <TiffViewerInput
            className={props.class}
            style={props.style}
            tiffvalueURI={bgImageKey.status === "available" ? bgImageKey.value?.uri ?? "" : ""}
            height={toCssSize(heightKey)}
            lang={toLanguage(languageKey?.value)}
            paginate={toPaginate(paginateKey?.value)}
            buttonColor={buttonColorKey?.value?.trim() || DEFAULT_BUTTON_COLOR}
            // No attribute selected: the buttons are shown, as in 1.0.0.
            printable={printableKey ? printableKey.value === true : true}
            zoomable={zoomableKey ? zoomableKey.value === true : true}
        />
    );
}
