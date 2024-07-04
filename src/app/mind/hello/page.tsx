import '../../../app/globals.css';

export default function page() {
    return (
        <div className="flex flex-col min-h-full">
            <div className="h-12 flex justify-center text-center items-center bg-blue-400 text-blue-100"> header</div>{" "}
            <div id="content" className="flex justify-center  items-center text-center flex-grow bg-green-200">
              body div1
                
            </div>
        </div>
    );
}
