import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Users, UserCheck, UserX, Edit, Key, Copy, Info, LogIn, RotateCcw, Trash2 } from "lucide-react";
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from './AdminLayout';

const TeamManagement = () => {
  const { t } = useTranslation('admin');
  const { teamMembers, isLoading, isSaving, createTeamMember, updateTeamMember, resetMemberPassword, deactivateTeamMember, activateTeamMember, deleteTeamMember } = useTeamManagement();
  const { signOut } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [resetPasswordMember, setResetPasswordMember] = useState<any>(null);
  const [deletingMember, setDeletingMember] = useState<any>(null);
  const [newMemberCredentials, setNewMemberCredentials] = useState<{email: string, password: string} | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);

  const handleCreateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get('password') as string;
    const email = formData.get('email') as string;
    
    const memberData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email,
      phone: formData.get('phone') as string,
      password,
      role: formData.get('role') as 'admin' | 'partner' | 'merchant',
    };

    const { error } = await createTeamMember(memberData);
    if (!error) {
      setIsCreateDialogOpen(false);
      setNewMemberCredentials({ email, password });
      setShowCredentialsDialog(true);
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleTestLoginAs = async (member: any) => {
    if (confirm(t('teamManagement.testLoginConfirm', { name: `${member.first_name} ${member.last_name}` }))) {
      try {
        // Sign out current user
        await signOut();
        
        // Redirect to auth page with a special parameter
        window.location.href = `/auth?test_user=${member.email}`;
        
        toast.info(t('teamManagement.messages.loggedOut'));
      } catch (error) {
        toast.error(t('teamManagement.messages.logoutError'));
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetPasswordMember) return;

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;

    const { error } = await resetMemberPassword(resetPasswordMember.id, newPassword);
    if (!error) {
      setResetPasswordMember(null);
      toast.success(t('teamManagement.messages.passwordChanged'), {
        description: `${t('teamManagement.resetPasswordDialog.newPassword')}: ${newPassword}`
      });
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'password') => {
    navigator.clipboard.writeText(text);
    const message = type === 'email' 
      ? t('teamManagement.messages.emailCopied')
      : t('teamManagement.messages.passwordCopied');
    toast.success(message);
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    
    const { error } = await deleteTeamMember(deletingMember.id);
    if (!error) {
      setDeletingMember(null);
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
        return <Badge variant="destructive">{t('teamManagement.roles.admin')}</Badge>;
      case 'partner':
        return <Badge variant="default">{t('teamManagement.roles.partner')}</Badge>;
      case 'merchant':
        return <Badge variant="secondary">{t('teamManagement.roles.merchant')}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title={t('teamManagement.title')} subtitle={t('teamManagement.subtitle')}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">{t('teamManagement.loading')}</span>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('teamManagement.title')} subtitle={t('teamManagement.subtitle')}>
      <div className="space-y-6">
        {/* Role Management Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Info className="h-5 w-5" />
              {t('teamManagement.roleManagement')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-900 mb-2">{t('teamManagement.roles.admin')}</div>
                <div className="text-blue-700">{t('teamManagement.roles.adminDescription')}</div>
              </div>
              <div>
                <div className="font-medium text-blue-900 mb-2">{t('teamManagement.roles.partner')}</div>
                <div className="text-blue-700">{t('teamManagement.roles.partnerDescription')}</div>
              </div>
              <div>
                <div className="font-medium text-blue-900 mb-2">{t('teamManagement.roles.merchant')}</div>
                <div className="text-blue-700">{t('teamManagement.roles.merchantDescription')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('teamManagement.title')}
                </CardTitle>
                <CardDescription>
                  {t('teamManagement.subtitle')}
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('teamManagement.addMember')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('teamManagement.newMember.title')}</DialogTitle>
                    <DialogDescription>
                      {t('teamManagement.newMember.description')}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateMember} className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">{t('teamManagement.firstName')}</Label>
                        <Input id="first_name" name="first_name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">{t('teamManagement.lastName')}</Label>
                        <Input id="last_name" name="last_name" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('teamManagement.email')}</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('teamManagement.phone')}</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t('teamManagement.temporaryPassword')}</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder={t('teamManagement.newMember.enterTemporaryPassword')}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">{t('teamManagement.role')}</Label>
                      <Select name="role" required>
                        <SelectTrigger>
                          <SelectValue placeholder={t('teamManagement.selectRole')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="merchant">{t('teamManagement.roles.merchant')}</SelectItem>
                          <SelectItem value="partner">{t('teamManagement.roles.partner')}</SelectItem>
                          <SelectItem value="admin">{t('teamManagement.roles.admin')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        {t('teamManagement.cancel')}
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? t('teamManagement.creating') : t('teamManagement.create')}
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
                  <TableHead>{t('teamManagement.member')}</TableHead>
                  <TableHead>{t('teamManagement.email')}</TableHead>
                  <TableHead>{t('teamManagement.role')}</TableHead>
                  <TableHead>{t('teamManagement.status')}</TableHead>
                  <TableHead>{t('teamManagement.created')}</TableHead>
                  <TableHead>{t('teamManagement.actions')}</TableHead>
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
                          {t('teamManagement.active')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          <UserX className="h-3 w-3 mr-1" />
                          {t('teamManagement.inactive')}
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setResetPasswordMember(member)}
                          title={t('teamManagement.resetPasswordTooltip')}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestLoginAs(member)}
                          title={t('teamManagement.testLoginTooltip')}
                        >
                          <LogIn className="h-3 w-3" />
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
                         <Button
                           size="sm"
                           variant="destructive"
                           onClick={() => setDeletingMember(member)}
                           title={t('teamManagement.delete')}
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>

        {/* Delete Member Dialog */}
        <AlertDialog open={!!deletingMember} onOpenChange={() => setDeletingMember(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('teamManagement.confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('teamManagement.confirmDeleteDescription')}
                {deletingMember && (
                  <div className="mt-2 font-medium">
                    {deletingMember.first_name} {deletingMember.last_name} ({deletingMember.email})
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('teamManagement.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteMember}
                className="bg-red-600 hover:bg-red-700"
                disabled={isSaving}
              >
                {isSaving ? t('teamManagement.creating') : t('teamManagement.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        
        {/* Credentials Display Dialog */}
        <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t('teamManagement.credentials.title')}
              </DialogTitle>
              <DialogDescription>
                {t('teamManagement.credentials.description')}
              </DialogDescription>
            </DialogHeader>
            {newMemberCredentials && (
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {t('teamManagement.credentials.copyNote')}
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">{t('teamManagement.credentials.email')}</Label>
                      <p className="text-sm">{newMemberCredentials.email}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(newMemberCredentials.email, 'email')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">{t('teamManagement.credentials.password')}</Label>
                      <p className="text-sm font-mono">{newMemberCredentials.password}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(newMemberCredentials.password, 'password')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCredentialsDialog(false);
                      setNewMemberCredentials(null);
                    }}
                  >
                    {t('teamManagement.credentials.close')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Member Dialog */}
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('teamManagement.editMember.title')}</DialogTitle>
              <DialogDescription>
                {t('teamManagement.editMember.description')}
              </DialogDescription>
            </DialogHeader>
            {editingMember && (
              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_first_name">{t('teamManagement.firstName')}</Label>
                    <Input 
                      id="edit_first_name" 
                      name="first_name" 
                      defaultValue={editingMember.first_name}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_last_name">{t('teamManagement.lastName')}</Label>
                    <Input 
                      id="edit_last_name" 
                      name="last_name" 
                      defaultValue={editingMember.last_name}
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_email">{t('teamManagement.email')}</Label>
                  <Input 
                    id="edit_email" 
                    name="email" 
                    type="email" 
                    defaultValue={editingMember.email}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_phone">{t('teamManagement.phone')}</Label>
                  <Input 
                    id="edit_phone" 
                    name="phone" 
                    type="tel" 
                    defaultValue={editingMember.phone || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_role">{t('teamManagement.role')}</Label>
                  <Select name="role" defaultValue={editingMember.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="merchant">{t('teamManagement.roles.merchant')}</SelectItem>
                      <SelectItem value="partner">{t('teamManagement.roles.partner')}</SelectItem>
                      <SelectItem value="admin">{t('teamManagement.roles.admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditingMember(null)}>
                    {t('teamManagement.cancel')}
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? t('teamManagement.editMember.saving') : t('teamManagement.editMember.save')}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={!!resetPasswordMember} onOpenChange={() => setResetPasswordMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('teamManagement.resetPasswordDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('teamManagement.resetPasswordDialog.description')} {resetPasswordMember?.first_name} {resetPasswordMember?.last_name}
              </DialogDescription>
            </DialogHeader>
            {resetPasswordMember && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('teamManagement.resetPasswordDialog.newPassword')}</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    placeholder={t('teamManagement.resetPasswordDialog.enterNewPassword')}
                    required 
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setResetPasswordMember(null)}>
                    {t('teamManagement.cancel')}
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? t('teamManagement.resetPasswordDialog.changing') : t('teamManagement.resetPasswordDialog.change')}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
