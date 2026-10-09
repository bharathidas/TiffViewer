import { CSSProperties, ReactElement, createElement, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import * as UTIF from "utif2";

export type Language = "en" | "de" | "fr" | "es" | "tr" | "ja" | "zh" | "ru" | "ar" | "hi";
export type Paginate = "bottom" | "top" | "ltr";

export interface TiffViewerProps {
    tiffvalueURI: string;
    height: string;
    lang: Language;
    paginate: Paginate;
    buttonColor: string;
    printable: boolean;
    zoomable: boolean;
    className?: string;
    style?: CSSProperties;
}

interface Texts {
    previous: string;
    next: string;
    page: string; // {page} and {total} are replaced
    zoomIn: string;
    zoomOut: string;
    print: string;
}

// Button texts; Previous, Next and the page text are the ones of react-tiff, which 1.0.0 used.
const TEXTS: Record<Language, Texts> = {
    en: {
        previous: "Previous",
        next: "Next",
        page: "Page {page} of {total}",
        zoomIn: "Zoom in",
        zoomOut: "Zoom out",
        print: "Print"
    },
    de: {
        previous: "Vorherige",
        next: "Nächste",
        page: "Seite {page} von {total}",
        zoomIn: "Vergrößern",
        zoomOut: "Verkleinern",
        print: "Drucken"
    },
    fr: {
        previous: "Précédent",
        next: "Suivant",
        page: "Page {page} sur {total}",
        zoomIn: "Zoom avant",
        zoomOut: "Zoom arrière",
        print: "Imprimer"
    },
    es: {
        previous: "Anterior",
        next: "Siguiente",
        page: "Página {page} de {total}",
        zoomIn: "Acercar",
        zoomOut: "Alejar",
        print: "Imprimir"
    },
    tr: {
        previous: "Önceki",
        next: "Sonraki",
        page: "{page}. sayfa / {total}",
        zoomIn: "Yakınlaştır",
        zoomOut: "Uzaklaştır",
        print: "Yazdır"
    },
    ja: {
        previous: "前へ",
        next: "次へ",
        page: "{page} / {total} ページ",
        zoomIn: "拡大",
        zoomOut: "縮小",
        print: "印刷"
    },
    zh: {
        previous: "上一页",
        next: "下一页",
        page: "第 {page} 页，共 {total} 页",
        zoomIn: "放大",
        zoomOut: "缩小",
        print: "打印"
    },
    ru: {
        previous: "Предыдущий",
        next: "Следующий",
        page: "Страница {page} из {total}",
        zoomIn: "Увеличить",
        zoomOut: "Уменьшить",
        print: "Печать"
    },
    ar: {
        previous: "السابق",
        next: "التالي",
        page: "صفحة {page} من {total}",
        zoomIn: "تكبير",
        zoomOut: "تصغير",
        print: "طباعة"
    },
    hi: {
        previous: "पिछला",
        next: "अगला",
        page: "पृष्ठ {page} / {total}",
        zoomIn: "ज़ूम इन",
        zoomOut: "ज़ूम आउट",
        print: "प्रिंट"
    }
};

// "DE", " fr " and "en-US" are accepted; anything else is English.
export function toLanguage(value: string | undefined): Language {
    const code = value?.trim().toLowerCase().split(/[-_]/)[0];
    return code && code in TEXTS ? (code as Language) : "en";
}

export function toPaginate(value: string | undefined): Paginate {
    const mode = value?.trim().toLowerCase();
    return mode === "top" || mode === "ltr" ? mode : "bottom";
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 1.25;

// Mendix file URLs carry extra parameters (such as changedDate); only the guid identifies the file.
function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url, window.location.href);
        const guid = parsed.searchParams.get("guid");
        if (guid && /\/file$/.test(parsed.pathname)) {
            return `${parsed.origin}${parsed.pathname}?guid=${encodeURIComponent(guid)}`;
        }
    } catch {
        // Not a URL that can be parsed; fetch it as it is.
    }
    return url;
}

// A TIFF file starts with "II*\0" (little-endian) or "MM\0*" (big-endian); BigTIFF uses 43 instead of 42.
function isTiff(buffer: ArrayBuffer): boolean {
    const b = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
    return (
        b.length === 4 &&
        ((b[0] === 0x49 && b[1] === 0x49 && (b[2] === 42 || b[2] === 43) && b[3] === 0) ||
            (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0 && (b[3] === 42 || b[3] === 43)))
    );
}

// Reduced-resolution images (thumbnails) are skipped when the file also has full-size pages.
function isThumbnail(ifd: UTIF.IFD): boolean {
    const subfileType = ifd.t254 as number[] | undefined;
    return Array.isArray(subfileType) && subfileType[0] % 2 === 1;
}

