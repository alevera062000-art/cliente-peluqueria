"use client";

import { useState } from "react";
import { FAQ } from "@/lib/data/faq";
import { Reveal } from "@/components/ui/Reveal";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq">
      <div className="container">
        <Reveal className="contact-intro reveal">
          <span className="label">Preguntas frecuentes</span>
          <h2 className="section-title">Todo lo que necesitas saber</h2>
        </Reveal>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <div className={`faq-item${openIndex === i ? " open" : ""}`} key={item.question}>
              <button className="faq-q" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span>{item.question}</span>
                <div className="faq-icon">+</div>
              </button>
              <div className="faq-a">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
