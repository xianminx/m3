

export default function Page() {
    console.log('Page loading....');
    return (
        <div className='flex flex-1 bg-red-100 overflow-scroll'>
        <div className="flex flex-col flex-grow border-red-700 bg-slate-300">
            <div className="flex-grow ">
                {Array.from({ length: 1000 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>
        </div>
        </div>
    );
}