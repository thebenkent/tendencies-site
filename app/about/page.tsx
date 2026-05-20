import { Metadata } from "next";
import WhatWeDoPage from "@/app/what-we-do/page";

export const metadata: Metadata = {
  title: "About — Tendencies",
  description:
    "Learn how we design, source, and deliver branded product people actually keep.",
};

export default function AboutPage() {
  return <WhatWeDoPage />;
}
