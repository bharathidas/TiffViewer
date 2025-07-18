import { ReactElement, createElement } from "react";

import { TiffViewerInput, TiffViewerProps } from "./components/TiffViewerInput";
import { TiffViewerPreviewProps } from "../typings/TiffViewerProps";

function parentInline(node?: HTMLElement | null): void {
    // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
    if (node && node.parentElement && node.parentElement.parentElement) {
        node.parentElement.parentElement.style.display = "inline-block";
    }
}

function transformProps(props: TiffViewerPreviewProps): TiffViewerProps {
    return {
        tiffvalueURI:props.bgImageKey?.type||'',
        buttonColor:props.buttonColorKey,
        lang:'en',
        paginate:'bottom',
        printable:props.printableKey?.toString()==='true',
        zoomable:props.zoomableKey?.toString()==='true'
       
    };
}

export function preview(props: TiffViewerPreviewProps): ReactElement {
    return (
        <div ref={parentInline}>
            <TiffViewerInput {...transformProps(props)}></TiffViewerInput>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/TiffViewer.css");
}
