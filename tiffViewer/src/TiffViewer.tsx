import { ReactElement, createElement } from "react";

import { TiffViewerContainerProps } from "../typings/TiffViewerProps";
import { TiffViewerInput } from "./components/TiffViewerInput";
import "./ui/TiffViewer.css";

const allowedLangs = ["en", "de", "fr", "es", "tr"] as const;
const allowedPaginate = ["top", "bottom"] as const;

export function TiffViewer(props: TiffViewerContainerProps): ReactElement {
    const { bgImageKey,buttonColorKey,languageKey,paginateKey,printableKey,zoomableKey } = props;
   // console.info('layer:::'+name,bgImageKey,buttonColorKey,languageKey,paginateKey,printableKey,zoomableKey,);
    //console.info('layer tiifuri:'+bgImageKey.value?.uri);
    let tiffURI=(bgImageKey.value?.uri) ? stripExtraParams(bgImageKey.value?.uri) : undefined;
   
    let lang = toLang(languageKey?.displayValue || 'en');
    let paginate = toPaginate(paginateKey?.displayValue||'bottom') ;
    return (
        <TiffViewerInput
            
            tiffvalueURI={ tiffURI|| ''}
            lang={lang}
            buttonColor={buttonColorKey?.displayValue||''}
            paginate={ paginate}
            printable={printableKey?.value}
            zoomable={zoomableKey?.value}
        />
    );

function stripExtraParams(url: string): string {
    try {
        const parsedUrl = new URL(url);
        const guid = parsedUrl.searchParams.get("guid");
        if (guid) {
            return `${parsedUrl.origin}${parsedUrl.pathname}?guid=${guid}`;
        }
    } catch (e) {
        console.warn("Invalid TIFF URL:", url);
    }
    return url; // fallback
}


type LangType = (typeof allowedLangs)[number];
type PaginateType = (typeof allowedPaginate)[number];

// Converts input string to LangType if valid
function toLang(value: string | undefined): LangType | undefined {
    return allowedLangs.includes(value as LangType) ? (value as LangType) : undefined;
}

// Converts input string to PaginateType if valid
function toPaginate(value: string | undefined): PaginateType | undefined {
    return allowedPaginate.includes(value as PaginateType) ? (value as PaginateType) : undefined;
}

}
