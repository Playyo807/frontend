import { CheckCircle2, Package, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface PlanSelectorProps {
  activePlan: {
    id: string;
    useAmount: number;
    plan: {
      name: string;
      planToService: Array<{
        service: { id: string; name: string };
      }>;
    };
  } | null;
  selectedServices: string[];
  usePlan: boolean;
  onUsePlanChange: (use: boolean) => void;
  setSelectedPlanState?: React.Dispatch<React.SetStateAction<boolean>>;
  selectPlanState?: boolean;
}

export default function PlanSelector({
  activePlan,
  selectedServices,
  usePlan,
  onUsePlanChange,
  setSelectedPlanState,
  selectPlanState,
}: PlanSelectorProps) {
  if (!activePlan) return null;

  const planServiceIds = activePlan.plan.planToService.map(
    (ps) => ps.service.id,
  );
  const allServicesInPlan = selectedServices.every((id) =>
    planServiceIds.includes(id),
  );

  console.log("Selected: ", selectedServices, planServiceIds);

  if (!allServicesInPlan) {
    return (
      <div className="border border-amber-500/50 bg-amber-500/20 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-amber-400 mt-0.5" size={20} />
          <div className="text-sm text-gray-300">
            <p className="font-semibold mb-1">Plano aplícavel, mas...</p>
            <p>
              Alguns serviços selecionados não estão inclusos no seu plano{" "}
              <span className="font-semibold">{activePlan.plan.name}</span>.
            </p>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="text-emerald-500" size={20} />
              Usar Plano
            </h4>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                usePlan
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-600 hover:border-slate-500"
              }`}
              onClick={() => onUsePlanChange(!usePlan)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={usePlan}
                    onCheckedChange={onUsePlanChange}
                  />
                  <div>
                    <p className="font-bold text-emerald-400">
                      {activePlan.plan.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {activePlan.useAmount} uso(s) restante(s)
                    </p>
                  </div>
                </div>
                {usePlan && (
                  <div className="text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    Aplicado!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-700 pt-4 mt-4">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Package className="text-emerald-500" size={20} />
        Usar Plano
      </h4>

      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          usePlan && selectPlanState
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-slate-600 hover:border-slate-500"
        }`}
        onClick={() => {
          onUsePlanChange(true);
          setSelectedPlanState && setSelectedPlanState(true);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={usePlan && selectPlanState}
              onCheckedChange={() => onUsePlanChange(true)}
            />
            <div>
              <p className="font-bold text-emerald-400">
                {activePlan.plan.name}
              </p>
              <p className="text-sm text-gray-400">
                {activePlan.useAmount} uso(s) restante(s)
              </p>
            </div>
          </div>
          {usePlan && (
            <div className="text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 size={20} />
              Aplicado!
            </div>
          )}
        </div>
      </div>
      <div
        className={`border rounded-lg mt-2 p-4 cursor-pointer transition-all ${
          !usePlan && selectPlanState
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-slate-600 hover:border-slate-500"
        }`}
        onClick={() => {
          onUsePlanChange(false);
          setSelectedPlanState && setSelectedPlanState(true);
        }}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={!usePlan && selectPlanState}
            onCheckedChange={() => onUsePlanChange(false)}
          />
          <div>
            <p className="font-bold text-emerald-400">Não usar plano</p>
          </div>
        </div>
      </div>

      {usePlan && (
        <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
          <p className="text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} />
            Este agendamento usará 1 uso do seu plano (gratuito)
          </p>
        </div>
      )}
    </div>
  );
}

// Usage in your booking page:
// 1. Fetch the user's active plan when loading the page
// 2. Add state: const [usePlan, setUsePlan] = useState(false);
// 3. Add the component before the coupon selector:
// <PlanSelector
//   activePlan={activePlan}
//   selectedServices={selectedServices?.map(s => s[0]) || []}
//   usePlan={usePlan}
//   onUsePlanChange={setUsePlan}
// />

// 4. Modify the total price calculation to account for the plan:
// const finalPrice = usePlan ? 0 : (handleDiscount(totalPrice) - calculateDiscount());
