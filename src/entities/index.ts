/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: ordensdeservico
 * Interface for OrdensdeServio
 */
export interface OrdensdeServio {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  orderNumber?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType date */
  scheduledDate?: Date | string;
  /** @wixFieldType text */
  clientName?: string;
  /** @wixFieldType text */
  priority?: string;
  /** @wixFieldType text */
  notes?: string;
  /** @wixFieldType text */
  technicianName?: string;
  /** @wixFieldType text */
  team?: string;
}


/**
 * Collection ID: usuariosdosistema
 * Interface for UsuriosdoSistema
 */
export interface UsuriosdoSistema {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  passwordHash?: string;
  /** @wixFieldType text */
  accessLevel?: string;
  /** @wixFieldType boolean */
  isActive?: boolean;
  /** @wixFieldType text */
  phoneNumber?: string;
}
