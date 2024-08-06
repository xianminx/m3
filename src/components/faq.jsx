"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { motion } from "framer-motion";

export default function Faq() {
const faq = [
      {
        "question": "What is s15n and how does it help with reading?",
        "answer": "s15n, or 'structuralization,' is a tool designed to convert PDF documents into mind-maps, aiding in smarter reading, better retention, and reduced information overload."
      },
      {
        "question": "How does schema theory enhance reading comprehension?",
        "answer": "Schema theory explains how our brains use mental frameworks to organize and interpret information, making reading more efficient by relating new information to existing knowledge."
      },
      {
        "question": "What are the common types of schemas identified in reading?",
        "answer": "The four common types are formal schemas (text structure), content schemas (text content), cultural schemas (shared cultural knowledge), and linguistic schemas (language used)."
      },
      {
        "question": "How does s15n utilize large language models (LLMs) for text analysis?",
        "answer": "s15n leverages LLMs like GPT to extract detailed structures from text documents, converting them into visual mind-maps for easier navigation and comprehension."
      },
      {
        "question": "What applications does schema theory have outside of reading?",
        "answer": "Schema theory applies to computer programming, language learning, architecture, art, and literature, helping to organize and interpret information in various domains."
      }
    ];
  
  

  const defaultContent =
    "Here is the content of the accordion. You can put any elements here.";
  return (
    <section className="relative max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <h4 className="text-2xl font-bold sm:text-3xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
          FAQ
        </h4>
        <p className="max-w-xl text-foreground/80 text-center">
          Here are answers to some common questions. If you have any other inquiries, please feel free to email us.
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
        className="max-w-2xl w-full border border-foreground/50 rounded-md p-1"
      >
        <Accordion
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                height: "auto",
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 1,
                  },
                },
              },
              exit: {
                y: -10,
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    easings: "ease",
                    duration: 0.25,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 0.3,
                  },
                },
              },
            },
          }}
        >
          {faq.map((item, idx) => (
            <AccordionItem key={idx} aria-label={item.question} title={item.question}>
              {item.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
