"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Search,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Tag,
  Save,
  X,
  Upload,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { updateService, createService, deleteService } from "@/lib/serviceActions";
import type { Service } from "@/prisma/generated/prisma/client";

export default function ServiceManagement({
  services,
  barberId,
}: {
  services: Service[];
  barberId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    duration: "",
    keyword: "",
  });

  // Add form state
  const [addForm, setAddForm] = useState({
    name: "",
    price: "",
    duration: "",
    keyword: "",
  });

  const filteredServices = services.filter((service) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(searchLower) ||
      service.keyword.toLowerCase().includes(searchLower)
    );
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setEditForm({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      keyword: service.keyword,
    });
    setImagePreview(null);
    setImageFile(null);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedService) return;

    const price = parseInt(editForm.price);
    const duration = parseInt(editForm.duration);

    if (!editForm.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast.error("Preço inválido");
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      toast.error("Duração inválida");
      return;
    }

    if (!editForm.keyword.trim()) {
      toast.error("Palavra-chave é obrigatória");
      return;
    }

    startTransition(async () => {
      try {
        let imagePath = selectedService.imagePath;

        // Upload new image if selected
        if (imageFile) {
          const formData = new FormData();
          formData.append("file", imageFile);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Erro ao fazer upload da imagem");
          }

          const { path } = await uploadResponse.json();
          imagePath = path;
        }

        await updateService(selectedService.id, {
          name: editForm.name,
          price,
          duration,
          keyword: editForm.keyword,
          imagePath,
        });

        toast.success("Serviço atualizado com sucesso!");
        setEditDialogOpen(false);
        setImagePreview(null);
        setImageFile(null);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar serviço"
        );
      }
    });
  };

  const handleAddClick = () => {
    setAddForm({
      name: "",
      price: "",
      duration: "",
      keyword: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setAddDialogOpen(true);
  };

  const handleAddSave = async () => {
    const price = parseInt(addForm.price);
    const duration = parseInt(addForm.duration);

    if (!addForm.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (isNaN(price) || price <= 0) {
      toast.error("Preço inválido");
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      toast.error("Duração inválida");
      return;
    }

    if (!addForm.keyword.trim()) {
      toast.error("Palavra-chave é obrigatória");
      return;
    }

    if (!imageFile) {
      toast.error("Imagem é obrigatória");
      return;
    }

    startTransition(async () => {
      try {
        // Upload image
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Erro ao fazer upload da imagem");
        }

        const { path } = await uploadResponse.json();

        // Create service
        await createService({
          name: addForm.name,
          price,
          duration,
          keyword: addForm.keyword,
          imagePath: path,
        });

        toast.success("Serviço criado com sucesso!");
        setAddDialogOpen(false);
        setImagePreview(null);
        setImageFile(null);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao criar serviço"
        );
      }
    });
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;

    startTransition(async () => {
      try {
        await deleteService(selectedService.id);
        toast.success("Serviço deletado com sucesso!");
        setDeleteDialogOpen(false);
        setSelectedService(null);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao deletar serviço"
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Serviços</h2>
          <p className="text-gray-400 text-sm mt-1">
            Edite preços, duração e detalhes dos serviços
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <Plus size={18} />
          Adicionar Serviço
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          placeholder="Buscar serviço por nome ou palavra-chave..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total de Serviços</p>
          <p className="text-3xl font-bold">{services.length}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Preço Médio</p>
          <p className="text-3xl font-bold">
            {(
              services.reduce((sum, s) => sum + s.price, 0) / services.length || 0
            ).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Duração Média</p>
          <p className="text-3xl font-bold">
            {Math.round(
              services.reduce((sum, s) => sum + s.duration, 0) / services.length || 0
            )}{" "}
            min
          </p>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-slate-800 rounded-lg">
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum serviço encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-sky-500 transition-all group"
            >
              <div className="relative h-40 bg-slate-700">
                <img
                  src={service.imagePath || "/placeholder-service.jpg"}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleEditClick(service)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDeleteClick(service)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <DollarSign size={14} />
                      Preço
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {service.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock size={14} />
                      Duração
                    </span>
                    <span className="font-semibold">{service.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Tag size={14} />
                      Código
                    </span>
                    <span className="font-mono text-xs bg-slate-700 px-2 py-1 rounded">
                      {service.keyword}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Atualize as informações do serviço
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label>Imagem do Serviço</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-sky-500 transition-colors cursor-pointer"
                >
                  {imagePreview || selectedService?.imagePath ? (
                    <div className="relative h-48 w-full">
                      <img
                        src={imagePreview || selectedService?.imagePath || ""}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={32} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-400">
                        Clique para selecionar uma imagem
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG ou WEBP (max. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>Nome do Serviço</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Ex: Corte Masculino"
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Preço (R$)</Label>
                <Input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  placeholder="Ex: 35"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Duração (min)</Label>
                <Input
                  type="number"
                  value={editForm.duration}
                  onChange={(e) =>
                    setEditForm({ ...editForm, duration: e.target.value })
                  }
                  placeholder="Ex: 30"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Palavra-chave</Label>
              <Input
                value={editForm.keyword}
                onChange={(e) =>
                  setEditForm({ ...editForm, keyword: e.target.value })
                }
                placeholder="Ex: CORTE"
                className="mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Código único para identificação interna
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setImagePreview(null);
                setImageFile(null);
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditSave} disabled={isPending}>
              {isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Serviço</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo serviço
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <Label>Imagem do Serviço *</Label>
              <div className="mt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-sky-500 transition-colors cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="relative h-48 w-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={32} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ImageIcon className="text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-400">
                        Clique para selecionar uma imagem
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG ou WEBP (max. 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>Nome do Serviço *</Label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                placeholder="Ex: Corte Masculino"
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Preço (R$) *</Label>
                <Input
                  type="number"
                  value={addForm.price}
                  onChange={(e) =>
                    setAddForm({ ...addForm, price: e.target.value })
                  }
                  placeholder="Ex: 35"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Duração (min) *</Label>
                <Input
                  type="number"
                  value={addForm.duration}
                  onChange={(e) =>
                    setAddForm({ ...addForm, duration: e.target.value })
                  }
                  placeholder="Ex: 30"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Palavra-chave *</Label>
              <Input
                value={addForm.keyword}
                onChange={(e) =>
                  setAddForm({ ...addForm, keyword: e.target.value.toUpperCase() })
                }
                placeholder="Ex: CORTE"
                className="mt-2"
              />
              <p className="text-xs text-gray-400 mt-1">
                Código único para identificação interna (automático em maiúsculas)
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setAddDialogOpen(false);
                setImagePreview(null);
                setImageFile(null);
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddSave} disabled={isPending}>
              {isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Criando...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Criar Serviço
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar "{selectedService?.name}"? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}