function renderPages(buffer: ArrayBuffer): HTMLCanvasElement[] {
    if (!isTiff(buffer)) {
        throw new Error("The file is not a valid TIFF image.");
    }
    let ifds: UTIF.IFD[];
    try {
        ifds = UTIF.decode(buffer);
    } catch {
        throw new Error("The file is not a valid TIFF image.");
    }
    const pages = ifds.some(ifd => !isThumbnail(ifd)) ? ifds.filter(ifd => !isThumbnail(ifd)) : ifds;

    const canvases: HTMLCanvasElement[] = [];
    for (const ifd of pages) {
        try {
            UTIF.decodeImage(buffer, ifd);
        } catch {
            continue;
        }
        if (!ifd.width || !ifd.height) {
            continue;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            continue;
        }
        canvas.width = ifd.width;
        canvas.height = ifd.height;
        canvas.className = "widget-tiffviewer-page";
        const imageData = ctx.createImageData(ifd.width, ifd.height);
        imageData.data.set(UTIF.toRGBA8(ifd));
        ctx.putImageData(imageData, 0, 0);
        canvases.push(canvas);
    }
    if (canvases.length === 0) {
        throw new Error("The TIFF file has no pages that can be shown.");
    }
    return canvases;
}

// Prints only the pages of the TIFF file (one per sheet) from a hidden frame, not the whole Mendix page.
function printPages(pages: HTMLCanvasElement[]): void {
    const frame = document.createElement("iframe");
    frame.className = "widget-tiffviewer-print-frame";
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
    document.body.appendChild(frame);
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!win || !doc) {
        frame.remove();
        return;
    }
    doc.open();
    doc.write(
        "<!doctype html><html><head><title></title><style>" +
            "@page{margin:10mm}html,body{margin:0}" +
            "img{display:block;max-width:100%;max-height:100vh;margin:0 auto;page-break-after:always;break-after:page}" +
            "img:last-child{page-break-after:auto;break-after:auto}" +
            "</style></head><body></body></html>"
    );
    doc.close();
    const images = pages.map(page => {
        const img = doc.createElement("img");
        img.src = page.toDataURL("image/png");
        doc.body.appendChild(img);
        return img;
    });
    const remove = (): void => {
        setTimeout(() => frame.remove(), 1000);
    };
    Promise.all(images.map(img => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined)))).then(
        () => {
            win.addEventListener("afterprint", remove);
            win.focus();
            win.print();
            // Browsers without afterprint in frames: remove the frame after a while.
            setTimeout(() => frame.remove(), 60000);
        }
    );
}

interface IconButtonProps {
    path: ReactElement;
    title: string;
    onClick: () => void;
    disabled?: boolean;
    className: string;
}

function IconButton({ path, title, onClick, disabled, className }: IconButtonProps): ReactElement {
    return (
        <button
            type="button"
            className={classNames("widget-tiffviewer-tool", className)}
            title={title}
            aria-label={title}
            onClick={onClick}
            disabled={disabled}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {path}
            </svg>
        </button>
    );
}

// Feather icons (MIT).
const ZOOM_IN = (
    <g>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </g>
);
const ZOOM_OUT = (
    <g>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </g>
);
const PRINT = (
    <g>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </g>
);

