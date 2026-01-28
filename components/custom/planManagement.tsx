"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Users, Package, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  createPlanTemplate,
  updatePlanTemplate,
  deletePlanTemplate,
  createClientPlan,
  updateClientPlan,
  deleteClientPlan,
} from "@/lib/planActions";
import { format, addMonths } from "date-fns";
import type { Service } from "@/prisma/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Plan {
  id: string;
  name: string;
  price: number;
  keyword: string;
  description: string | null;
  planToService: Array<{
    service: Service;
  }>;
  clientPlans: Array<{
    id: string;
    useAmount: number;
    starts: Date;
    expires: Date;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }>;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function PlanManagement({
  plans,
  services,
  users,
}: {
  plans: Plan[];
  services: Service[];
  users: User[];
}) {
  const [isPending, startTransition] = useTransition();

  // Plan Template State
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Plan | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templatePrice, setTemplatePrice] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Client Plan State
  const [clientPlanDialogOpen, setClientPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [useAmount, setUseAmount] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [expiryDate, setExpiryDate] = useState(
    format(addMonths(new Date(), 1), "yyyy-MM-dd"),
  );
  const [autoExpiry, setAutoExpiry] = useState(true);

  // Edit Client Plan State
  const [editClientPlanOpen, setEditClientPlanOpen] = useState(false);
  const [editingClientPlan, setEditingClientPlan] = useState<any>(null);
  const [editUseAmount, setEditUseAmount] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");
  const [editPlan, setEditPlan] = useState<string | undefined>("");

  useEffect(() => {
    setEditPlan(
      plans.find((p) => {
        return p.clientPlans.find((cp) => cp.id === editingClientPlan?.id);
      })?.id,
    );
    console.log(editingClientPlan)
  }, [editingClientPlan]);

  const resetTemplateForm = () => {
    setTemplateName("");
    setTemplatePrice("");
    setTemplateDesc("");
    setSelectedServices([]);
    setEditingTemplate(null);
  };

  const resetClientPlanForm = () => {
    setSelectedPlan("");
    setSelectedUser("");
    setUseAmount("");
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setExpiryDate(format(addMonths(new Date(), 1), "yyyy-MM-dd"));
    setAutoExpiry(true);
  };

  const handleCreateTemplate = () => {
    if (!templateName || !templatePrice || selectedServices.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    startTransition(async () => {
      try {
        if (editingTemplate) {
          await updatePlanTemplate(editingTemplate.id, {
            name: templateName,
            price: parseInt(templatePrice),
            description: templateDesc,
            serviceIds: selectedServices,
          });
          toast.success("Plano atualizado!");
        } else {
          await createPlanTemplate(
            templateName,
            parseInt(templatePrice),
            selectedServices,
            templateDesc,
          );
          toast.success("Plano criado!");
        }
        setTemplateDialogOpen(false);
        resetTemplateForm();
        window.location.reload();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao salvar plano",
        );
      }
    });
  };

  const handleDeleteTemplate = (planId: string) => {
    if (!confirm("Tem certeza? Isso excluirá o plano.")) return;

    startTransition(async () => {
      try {
        await deletePlanTemplate(planId);
        toast.success("Plano excluído!");
        window.location.reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao excluir");
      }
    });
  };

  const handleEditTemplate = (plan: Plan) => {
    setEditingTemplate(plan);
    setTemplateName(plan.name);
    setTemplatePrice(plan.price.toString());
    setTemplateDesc(plan.description || "");
    setSelectedServices(plan.planToService.map((ps) => ps.service.id));
    setTemplateDialogOpen(true);
  };

  const handleCreateClientPlan = () => {
    if (!selectedPlan || !selectedUser || !useAmount) {
      toast.error("Preencha todos os campos");
      return;
    }

    startTransition(async () => {
      try {
        await createClientPlan(
          selectedUser,
          selectedPlan,
          parseInt(useAmount),
          new Date(startDate),
          new Date(expiryDate),
        );
        toast.success("Plano atribuído ao cliente!");
        setClientPlanDialogOpen(false);
        resetClientPlanForm();
        window.location.reload();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar plano",
        );
      }
    });
  };

  const handleEditClientPlan = () => {
    if (!editingClientPlan) return;

    startTransition(async () => {
      try {
        await updateClientPlan(editingClientPlan.id, {
          planId: editPlan,
          useAmount: parseInt(editUseAmount),
          expires: new Date(editExpiryDate),
        });
        toast.success("Plano atualizado!");
        setEditClientPlanOpen(false);
        window.location.reload();
      } catch (error) {
        toast.error("Erro ao atualizar plano");
      }
    });
  };

  const handleDeleteClientPlan = (clientPlanId: string) => {
    if (!confirm("Remover plano deste cliente?")) return;

    startTransition(async () => {
      try {
        await deleteClientPlan(clientPlanId);
        toast.success("Plano removido!");
        window.location.reload();
      } catch (error) {
        toast.error("Erro ao remover plano");
      }
    });
  };

  const openEditClientPlan = (clientPlan: any) => {
    setEditingClientPlan(clientPlan);
    setEditUseAmount(clientPlan.useAmount.toString());
    setEditExpiryDate(format(new Date(clientPlan.expires), "yyyy-MM-dd"));
    setEditClientPlanOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Planos</h2>
        <div className="flex gap-2">
          <Dialog
            open={templateDialogOpen}
            onOpenChange={setTemplateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={resetTemplateForm}>
                <Plus size={16} className="mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Editar Plano" : "Criar Novo Plano"}
                </DialogTitle>
                <DialogDescription>
                  Configure os detalhes do plano e serviços inclusos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Plano *</Label>
                  <Input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: Plano Bronze"
                  />
                </div>
                <div>
                  <Label>Preço *</Label>
                  <Input
                    type="number"
                    value={templatePrice}
                    onChange={(e) => setTemplatePrice(e.target.value)}
                    placeholder="Ex: 200"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={templateDesc}
                    onChange={(e) => setTemplateDesc(e.target.value)}
                    placeholder="Descrição opcional"
                  />
                </div>
                <div>
                  <Label>Serviços Inclusos *</Label>
                  <div className="border rounded-lg p-4 mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedServices([
                                ...selectedServices,
                                service.id,
                              ]);
                            } else {
                              setSelectedServices(
                                selectedServices.filter(
                                  (id) => id !== service.id,
                                ),
                              );
                            }
                          }}
                        />
                        <label className="flex-1 cursor-pointer">
                          {service.name} - R$ {service.price}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleCreateTemplate}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending
                    ? "Salvando..."
                    : editingTemplate
                      ? "Atualizar"
                      : "Criar Plano"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={clientPlanDialogOpen}
            onOpenChange={setClientPlanDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetClientPlanForm}>
                <UserPlus size={16} className="mr-2" />
                Atribuir Plano
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atribuir Plano a Cliente</DialogTitle>
                <DialogDescription>
                  Escolha um cliente e configure o plano
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Cliente *</Label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-800"
                  >
                    <option value="">Selecione um cliente</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Plano *</Label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-slate-800"
                  >
                    <option value="">Selecione um plano</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - R$ {plan.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Quantidade de Usos *</Label>
                  <Input
                    type="number"
                    value={useAmount}
                    onChange={(e) => setUseAmount(e.target.value)}
                    placeholder="Ex: 10"
                    min="1"
                  />
                </div>
                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (autoExpiry) {
                        setExpiryDate(
                          format(
                            addMonths(new Date(e.target.value), 1),
                            "yyyy-MM-dd",
                          ),
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={autoExpiry}
                    onCheckedChange={(checked: boolean) => {
                      setAutoExpiry(checked);
                      if (checked) {
                        setExpiryDate(
                          format(
                            addMonths(new Date(startDate), 1),
                            "yyyy-MM-dd",
                          ),
                        );
                      }
                    }}
                  />
                  <Label>Expirar automaticamente em 1 mês</Label>
                </div>
                <div>
                  <Label>Data de Expiração</Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disabled={autoExpiry}
                  />
                </div>
                <Button
                  onClick={handleCreateClientPlan}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending ? "Criando..." : "Atribuir Plano"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid gap-4">
        {plans.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <Package size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Nenhum plano criado ainda</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-slate-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-400">R$ {plan.price}</p>
                  {plan.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {plan.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTemplate(plan)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTemplate(plan.id)}
                    disabled={plan.clientPlans.length > 0}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">
                  Serviços Inclusos:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {plan.planToService.map((ps) => (
                    <span
                      key={ps.service.id}
                      className="bg-slate-700 px-3 py-1 rounded-full text-sm"
                    >
                      {ps.service.name}
                    </span>
                  ))}
                </div>
              </div>

              {plan.clientPlans.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Clientes ({plan.clientPlans.length})
                  </h4>
                  <div className="space-y-2">
                    {plan.clientPlans.map((cp) => (
                      <div
                        key={cp.id}
                        className="bg-slate-900 rounded p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={cp.user.image || ""}
                            alt={cp.user.name || "User"}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{cp.user.name}</p>
                            <p className="text-xs text-gray-400">
                              {cp.useAmount} usos restantes • Expira{" "}
                              {format(new Date(cp.expires), "dd/MM/yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditClientPlan(cp)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClientPlan(cp.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Client Plan Dialog */}
      <Dialog open={editClientPlanOpen} onOpenChange={setEditClientPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Plano do Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipo de plano</Label>
              <Select value={editPlan} onValueChange={setEditPlan}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan, i) => (
                    <SelectItem key={i} value={plan.id}>
                      {plan.name} - R$ {plan.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantidade de Usos</Label>
              <Input
                type="number"
                value={editUseAmount}
                onChange={(e) => setEditUseAmount(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label>Data de Expiração</Label>
              <Input
                type="date"
                value={editExpiryDate}
                onChange={(e) => setEditExpiryDate(e.target.value)}
              />
            </div>
            <Button
              onClick={handleEditClientPlan}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Atualizando..." : "Atualizar Plano"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
