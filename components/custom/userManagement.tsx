"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Calendar, User, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  createdAt: Date;
  role: string;
  _count: {
    bookings: number;
  };
}

interface UsersManagementProps {
  users: UserData[];
  barberId: string;
}

export default function UsersManagement({ users, barberId }: UsersManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(users);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleUserClick = (user: UserData) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Usuários</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total de Usuários</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Clientes Ativos</p>
          <p className="text-2xl font-bold">
            {users.filter((u) => u._count.bookings > 0).length}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total de Agendamentos</p>
          <p className="text-2xl font-bold">
            {users.reduce((sum, u) => sum + u._count.bookings, 0)}
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Agendamentos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.image || "https://via.placeholder.com/40"}
                          alt={user.name || "User"}
                          className="h-10 w-10 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-medium">{user.name || "Sem nome"}</p>
                          <p className="text-sm text-gray-400">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        {user.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                        {user._count.bookings}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {format(new Date(user.createdAt), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user);
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedUser.image || "https://via.placeholder.com/96"}
                  alt={selectedUser.name || "User"}
                  className="h-24 w-24 rounded-full border-4 border-sky-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <User className="text-sky-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Nome</p>
                    <p className="font-semibold">
                      {selectedUser.name || "Sem nome"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Mail className="text-sky-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-sm">
                      {selectedUser.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Phone className="text-sky-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="font-semibold">
                      {selectedUser.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Calendar className="text-sky-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Cadastrado em</p>
                    <p className="font-semibold">
                      {format(
                        new Date(selectedUser.createdAt),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                  <Calendar className="text-sky-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-400">Total de Agendamentos</p>
                    <p className="font-semibold text-2xl">
                      {selectedUser._count.bookings}
                    </p>
                  </div>
                  <Link href={`/admin/barber/users/${selectedUser.id}`}>
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}