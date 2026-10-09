import { ReactElement, createElement } from "react";
import classNames from "classnames";

import { TiffViewerPreviewProps } from "../typings/TiffViewerProps";

// Design mode cannot load the file (a dynamic image is only known at run time), so it shows a placeholder.
export function preview(props: TiffViewerPreviewProps): ReactElement {
    const source =
        props.bgImageKey?.type === "dynamic"
            ? `dynamic image of ${props.bgImageKey.entity}`
            : props.bgImageKey?.type === "static"
            ? "static image"
            : "(no image selected)";
    return (
        <div className={classNames("widget-tiffviewer", props.class)} style={{ height: 200, ...props.styleObject }}>
            <div className="widget-tiffviewer-toolbar">
                <span>Zoom · Print</span>
            </div>
            <div className="widget-tiffviewer-preview">TIFF Viewer: {source}</div>
            <div className="widget-tiffviewer-pager widget-tiffviewer-pager-bottom">
                <span>Previous · Page 1 of n · Next</span>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/TiffViewer.css");
}
