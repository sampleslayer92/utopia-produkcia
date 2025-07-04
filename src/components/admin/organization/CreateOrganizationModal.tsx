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
import { useCreateOrganization } from '@/hooks/useOrganizations';

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  color: z.string().min(1, 'Color is required'),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface CreateOrganizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateOrganizationModal = ({ open, onOpenChange }: CreateOrganizationModalProps) => {
  const { t } = useTranslation('admin');
  const createOrganization = useCreateOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      color: '#3B82F6',
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      await createOrganization.mutateAsync({
        name: data.name,
        description: data.description,
        color: data.color,
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
          <DialogTitle>{t('organizations.createOrganization')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('organizations.form.name')}</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={t('organizations.form.namePlaceholder')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('organizations.form.description')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('organizations.form.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">{t('organizations.form.color')}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                {...register('color')}
                className="w-16 h-10"
              />
              <Input
                {...register('color')}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common:buttons.cancel')}
            </Button>
            <Button type="submit" disabled={createOrganization.isPending}>
              {createOrganization.isPending ? t('common:buttons.creating') : t('common:buttons.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};