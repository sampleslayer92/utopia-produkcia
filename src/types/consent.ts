
export interface Consents {
  gdpr: boolean;
  terms: boolean;
  electronicCommunication: boolean;
  signatureDate?: string;
  signingPersonId?: string;
  signatureUrl?: string;
}
