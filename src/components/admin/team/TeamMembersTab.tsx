import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TeamMembersTabProps {
  teamId: string;
}

export const TeamMembersTab = ({ teamId }: TeamMembersTabProps) => {
  const { t } = useTranslation('admin');
  const { data: members, isLoading, refetch } = useTeamMembers(teamId);
  const { isSaving, createTeamMember, updateTeamMember, resetMemberPassword, deactivateTeamMember, activateTeamMember } = useTeamManagement();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMember, setNewMember] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'merchant' as 'admin' | 'partner' | 'merchant'
  });

  const handleCreateMember = async () => {
    const result = await createTeamMember({
      ...newMember,
      team_id: teamId
    });
    
    if (result.data) {
      setShowCreateModal(false);
      setNewMember({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'merchant'
      });
      refetch();
    }
  };

  const handlePasswordReset = async (memberId: string, memberName: string) => {
    const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    
    const result = await resetMemberPassword(memberId, newPassword);
    if (!result.error) {
      toast.success(t('teamManagement.messages.passwordChanged'), {
        description: `${t('teamManagement.resetPasswordDialog.newPassword')}: ${newPassword}`
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">{t('teamManagement.roles.admin')}</Badge>;
      case 'partner':
        return <Badge variant="default">{t('teamManagement.roles.partner')}</Badge>;
      default:
        return <Badge variant="secondary">{t('teamManagement.roles.merchant')}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('teams.members.title')}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {t('teams.members.subtitle')}
            </p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('teams.members.addMember')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('teams.members.addMember')}</DialogTitle>
                <DialogDescription>
                  {t('teams.members.addMemberDescription')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">{t('teamManagement.firstName')}</Label>
                    <Input
                      id="first_name"
                      value={newMember.first_name}
                      onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">{t('teamManagement.lastName')}</Label>
                    <Input
                      id="last_name"
                      value={newMember.last_name}
                      onChange={(e) => setNewMember({ ...newMember, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{t('teamManagement.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('teamManagement.phone')}</Label>
                  <Input
                    id="phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t('teamManagement.temporaryPassword')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newMember.password}
                    onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                    placeholder={t('teamManagement.newMember.enterTemporaryPassword')}
                  />
                </div>

                <div>
                  <Label htmlFor="role">{t('teamManagement.role')}</Label>
                  <Select value={newMember.role} onValueChange={(value: any) => setNewMember({ ...newMember, role: value })}>
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

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    {t('teamManagement.cancel')}
                  </Button>
                  <Button onClick={handleCreateMember} disabled={isSaving}>
                    {isSaving ? t('teamManagement.creating') : t('teamManagement.create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{member.first_name} {member.last_name}</div>
                        {member.phone && (
                          <div className="text-sm text-muted-foreground">{member.phone}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{getRoleBadge(member.role || 'merchant')}</TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? 'default' : 'secondary'}>
                      {member.is_active ? t('teamManagement.active') : t('teamManagement.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(member.created_at), 'dd.MM.yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          {t('common:buttons.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handlePasswordReset(member.id, `${member.first_name} ${member.last_name}`)}
                        >
                          {t('teamManagement.resetPassword')}
                        </DropdownMenuItem>
                        {member.is_active ? (
                          <DropdownMenuItem 
                            onClick={() => deactivateTeamMember(member.id)}
                            className="text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('teamManagement.deactivate')}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => activateTeamMember(member.id)}
                          >
                            {t('teamManagement.activate')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {members?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('teams.members.noMembers')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};