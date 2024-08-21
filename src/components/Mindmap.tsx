"use client";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";
import { Markmap, loadCSS, loadJS } from "markmap-view";
import { Transformer, builtInPlugins } from "markmap-lib";
import { toast } from "react-toastify";

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
    while (wrapper?.firstChild) wrapper.firstChild.remove();
    if (mm && wrapper) {
        const toolbar = new Toolbar();
        // temp fix for toolbar brand layout issue
        toolbar.setBrand(false);
        toolbar.attach(mm);
        wrapper.append(toolbar.render());
    }
}

type MarkmapProps = {
    content: string;    
    style?: React.CSSProperties; // Add style prop
    className?: string; // Add className prop
};

export default function Mindmap(props: MarkmapProps) {
    const { content, style, className } = props;
    const refSvg = useRef<SVGSVGElement>(null);
    const refMm = useRef<Markmap>();
    const refToolbar = useRef<HTMLDivElement>(null);
    const transformer = useRef<Transformer>();

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const prepareMarkmap = async () => {
            try {
                if (!transformer.current) {
                    transformer.current = new Transformer([...builtInPlugins]);
                }
                // Create markmap and save to refMm
                if (!refMm.current) {
                    refMm.current = Markmap.create(refSvg.current!);
                    renderToolbar(refMm.current, refToolbar.current!);
                    const { scripts, styles } = transformer.current.getAssets();
                    await Promise.all([loadCSS(styles!), loadJS(scripts!, { getMarkmap: () => refMm.current })]);
                    console.log("Mindmap loaded: ", styles, scripts);
                }
                setIsReady(true); // Mark as ready

            } catch (e) {
                toast("Mindmap render error:" + e);
            }
        };
        prepareMarkmap();
    }, [refSvg]);

    useEffect(() => {
        if (isReady && refMm.current) {
            const mm = refMm.current;
            const { root, features } = transformer.current!.transform(content);
            console.log("Transformed content: ", root, features);
            const assets = transformer.current!.getAssets();
            console.log("Assets: ", assets);
            mm.setData(root);

            console.log("root", root);
            mm.fit();
        }
    }, [isReady, refMm, content, transformer]);

    return (
        <div className={`relative flex flex-col flex-grow w-full h-full ${className}`} style={style}> 
            <svg className="grow-1 flex-grow w-full h-full" ref={refSvg} />
            <div className="absolute right-0 top-0 mr-2 mt-2" ref={refToolbar}></div>
            
        </div>
    );
}
