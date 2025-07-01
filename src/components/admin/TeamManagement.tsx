
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Users, UserCheck, UserX, Edit } from "lucide-react";
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { toast } from 'sonner';

const TeamManagement = () => {
  const { teamMembers, isLoading, isSaving, createTeamMember, updateTeamMember, deactivateTeamMember, activateTeamMember } = useTeamManagement();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const handleCreateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const memberData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as 'admin' | 'partner' | 'merchant',
    };

    const { error } = await createTeamMember(memberData);
    if (!error) {
      setIsCreateDialogOpen(false);
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember) return;

    const formData = new FormData(e.currentTarget);
    
    const updates = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as 'admin' | 'partner' | 'merchant',
    };

    const { error } = await updateTeamMember(editingMember.id, updates);
    if (!error) {
      setEditingMember(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'partner':
        return <Badge variant="default">Partner</Badge>;
      case 'merchant':
        return <Badge variant="secondary">Merchant</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Načítava sa...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Správa tímu
              </CardTitle>
              <CardDescription>
                Spravujte členov vášho tímu a ich oprávnenia
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať člena
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pridať nového člena tímu</DialogTitle>
                  <DialogDescription>
                    Vytvorte nový účet pre člena vášho tímu
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateMember} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Meno</Label>
                      <Input id="first_name" name="first_name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Priezvisko</Label>
                      <Input id="last_name" name="last_name" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefón</Label>
                    <Input id="phone" name="phone" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Heslo</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rola</Label>
                    <Select name="role" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte rolu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="merchant">Merchant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Zrušiť
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Vytvára sa...' : 'Vytvoriť'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Člen</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rola</TableHead>
                <TableHead>Stav</TableHead>
                <TableHead>Vytvorený</TableHead>
                <TableHead>Akcie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.first_name[0]}{member.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.first_name} {member.last_name}</p>
                        {member.phone && (
                          <p className="text-sm text-slate-600">{member.phone}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{getRoleBadge(member.role)}</TableCell>
                  <TableCell>
                    {member.is_active ? (
                      <Badge variant="outline" className="text-green-600">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Aktívny
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600">
                        <UserX className="h-3 w-3 mr-1" />
                        Neaktívny
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString('sk-SK')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {member.is_active ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deactivateTeamMember(member.id)}
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => activateTeamMember(member.id)}
                        >
                          <UserCheck className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť člena tímu</DialogTitle>
            <DialogDescription>
              Upravte údaje člena tímu
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_name">Meno</Label>
                  <Input 
                    id="edit_first_name" 
                    name="first_name" 
                    defaultValue={editingMember.first_name}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_last_name">Priezvisko</Label>
                  <Input 
                    id="edit_last_name" 
                    name="last_name" 
                    defaultValue={editingMember.last_name}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input 
                  id="edit_email" 
                  name="email" 
                  type="email" 
                  defaultValue={editingMember.email}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Telefón</Label>
                <Input 
                  id="edit_phone" 
                  name="phone" 
                  type="tel" 
                  defaultValue={editingMember.phone || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role">Rola</Label>
                <Select name="role" defaultValue={editingMember.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="merchant">Merchant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                  Zrušiť
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Ukladá sa...' : 'Uložiť'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
