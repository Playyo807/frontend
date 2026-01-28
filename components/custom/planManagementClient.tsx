"use client";

import { Calendar, Clock, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";

interface ClientPlan {
  id: string;
  useAmount: number;
  starts: Date;
  expires: Date;
  plan: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    planToService: Array<{
      service: {
        id: string;
        name: string;
        price: number;
        duration: number;
        imagePath: string;
      };
    }>;
  };
  barber: {
    id: string;
    displayName: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
}

export default function PlanManagementClient({
  clientPlan,
}: {
  clientPlan: ClientPlan | null;
}) {
  if (!clientPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="bg-slate-800/50 rounded-full p-8">
          <Package size={80} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-300">Sem Plano Ativo</h2>
        <p className="text-gray-400 text-center max-w-md">
          Você não possui nenhum plano ativo no momento. Entre em contato com seu
          barbeiro para saber mais sobre os planos disponíveis.
        </p>
      </div>
    );
  }

  const isExpired = new Date(clientPlan.expires) < new Date();
  const daysRemaining = differenceInDays(
    new Date(clientPlan.expires),
    new Date()
  );
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  // Calculate initial use amount (this is a simplified version)
  // In production, you might want to store the initial amount
  const totalServices = clientPlan.plan.planToService.length;

  return (
    <div className="space-y-6">
      {/* Plan Status Banner */}
      {isExpired ? (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-400" size={24} />
          <div>
            <h3 className="font-bold text-red-400">Plano Expirado</h3>
            <p className="text-sm text-gray-300">
              Seu plano expirou em{" "}
              {format(new Date(clientPlan.expires), "dd/MM/yyyy")}
            </p>
          </div>
        </div>
      ) : isExpiringSoon ? (
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-amber-400" size={24} />
          <div>
            <h3 className="font-bold text-amber-400">Plano Expirando</h3>
            <p className="text-sm text-gray-300">
              Seu plano expira em {daysRemaining} dia(s)
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="text-emerald-400" size={24} />
          <div>
            <h3 className="font-bold text-emerald-400">Plano Ativo</h3>
            <p className="text-sm text-gray-300">
              {daysRemaining} dias restantes
            </p>
          </div>
        </div>
      )}

      {/* Plan Details */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{clientPlan.plan.name}</h2>
            {clientPlan.plan.description && (
              <p className="text-gray-400 text-sm mt-1">
                {clientPlan.plan.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Valor do Plano</p>
            <p className="text-2xl font-bold text-emerald-400">
              R$ {clientPlan.plan.price}
            </p>
          </div>
        </div>

        {/* Barber Info */}
        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-400 mb-2">Barbeiro</p>
          <div className="flex items-center gap-3">
            <img
              src={clientPlan.barber.user.image || ""}
              alt={clientPlan.barber.displayName}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{clientPlan.barber.displayName}</p>
            </div>
          </div>
        </div>

        {/* Uses Remaining */}
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Package size={20} />
              Usos Restantes
            </h3>
            <span className="text-3xl font-bold text-emerald-400">
              {clientPlan.useAmount}
            </span>
          </div>
          <Progress
            value={clientPlan.useAmount * 10}
            className="h-3"
          />
          <p className="text-xs text-gray-400 mt-2">
            {clientPlan.useAmount === 0
              ? "Sem usos restantes"
              : `Você ainda tem ${clientPlan.useAmount} uso(s) disponível(is)`}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
              <Calendar size={16} />
              Início
            </p>
            <p className="font-semibold">
              {format(new Date(clientPlan.starts), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
              <Clock size={16} />
              Expiração
            </p>
            <p className={`font-semibold ${isExpired ? "text-red-400" : ""}`}>
              {format(new Date(clientPlan.expires), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>

        {/* Available Services */}
        <div>
          <h3 className="font-semibold mb-3">Serviços Inclusos</h3>
          <div className="grid gap-3">
            {clientPlan.plan.planToService.map((ps) => (
              <div
                key={ps.service.id}
                className="bg-slate-900 rounded-lg p-4 flex items-center gap-4"
              >
                <img
                  src={ps.service.imagePath}
                  alt={ps.service.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{ps.service.name}</h4>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {ps.service.duration} min
                    </span>
                    <span>R$ {ps.service.price}</span>
                  </div>
                </div>
                <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-sky-500/20 border border-sky-500/50 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-sky-400 mt-0.5" size={20} />
            <div className="text-sm text-gray-300">
              <p className="font-semibold mb-2">Como funciona:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use seu plano ao agendar serviços inclusos</li>
                <li>Cada agendamento consome 1 uso do plano</li>
                <li>O plano é válido até a data de expiração</li>
                <li>Entre em contato com seu barbeiro para renovar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}