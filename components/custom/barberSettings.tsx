"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Save,
  Upload,
  User,
  Clock,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateBarberProfile } from "@/lib/barberActions";
import { Prisma } from "@/prisma/generated/prisma/client";

type user_ = Prisma.UserGetPayload<{
  include: {
    barberProfile: true;
  };
}>;

export default function BarberProfileSettings({ user }: { user: user_ }) {
  if (!user.barberProfile) {
    throw Error("Not authorized");
  }

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    displayName: user.barberProfile.displayName,
    bio: user.barberProfile.bio || "",
    timeInterval: user.barberProfile.timeInterval.toString(),
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

  const handleSave = async () => {
    const timeInterval = parseInt(formData.timeInterval);

    if (!formData.displayName?.trim()) {
      toast.error("Nome de exibição é obrigatório");
      return;
    }

    if (isNaN(timeInterval) || timeInterval <= 0) {
      toast.error("Intervalo de tempo inválido");
      return;
    }

    if (timeInterval < 10 || timeInterval > 120) {
      toast.error("Intervalo de tempo deve estar entre 10 e 120 minutos");
      return;
    }

    startTransition(async () => {
      try {
        let imagePath = user.image;

        // Upload new image if selected
        if (imageFile) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Erro ao fazer upload da imagem");
          }

          const { path } = await uploadResponse.json();
          imagePath = path;
        }

        await updateBarberProfile(user.barberProfile?.id as string, {
          displayName: formData.displayName,
          bio: formData.bio || null,
          timeInterval,
          imagePath: imagePath || undefined,
        });

        toast.success("Perfil atualizado com sucesso!");
        setIsEditing(false);
        setImagePreview(null);
        setImageFile(null);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Erro ao atualizar perfil",
        );
      }
    });
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.barberProfile?.displayName as string,
      bio: user.barberProfile?.bio || "",
      timeInterval: user.barberProfile?.timeInterval.toString() as string,
    });
    setImagePreview(null);
    setImageFile(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações do Perfil</h2>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie suas informações de barbeiro
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit size={18} />
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-slate-800 rounded-lg p-6 space-y-6">
        {/* Profile Image */}
        <div>
          <Label className="mb-3 block">Foto de Perfil</Label>
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={
                  imagePreview ||
                  user.image ||
                  "https://via.placeholder.com/150"
                }
                alt={user.barberProfile.displayName}
                className="h-32 w-32 rounded-full object-cover border-4 border-slate-700"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                  >
                    <Upload className="text-white" size={32} />
                  </div>
                </div>
              )}
            </div>
            {isEditing && (
              <div className="flex-1">
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
                  <div className="flex flex-col items-center justify-center py-2">
                    <ImageIcon className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-400">
                      Clique para alterar foto
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG ou WEBP (max. 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <User size={16} />
            Nome de Exibição
          </Label>
          {isEditing ? (
            <Input
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              placeholder="Ex: João Silva"
              className="bg-slate-900 border-slate-700"
            />
          ) : (
            <div className="bg-slate-900 rounded-lg p-3">
              <p className="font-semibold">{user.barberProfile.displayName}</p>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Nome que será exibido para os clientes
          </p>
        </div>

        {/* Bio */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <FileText size={16} />
            Bio / Descrição
          </Label>
          {isEditing ? (
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Conte um pouco sobre você e sua experiência..."
              className="bg-slate-900 border-slate-700 min-h-25"
              maxLength={500}
            />
          ) : (
            <div className="bg-slate-900 rounded-lg p-3 min-h-15">
              <p className="text-gray-300 whitespace-pre-wrap">
                {user.barberProfile.bio || (
                  <span className="text-gray-500 italic">
                    Nenhuma bio adicionada
                  </span>
                )}
              </p>
            </div>
          )}
          {isEditing && (
            <p className="text-xs text-gray-400 mt-1">
              {formData.bio.length}/500 caracteres
            </p>
          )}
        </div>

        {/* Time Interval */}
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Clock size={16} />
            Intervalo de Tempo (minutos)
          </Label>
          {isEditing ? (
            <div>
              <Input
                type="number"
                value={formData.timeInterval}
                onChange={(e) =>
                  setFormData({ ...formData, timeInterval: e.target.value })
                }
                placeholder="Ex: 40"
                min="10"
                max="120"
                className="bg-slate-900 border-slate-700"
              />
              <p className="text-xs text-gray-400 mt-1">
                Duração padrão de cada horário de atendimento (10-120 minutos)
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-lg p-3">
              <p className="font-semibold text-emerald-400">
                {user.barberProfile.timeInterval} minutos
              </p>
            </div>
          )}
        </div>

        {/* Account Info (Read Only) */}
        <div className="border-t border-slate-700 pt-6">
          <h3 className="font-semibold mb-4">Informações da Conta</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Nome</span>
              <span className="font-medium">
                {user.name || "Não informado"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Para alterar nome ou email, use as configurações da conta
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
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
      )}

      {/* Stats */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="font-semibold mb-4">Estatísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Intervalo Padrão</p>
            <p className="text-2xl font-bold text-sky-400">
              {user.barberProfile.timeInterval}min
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Horários por Dia</p>
            <p className="text-2xl font-bold text-emerald-400">
              ~{Math.floor(780 / user.barberProfile.timeInterval)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Baseado em 13h de trabalho
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Bio Completa</p>
            <p className="text-2xl font-bold text-amber-400">
              {user.barberProfile.bio && user.barberProfile.bio.length > 20
                ? "Sim"
                : "Não"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
