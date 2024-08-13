export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <article className="prose prose-zinc prose-base w-full lg:w-1/2 mx-auto leading-loose text-justify pt-8">
            {children}
        </article>
    );
}
