"use client";
import { useEffect, useState } from "react";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {encode} from "../../utils/encoder";

export default function Home() {
    const [content, setContent] = useState("A -> B: Hello");
    const [encodedUrl, setEncodedUrl] = useState("");

    useEffect(() => {
        const plantumlEncoder = require("plantuml-encoder");
        const str = encode(content);
        const url = `http://localhost:3000/mind?markdown=${str}`;
        setEncodedUrl(url);
    }, [content]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(encodedUrl);
        toast.success("Link copied to clipboard!");
    };
    return (
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <textarea
                className="w-full h-64 resize-none border border-gray-300 rounded-md p-2"
                value={content}
                onChange={handleContentChange}
            ></textarea>
            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleCopy}>
                    Copy Link
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={() => window.open(encodedUrl, "_blank")}>
                    Open Link
                </button>
            </div>
        </div>
    );
}
