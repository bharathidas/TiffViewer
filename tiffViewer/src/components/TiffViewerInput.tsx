import { ReactElement, createElement, useEffect, useState } from "react";
import { TIFFViewer } from "react-tiff";
import "react-tiff/dist/index.css";


export interface TiffViewerProps {
    tiffvalueURI: string;
    lang?: "en" | "de" | "fr" | "es" | "tr";
    paginate?: "top" | "bottom";
    buttonColor?: string;
    printable?: boolean;
    zoomable?: boolean;
}

export function TiffViewerInput(props: TiffViewerProps): ReactElement {
    const {
        tiffvalueURI,
       
        lang = "en",
        paginate = "bottom",
        buttonColor = "#c53030",
        printable = true,
        zoomable = true
    } = props;

    const [safeUrl, setSafeUrl] = useState<string>("");

    useEffect(() => {
        async function prepareUrl() {
            let finalUrl = tiffvalueURI;

            // Clean up Mendix file URL if it contains extra params
            try {
                const parsed = new URL(tiffvalueURI);
                const guid = parsed.searchParams.get("guid");
                if (guid) {
                    finalUrl = `${parsed.origin}${parsed.pathname}?guid=${guid}`;
                }
            } catch (e) {
                console.warn("Invalid URL provided:", tiffvalueURI);
            }

            // Optionally fetch and check if valid TIFF
            try {
                const res = await fetch(finalUrl);
                const type = res.headers.get("Content-Type");

                if (res.ok && type?.includes("tiff")) {
                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    setSafeUrl(objectUrl);
                } else {
                    console.info("Invalid TIFF response or type:", type);
                }
            } catch (err) {
                console.info("Failed to fetch TIFF file:", err);
            }
        }

        if (tiffvalueURI) {
            prepareUrl();
        }
    }, [tiffvalueURI]);

    // console.info("TIFF Viewer Props:", {
    //     tiffvalueURI,
    //     lang,
    //     paginate,
    //     buttonColor,
    //     printable,
    //     zoomable
    // });

    return (
        <div style={{ width: "100%", height: "600px", overflow: "auto" }}>
            {safeUrl && (
                <TIFFViewer
                    tiff={safeUrl}
                    lang={lang}
                    paginate={paginate}
                    buttonColor={buttonColor}
                    printable={printable}
                    zoomable={zoomable}
                />
            )}
        </div>
    );
}
