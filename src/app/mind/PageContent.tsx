'use client';
import Mindmap from '@/components/Mindmap';

import MarkdownEditor from '@/components/MarkdownEditor';
import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';
import Split from '@uiw/react-split';
import { useTheme } from 'next-themes';

export default function PageContent() {
    const { content, mode, setContent, setMode } = useSearchParamsHandler();
    const { theme } = useTheme();

    return (
        <Split className="flex-1 overflow-auto" style={{ border: '1px solid #d5d5d5', borderRadius: 3 }}>
            <MarkdownEditor className="w-1/2" theme={theme} content={content} onChange={(val) => setContent(val!)} />
            <Mindmap
                content={content}
                className={`overflow-scroll w-1/2 p-2 ${theme === 'dark' ? 'markmap-dark' : 'markmap'}`}
            />
        </Split>
    );
}
