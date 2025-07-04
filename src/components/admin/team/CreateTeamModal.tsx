import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTeam } from '@/hooks/useTeams';
import { useOrganizations } from '@/hooks/useOrganizations';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
  organization_id: z.string().min(1, 'Organization is required'),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateTeamModal = ({ open, onOpenChange }: CreateTeamModalProps) => {
  const { t } = useTranslation('admin');
  const createTeam = useCreateTeam();
  const { data: organizations } = useOrganizations();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
  });

  const onSubmit = async (data: TeamFormData) => {
    try {
      await createTeam.mutateAsync({
        name: data.name,
        description: data.description,
        organization_id: data.organization_id,
        is_active: true,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('teams.createTeam')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('teams.form.name')}</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={t('teams.form.namePlaceholder')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_id">{t('teams.form.organization')}</Label>
            <Select onValueChange={(value) => setValue('organization_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('teams.form.selectOrganization')} />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.organization_id && (
              <p className="text-sm text-destructive">{errors.organization_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('teams.form.description')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('teams.form.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common:buttons.cancel')}
            </Button>
            <Button type="submit" disabled={createTeam.isPending}>
              {createTeam.isPending ? t('common:buttons.creating') : t('common:buttons.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};