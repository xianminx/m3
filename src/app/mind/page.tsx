import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LazyLoadedPageContent = dynamic(() => import('./PageContent'), {
    ssr: false, // Disable SSR for this component
    loading: () => <div>Loading...</div>, // Fallback content
});

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LazyLoadedPageContent />
        </Suspense>
    );
}
