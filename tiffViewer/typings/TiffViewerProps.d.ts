/**
 * This file was generated from TiffViewer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue, EditableValue, WebImage } from "mendix";

export interface TiffViewerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    bgImageKey: DynamicValue<WebImage>;
    heightKey: string;
    paginateKey?: EditableValue<string>;
    buttonColorKey?: EditableValue<string>;
    languageKey?: EditableValue<string>;
    zoomableKey?: EditableValue<boolean>;
    printableKey?: EditableValue<boolean>;
}

export interface TiffViewerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    bgImageKey: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
    heightKey: string;
    paginateKey: string;
    buttonColorKey: string;
    languageKey: string;
    zoomableKey: string;
    printableKey: string;
}
