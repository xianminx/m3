'use client';
/* eslint-disable @next/next/no-img-element */
import { Image } from '@nextui-org/image';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <div className="relative justify-center items-center">      
 
            <section className="max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
                <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col justify-center items-center space-y-5 max-w-4xl mx-auto text-center"
                >
                    <h1 className="text-4xl font-ligt tracking-tighter mx-auto md:text-6xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty">
                        Revolutionize reading with{' '}
                        <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text border-none">
                            Structuralization
                        </span>{' '}
                        for smarter comprehension
                    </h1>
                    <p className="max-w-2xl mx-auto text-foreground/80 text-balance">
                        Generate structures for your readings and improve your
                        comprehension
                    </p>
                </motion.div>
            </section>
            <motion.div
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="w-full h-full absolute -top-32 flex justify-end items-center -z-10"
            >
                <div className="w-3/4 flex justify-center items-center">
                    <div className="w-12 h-[600px] bg-light blur-[100px] rounded-3xl max-sm:rotate-[15deg] sm:rotate-[35deg]"></div>
                </div>
            </motion.div>
            <div className="w-full h-full flex justify-center items-center">
        <Image 
            isBlurred
            isZoomed
            width={1000}
            height={600}
            src="/markmap.svg"
            alt="Mind Map"
            className="m-5 pl-96"
        />
    </div>
      
        </div>
    );
}
