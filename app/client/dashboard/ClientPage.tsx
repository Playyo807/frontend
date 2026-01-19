"use client";

import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import "../css/PhoneInput.css";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, scale } from "motion/react";
import { CheckCircle2, LogOut } from "lucide-react";
import { getUserBookings } from "@/lib/bookingActions";

export default function ClientPage() {
  const phoneUtil = new PhoneNumberUtil();
  const userBookings = getUserBookings();
  const { data: session, update } = useSession();
  const [phoneModal, setPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    //@ts-ignore
    if (session && !session.user?.phone) {
      setPhoneModal(true);
    }
  }, [session]);

  const validatePhoneNumber = (number: string, iso2: string) => {
    try {
      const parsedNumber = phoneUtil.parse("+" + number, iso2.toUpperCase());
      const isValid = phoneUtil.isValidNumber(parsedNumber);
      if (!isValid) {
        setPhoneError("Número inválido para " + iso2.toUpperCase());
        setIsPhoneValid(false);
      } else {
        setPhoneError("");
        setIsPhoneValid(true);
      }
    } catch (err) {
      setPhoneError("Número inválido para " + iso2.toUpperCase());
      setIsPhoneValid(false);
    }
  };

  const handlePhoneChange = (value: string, country: CountryData) => {
    setPhone(value);
    validatePhoneNumber(value, country.countryCode);
  };

  const handlePhoneSubmit = async () => {
    if (isPhoneValid) {
      update({
        phone: phone,
      });
      setPhoneModal(false);
      setAlert(true);
      const timeout = setTimeout(() => {
        setAlert(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
          >
            <Alert className="bg-emerald-500">
              <CheckCircle2 />
              <AlertTitle>Success! Autenticação completa!</AlertTitle>
              <AlertDescription className="text-gray-200">
                Conta criada com sucesso! Aproveite nossos serviços
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog open={phoneModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coloque seu número de telefone</DialogTitle>
            <div className="bg-gray-800/30 rounded">
              <PhoneInput
                countryCodeEditable={false}
                country="br"
                value={phone}
                onChange={handlePhoneChange}
                containerStyle={{
                  border: "1px solid #6b7280",
                  borderRadius: "0.375rem",
                }}
                inputStyle={{
                  width: "100%",
                  opacity: 1,
                  background: "transparent",
                  border: "1px solid #374151",
                  color: "#fff",
                  paddingRight: "0.75rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
                buttonClass="custom-phone-button"
                dropdownStyle={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  borderRadius: "0.375rem",
                }}
                searchStyle={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  opacity: 0.3,
                }}
              />
              {phoneError && (
                <p className="text-red-400 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <motion.button
                onClick={handlePhoneSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-sky-600 rounded-lg py-2 px-6 text-white cursor-pointer"
              >
                Confirmar
              </motion.button>
            </div>
            <DialogDescription>
              O número de telefone é necessário para concluir a criação da conta
              e permitir agendamentos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <main className="min-h-screen justify-center align-middle items-center text-center bg-slate-900 rounded-lg font-poppins">
        <header className="bg-black w-full p-2 flex flex-row align-middle justify-center">
          <div className="flex flex-1 flex-row align-middle items-center">
            <img
              src={session?.user?.image ?? ""}
              referrerPolicy="no-referrer"
              className="rounded-full h-12"
            />
            <h1 className="text-xl font-semibold ml-2">Você</h1>
          </div>
          <div className="flex flex-row align-middle items-center">
            <a className="flex flex-row align-middle items-center" href="/api/auth/signout">
              <h1 className="text-md mr-2">Sair</h1>
              <LogOut size={20}/>
            </a>
          </div>
        </header>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl text-white font-bold"
          >
            Seus agendamentos
          </motion.h1>
        </div>
      </main>
    </div>
  );
}
