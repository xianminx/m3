"use client";
import Mindmap from "@/components/Mindmap";
import { decode } from "@/utils/encoder";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function MindmapContent() {
    const [value, setValue] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const markdownParam = searchParams.get("content");
        if (markdownParam) {
            const decodedMarkdown = decode(markdownParam);
            setValue(decodedMarkdown);
        }
    }, [searchParams]);

    return <Mindmap content={value} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MindmapContent />
        </Suspense>
    );
}
