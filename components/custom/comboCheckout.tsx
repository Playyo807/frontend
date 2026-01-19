import { motion } from "framer-motion";
import { Banknote, BanknoteArrowDown } from "lucide-react";

export function ComboCheckout({
  selectedServices,
  sumOfPrices,
  serviceData,
}: {
  selectedServices: [string, string][];
  sumOfPrices: () => string;
  serviceData: ServiceProps[];
}) {
  function handleDiscount(price: number): number {
    let length = selectedServices.length == 0 ? 1 : selectedServices.length;
    if (selectedServices[1]?.includes('LZ')) length = length - 1;
    const discountRate = (length - 1) * 5;
    return price - discountRate;
  }

  function priceSum(): number {
    const priceArray: number[] = selectedServices.map((service) => {
      const serviceInfo = serviceData.find((item) => item.id === service[0]);
      return serviceInfo ? Number(serviceInfo.price) : 0;
    });

    return priceArray.reduce((acc, p) => acc + (isNaN(p) ? 0 : p), 0);
  }

  return (
    <motion.div
      className="fixed z-80 top-1 left-1/2 transform -translate-x-1/2 w-[20em] lg:w-max grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-1 justify-center bg-black text-white p-4 rounded-md shadow-lg shadow-black/50 bg-linear-90 from-gray-900 via-black to-gray-900 border border-white/10 -gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
    >
      <div className="w-[12em] lg:w-[17em]">
        <p className="h-12">
          Preços dos Selecionados:{" "}
          <span className="font-bold text-emerald-400">{sumOfPrices()}</span>
        </p>
        <p>
          Serviços Selecionados:{" "}
          <span className="font-bold text-emerald-400">
            {selectedServices.length}
          </span>
        </p>
      </div>
      <div className="justify-start grid grid-cols-2">
        <div>
          <p className="text-sm">
            Subtotal:{" "}
            <span className="font-semibold text-emerald-500">
              {priceSum().toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
          <p className="grid grid-rows-2">
            <span className="text-sm">Descontos:</span>
            <span className="text-sm text-red-400 flex flex-row">
              -
              {(priceSum() - handleDiscount(priceSum())).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })} <BanknoteArrowDown size={20} className="ml-1" />
            </span>
          </p>
          <h2>
            Total:{" "}
            <span className="font-bold text-emerald-400 flex flex-row">
              {handleDiscount(priceSum()).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })} <Banknote size={24} className="ml-1" />
            </span>
          </h2>
        </div>
      </div>
    </motion.div>
  );
}
