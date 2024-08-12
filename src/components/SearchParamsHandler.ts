import { decode } from '@/utils/encoder';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface SearchParamsHandlerProps {
    setContent: (value: string) => void;
    setMode: (value: string) => void;
}

export const SearchParamsHandler = ({
    setContent,
    setMode,
}: SearchParamsHandlerProps) => {
    const searchParams = useSearchParams();
    useEffect(() => {
        const hash = searchParams.get('hash');
        const gist = searchParams.get('gist');
        if (hash) {
            setContent(decode(hash));
        } else if (gist) {
            fetch(`${gist}`)
                .then((response) => response.text())
                .then((data) => {
                    setContent(data);
                    console.log('data', data);
                })
                .catch((error) => toast('Error fetching the gist:', error));
        }

        const mode = searchParams.get('mode') || 'mindmap';
        setMode(mode);
    }, [searchParams, setContent, setMode]);
    return null;
};
