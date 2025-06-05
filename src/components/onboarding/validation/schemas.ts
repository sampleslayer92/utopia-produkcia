
import { z } from 'zod';

// Contact Info validation schema
export const contactInfoSchema = z.object({
  salutation: z.enum(['Pan', 'Pani', '']).optional(),
  firstName: z.string().min(1, 'Meno je povinné'),
  lastName: z.string().min(1, 'Priezvisko je povinné'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(1, 'Telefón je povinný'),
  phonePrefix: z.string().min(1, 'Predvoľba je povinná'),
  companyType: z.enum(['Živnosť', 'S.r.o.', 'Nezisková organizácia', 'Akciová spoločnosť', '']).optional(),
  salesNote: z.string().optional()
});

// Company Info validation schema
export const companyInfoSchema = z.object({
  ico: z.string().min(1, 'IČO je povinné'),
  dic: z.string().min(1, 'DIČ je povinné'),
  companyName: z.string().min(1, 'Obchodné meno je povinné'),
  registryType: z.enum(['public', 'business', 'other']),
  isVatPayer: z.boolean(),
  vatNumber: z.string().optional(),
  court: z.string().optional(),
  section: z.string().optional(),
  insertNumber: z.string().optional(),
  address: z.object({
    street: z.string().min(1, 'Ulica je povinná'),
    city: z.string().min(1, 'Mesto je povinné'),
    zipCode: z.string().min(1, 'PSČ je povinné')
  }),
  contactAddress: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string()
  }).optional(),
  contactAddressSameAsMain: z.boolean(),
  contactPerson: z.object({
    firstName: z.string().min(1, 'Meno je povinné'),
    lastName: z.string().min(1, 'Priezvisko je povinné'),
    email: z.string().email('Neplatný email'),
    phone: z.string().min(1, 'Telefón je povinný'),
    isTechnicalPerson: z.boolean()
  })
});

// Address validation schema (reusable)
export const addressSchema = z.object({
  street: z.string().min(1, 'Ulica je povinná'),
  city: z.string().min(1, 'Mesto je povinné'),
  zipCode: z.string().min(1, 'PSČ je povinné')
});

// Contact person validation schema (reusable)
export const contactPersonSchema = z.object({
  firstName: z.string().min(1, 'Meno je povinné'),
  lastName: z.string().min(1, 'Priezvisko je povinné'),
  email: z.string().email('Neplatný email'),
  phone: z.string().min(1, 'Telefón je povinný')
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactPersonFormData = z.infer<typeof contactPersonSchema>;
