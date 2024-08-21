// import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import PageContent from './PageContent';

// const LazyLoadedPageContent = dynamic(() => import('./PageContent'), {
//     ssr: false, // Disable SSR for this component
//     loading: () => <div>Loading...</div>, // Fallback content
// });

export default function Page() {
    console.log('Page loading....');
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
}
