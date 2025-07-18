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
    languageKey?: EditableValue<string>;
    paginateKey?: EditableValue<string>;
    buttonColorKey?: EditableValue<string>;
    printableKey?: EditableValue<boolean>;
    zoomableKey?: EditableValue<boolean>;
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
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    bgImageKey: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    languageKey: string;
    paginateKey: string;
    buttonColorKey: string;
    printableKey: string;
    zoomableKey: string;
}