export function TiffViewerInput(props: TiffViewerProps): ReactElement {
    const { tiffvalueURI, height, lang, paginate, buttonColor, printable, zoomable } = props;
    const texts = TEXTS[lang];

    const stageRef = useRef<HTMLDivElement>(null);
    const pageRef = useRef<HTMLDivElement>(null);

    const [pages, setPages] = useState<HTMLCanvasElement[]>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [fitScale, setFitScale] = useState(1);

    useEffect(() => {
        setPages([]);
        setPageIndex(0);
        setZoom(MIN_ZOOM);
        setError("");
        if (!tiffvalueURI) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        (async () => {
            try {
                const response = await fetch(normalizeUrl(tiffvalueURI), {
                    credentials: "same-origin",
                    cache: "no-store",
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error(`The TIFF file could not be loaded (HTTP ${response.status}).`);
                }
                const buffer = await response.arrayBuffer();
                if (controller.signal.aborted) {
                    return;
                }
                setPages(renderPages(buffer));
            } catch (e) {
                if (controller.signal.aborted) {
                    return;
                }
                setError(
                    e instanceof TypeError
                        ? "The TIFF file could not be loaded. Check the URL and, for another server, its CORS settings."
                        : (e as Error).message || "The TIFF file could not be shown."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        })();

        return () => controller.abort();
    }, [tiffvalueURI]);

    const page = pages[pageIndex];

    // Scale that makes the current page fit in the page area.
    const updateFitScale = useCallback(() => {
        const stage = stageRef.current;
        if (!stage || !page) {
            return;
        }
        const style = window.getComputedStyle(stage);
        const width = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const height = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        const scale = Math.min(width / page.width, height / page.height);
        // A hidden widget (for example in a closed tab) has no size yet; keep the natural size.
        setFitScale(scale > 0 && isFinite(scale) ? scale : 1);
    }, [page]);

    useEffect(() => {
        const holder = pageRef.current;
        if (!holder) {
            return;
        }
        holder.replaceChildren(...(page ? [page] : []));
        updateFitScale();
    }, [page, updateFitScale]);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => updateFitScale());
        observer.observe(stage);
        return () => observer.disconnect();
    }, [updateFitScale]);

    useEffect(() => {
        if (page) {
            page.style.width = `${page.width * fitScale * zoom}px`;
            page.style.height = `${page.height * fitScale * zoom}px`;
        }
    }, [page, fitScale, zoom]);

    const pageCount = pages.length;
    const hasPages = pageCount > 0;
    const previous = (): void => setPageIndex(i => Math.max(0, i - 1));
    const next = (): void => setPageIndex(i => Math.min(pageCount - 1, i + 1));
    const pageText = texts.page.replace("{page}", String(pageIndex + 1)).replace("{total}", String(pageCount));
    const buttonStyle = { backgroundColor: buttonColor, borderColor: buttonColor };

    const pager =
        pageCount > 1 && paginate !== "ltr" ? (
            <div className={classNames("widget-tiffviewer-pager", `widget-tiffviewer-pager-${paginate}`)}>
                <button
                    type="button"
                    className="widget-tiffviewer-page-button"
                    style={buttonStyle}
                    onClick={previous}
                    disabled={pageIndex === 0}
                >
                    {texts.previous}
                </button>
                <span className="widget-tiffviewer-page-number" aria-live="polite">
                    {pageText}
                </span>
                <button
                    type="button"
                    className="widget-tiffviewer-page-button"
                    style={buttonStyle}
                    onClick={next}
                    disabled={pageIndex === pageCount - 1}
                >
                    {texts.next}
                </button>
            </div>
        ) : null;

    return (
        <div
            className={classNames("widget-tiffviewer", props.className)}
            style={{ height, ...props.style }}
            dir={lang === "ar" ? "rtl" : undefined}
        >
            {(zoomable || printable) && (
                <div className="widget-tiffviewer-toolbar" dir="ltr">
                    {zoomable && (
                        <IconButton
                            path={ZOOM_IN}
                            title={texts.zoomIn}
                            className="widget-tiffviewer-zoom-in"
                            onClick={() => setZoom(z => Math.min(MAX_ZOOM, z * ZOOM_STEP))}
                            disabled={!hasPages || zoom >= MAX_ZOOM}
                        />
                    )}
                    {zoomable && (
                        <IconButton
                            path={ZOOM_OUT}
                            title={texts.zoomOut}
                            className="widget-tiffviewer-zoom-out"
                            onClick={() => setZoom(z => Math.max(MIN_ZOOM, z / ZOOM_STEP))}
                            disabled={!hasPages || zoom <= MIN_ZOOM}
                        />
                    )}
                    {printable && (
                        <IconButton
                            path={PRINT}
                            title={texts.print}
                            className="widget-tiffviewer-print"
                            onClick={() => printPages(pages)}
                            disabled={!hasPages}
                        />
                    )}
                </div>
            )}
            {paginate === "top" && pager}
            <div className="widget-tiffviewer-area">
                <div ref={stageRef} className="widget-tiffviewer-stage">
                    {loading && <div className="widget-tiffviewer-message">Loading TIFF...</div>}
                    {error && (
                        <div className="widget-tiffviewer-message widget-tiffviewer-error" role="alert">
                            {error}
                        </div>
                    )}
                    <div ref={pageRef} className="widget-tiffviewer-page-holder" />
                </div>
                {paginate === "ltr" && pageCount > 1 && (
                    <div dir="ltr">
                        <button
                            type="button"
                            className="widget-tiffviewer-arrow widget-tiffviewer-arrow-previous"
                            style={buttonStyle}
                            onClick={previous}
                            disabled={pageIndex === 0}
                            title={texts.previous}
                            aria-label={texts.previous}
                        >
                            {"<"}
                        </button>
                        <button
                            type="button"
                            className="widget-tiffviewer-arrow widget-tiffviewer-arrow-next"
                            style={buttonStyle}
                            onClick={next}
                            disabled={pageIndex === pageCount - 1}
                            title={texts.next}
                            aria-label={texts.next}
                        >
                            {">"}
                        </button>
                        <span className="widget-tiffviewer-page-badge" aria-live="polite">
                            {pageText}
                        </span>
                    </div>
                )}
            </div>
            {paginate === "bottom" && pager}
        </div>
    );
}
