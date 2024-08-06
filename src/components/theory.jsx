"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Theory() {
  const plans = [
    {
      name: "Schemas",
      desc: "Cognitive structures that help organize and interpret information. They act as mental templates with knowledge about various concepts, events, and situations.",
      price: 0,
      isMostPop: false,
      features: ["Make the best schedule", "Make the best schedule"],
    },
    {
      name: "Role in Reading",
      desc: "When reading, individuals rely on their existing schemas, meaning their understanding is shaped by prior knowledge and experiences.",
      price: 10,
      isMostPop: false,
      features: [
        "Make the best schedule",
        "Make the best schedule",
        "Make the best schedule",
      ],
    },
    {
      name: "Schema Theory",
      desc: "Texts don’t have inherent meaning; they provide cues for readers to use their schemas to construct meaning.",
      price: 20,
      isMostPop: false,
      features: [
        "Make the best schedule",
        "Make the best schedule",
        "Make the best schedule",
        "Make the best schedule",
      ],
    },
  ];

  return (
    <section className="max-w-screen-xl w-full mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-screen-xl mx-auto px-4 md:px-8"
      >
        <div className="relative max-w-xl mx-auto sm:text-center">
          <h3 className="text-2xl font-light tracking-tighter sm:text-3xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty">
            Schema Theory for Reading
          </h3>
          <div className="mt-3 max-w-xl text-foreground/80 text-balance">
            <p>explains how our brains organize and interpret information by forming mental frameworks called schemas. </p>
          </div>
        </div>
        <div className="mt-16 gap-10 grid lg:grid-cols-3 place-content-center">
          {plans.map((item, idx) => (
            <Card
              key={idx}
              className={""
              }
            >
              <CardHeader>
                <span className="font-medium ">{item.name}</span>
              </CardHeader>
              <Divider />
              <CardBody className="gap-3">
             
                <p>{item.desc}</p>
              
              </CardBody>
             
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
