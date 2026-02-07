"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextAnimate } from "@/components/ui/text-animate";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { DockMenu } from "@/components/custom/dockMenu";
import { ArrowRight, Circle, CircleCheckBig } from "lucide-react";
import { ComboCheckout } from "@/components/custom/comboCheckout";
import { InteractiveHoverButtonC } from "@/components/custom/interactiveHoverButtonCustom";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { encodeBookingData } from "@/lib/bookingParams";
import * as types from "@/lib/types";
import { Service } from "@/prisma/generated/prisma/client";

type bookingData = {
  startedBooking: boolean;
  selectedServices: [string, string][];
  barberId: string | null;
  appointmentDate: string | null | undefined;
  appointmentTime: string | null | undefined;
};

export default function Home({ serviceData }: { serviceData: Service[] }) {
  const router = useRouter();
  const [wordSwitch, setWordSwitch] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState<[string, string][]>(
    [],
  );
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "no-services-selected") {
      toast.error(
        "Ops, algo de errado aconteceu! Reconsidere voltar e escolher seus serviços novamente!",
      );
    }
  }, [error]);

  function sumOfPrices() {
    let sumS = "";
    selectedServices.forEach((s) => {
      const service = serviceData.find((service) => service.id === s[0]);
      if (service) {
        if (sumS !== "") {
          sumS += " + ";
        }
        sumS += "R$" + service.price.toString();
      }
    });
    return sumS;
  }

  function handleSubmit() {
    const bookingData: bookingData = {
      startedBooking: true,
      selectedServices: selectedServices,
      barberId: null,
      appointmentDate: null,
      appointmentTime: null,
    };

    const params = encodeBookingData(bookingData);
    router.push(`/client/barber?${params.toString()}`);
  }

  useEffect(() => {
    const t = setTimeout(() => setWordSwitch(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => setGridVisible(true), 200);
            return () => clearTimeout(t);
          }
        });
      },
      { threshold: 0.1 },
    );

    const servicesTab = document.getElementById("servicesTab");
    if (servicesTab) {
      observer.observe(servicesTab);
    }

    return () => {
      if (servicesTab) {
        observer.unobserve(servicesTab);
      }
    };
  }, []);

  console.log(selectedServices);

  return (
    <div>
      {selectedServices.length === 0 && <DockMenu />}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div className="fixed z-50 bottom-0 flex w-screen justify-center items-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.5 }}
              className="flex mb-8 items-center justify-center align-middle mx-auto"
            >
              <InteractiveHoverButtonC
                onClick={handleSubmit}
                Arrow={ArrowRight}
                className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md shadow-lg shadow-black/30 border-none mx-auto"
              >
                Finalizar Compra
              </InteractiveHoverButtonC>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex min-h-[115vh] items-center justify-center font-sans text-white relative">
        {/* Lens and background image as true background, with overflow-hidden and z-0 */}
        <div className="absolute inset-0 z-0 w-full h-[115vh] overflow-hidden">
          <img
            alt="dantas barbearia"
            src="/assets/main-background.png"
            className="w-full h-full object-cover object-center blur-md brightness-50"
          />
        </div>
        <div className="absolute bottom-0 left-0 h-64 w-full bg-linear-to-b from-transparent to-slate-950 z-10 pointer-events-none" />
        <main className="absolute text-center flex min-h-screen min-w-screen flex-col items-center justify-between py-32 px-16 sm:items-start -top-4">
          <motion.div className="m-auto">
            {!wordSwitch && (
              <motion.div
                animate={{ opacity: 0, translateY: 60 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                <TextAnimate
                  animation="blurInUp"
                  duration={1}
                  by="character"
                  once
                  className="text-2xl font-bold z-2"
                >
                  Seja bem-vindo à
                </TextAnimate>
              </motion.div>
            )}
            {wordSwitch && (
              <motion.div
                initial={{ opacity: 0, translateY: -60 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8 }}
              >
                <TextAnimate
                  animation="blurInUp"
                  duration={1}
                  by="character"
                  once
                  className="font-bold whitespace-nowrap
             text-3xl sm:text-4xl md:text-5xl"
                >
                  Dantas Barbearia
                </TextAnimate>
              </motion.div>
            )}
            <motion.div
              className="mx-auto"
              initial={{ translateY: 130, opacity: 0 }}
              animate={{ translateY: 60, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <a href="#servicesTab">
                <InteractiveHoverButton className="bg-emerald-700 border-none">
                  Ver serviços
                </InteractiveHoverButton>
              </a>
            </motion.div>
          </motion.div>
        </main>
      </div>
      <div>
        <main
          id="servicesTab"
          className="relative min-h-screen min-w-screen bg-linear-to-b from-slate-950 via-gray-800 to-slate-950 text-white flex flex-col items-center justify-center px-8 py-16 overflow-hidden"
        >
          <motion.h1
            className="text-4xl font-bold"
            initial={{ y: 0 }}
            animate={{ y: gridVisible ? -40 : 0 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.3 }}
          >
            Nossos Serviços
          </motion.h1>
          <motion.h2
            className="text-xl font-medium mb-4 text-slate-400"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: gridVisible ? -15 : 0, opacity: gridVisible ? 1 : 0 }}
            transition={{ type: "spring", bounce: 0.6, delay: 0.5 }}
          >
            Escolha um ou mais serviços
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl"
            initial="hidden"
            animate={gridVisible ? "visible" : "hidden"}
            variants={{
              hidden: {
                maxHeight: 0,
                opacity: 0,
                transition: {
                  when: "afterChildren",
                  duration: 0.1,
                  ease: "easeInOut",
                },
              },
              visible: {
                maxHeight: 2000,
                opacity: 1,
                transition: {
                  when: "beforeChildren",
                  duration: 1,
                  ease: "easeInOut",
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {serviceData.map((service: Service) => (
              <motion.div
                onClick={() => {
                  if (
                    selectedServices
                      .map((s) => s[1])
                      .includes(
                        service.keyword.substring(0, 2) === "CR"
                          ? "CR"
                          : service.keyword,
                      ) ||
                    (service.keyword === "PE" &&
                      selectedServices.map((s) => s[1]).includes("CR")) ||
                    (service.keyword.substring(0, 2) === "CR" &&
                      selectedServices.map((s) => s[1]).includes("PE")) ||
                    (service.keyword === "LZ" &&
                      selectedServices.map((s) => s[1]).includes("PLA")) ||
                    (service.keyword === "PLA" &&
                      selectedServices.map((s) => s[1]).includes("LZ"))
                  ) {
                    setSelectedServices((prev) =>
                      prev.filter((s) => s[0] !== service.id),
                    );
                  } else {
                    setSelectedServices((prev) => [
                      ...prev,
                      [
                        service.id,
                        service.keyword.substring(0, 2) === "CR"
                          ? "CR"
                          : service.keyword,
                      ],
                    ]);
                  }
                }}
                key={service.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <motion.div
                  className={`flex items-center gap-4 ${
                    (selectedServices
                      .map((s) => s[1])
                      .includes(
                        service.keyword.substring(0, 2) === "CR"
                          ? "CR"
                          : service.keyword,
                      ) ||
                      (service.keyword === "PE" &&
                        selectedServices.map((s) => s[1]).includes("CR")) ||
                      (service.keyword.substring(0, 2) === "CR" &&
                        selectedServices.map((s) => s[1]).includes("PE")) ||
                      (service.keyword === "LZ" &&
                        selectedServices.map((s) => s[1]).includes("PLA")) ||
                      (service.keyword === "PLA" &&
                        selectedServices.map((s) => s[1]).includes("LZ"))) &&
                    !selectedServices.map((s) => s[0]).includes(service.id)
                      ? `bg-gray-900 filter grayscale`
                      : `bg-slate-900/80 hover:bg-black hover:scale-105 cursor-pointer`
                  } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 w-full relative group`}
                >
                  {selectedServices.length > 0 && (
                    <div className="absolute -top-1 -right-1 rounded-full bg-black transition-all origin-bottom-right duration-300 z-50">
                      {selectedServices
                        .map((s) => s[0])
                        .includes(service.id) ? (
                        <CircleCheckBig size={25} />
                      ) : (
                        <Circle size={25} />
                      )}
                    </div>
                  )}
                  {service.imagePath && (
                    <img
                      src={service.imagePath}
                      alt={service.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-lg">
                      {service.name}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {service.duration - 5}-{service.duration} minutos
                    </p>
                  </div>
                  <span className="text-emerald-400 font-bold">
                    {service.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </motion.div>
              </motion.div>
            ))}
            <AnimatePresence>
              {selectedServices.length > 0 && (
                <ComboCheckout
                  selectedServices={selectedServices}
                  sumOfPrices={sumOfPrices}
                  serviceData={serviceData}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
