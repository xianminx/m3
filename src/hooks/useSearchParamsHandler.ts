// useSearchParamsHandler.ts
import { decode, encode } from '@/utils/encoder';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface UseSearchParamsHandlerProps {
    content: string;
    mode: string;
    setContent: (value: string) => void;
    setMode: (value: string) => void;
}

export const useSearchParamsHandler = (): UseSearchParamsHandlerProps => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [mode, setMode] = useState('mindmap');
    useEffect(() => {
        const modeParam = searchParams.get('mode') || 'mindmap';
        const hash = searchParams.get('hash');
        const gist = searchParams.get('gist');
        let initContent = '';
        setMode(modeParam);
        const fetchData = async () => {
            if (hash) {
                initContent = decode(hash);
            } else if (gist) {
                try {
                    const response = await fetch(`${gist}`);
                    const data = await response.text();
                    initContent = data;
                    console.log('data', data);
                } catch (error) {
                    toast.error(`Error fetching the gist: ${error}`);
                }
            }
            if (!initContent) {
                try {
                    console.log(
                        'no gist or hash is given, load the sample markdown'
                    );

                    const response = await fetch('/sample.md');
                    initContent = await response.text();
                } catch (error) {
                    toast.error(`Error fetching the markdown file: ${error}`);
                }
            }
            setContent(initContent);
        };

        fetchData();
    }, [searchParams]);

    useEffect(() => {
        const encodedContent = encode(content);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('mode', mode);
        newParams.set('hash', encodedContent);
        router.replace(`?${newParams.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, mode]);

    return { content, mode, setContent, setMode };
};
