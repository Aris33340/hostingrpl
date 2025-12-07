import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export const UserRole = {
  SUPERADMIN: 'SUPERADMIN',
  SEKRETARIAT: 'SEKRETARIAT',
  BUKUWISUDA: 'BUKUWISUDA',
  PETUGAS: 'PETUGAS',
} as const;
export type UserRoleKeys = (typeof UserRole)[keyof typeof UserRole];

export const ElementType = {
  TEXT: 'text',
  IMAGE: 'image',
  FIELD: 'field', 
  QR: 'qr',      
} as const;
export type ElementTypeKeys = (typeof ElementType)[keyof typeof ElementType]; 


export class RGBColor {
  @IsNumber() r!: number;
  @IsNumber() g!: number;
  @IsNumber() b!: number;
}

export class TextStyle {
  @IsNumber() fontSize!: number;
  @IsString() fontFamily!: string;
  @IsOptional() @IsBoolean() bold?: boolean;
  @IsOptional() @IsBoolean() italic?: boolean;
  @IsOptional() @ValidateNested() @Type(() => RGBColor) color?: RGBColor;
}

export class Position {
  @IsNumber() x!: number;
  @IsNumber() y!: number;
}

export class Size {
  @IsNumber() width!: number;
  @IsNumber() height!: number;
}

export class ElementProperty {
  @IsString() id!: string;
  @IsEnum(ElementType) type!: ElementTypeKeys; 
  
  @IsOptional() @IsString() fieldName?: string;
  @IsOptional() @IsString() content?: string; 
  @IsOptional() @IsString() fileId?: string; 
  
  @ValidateNested() @Type(() => Position) position!: Position;
  @ValidateNested() @Type(() => Size) size!: Size;
  @IsOptional() @ValidateNested() @Type(() => TextStyle) textstyle?: TextStyle;
  
  @IsOptional() @IsNumber() opacity?: number;
  @IsOptional() @IsNumber() rotation?: number;
}

export class EditablePage {
  @IsNumber() pageNumber!: number; 
  @ValidateNested({ each: true }) @Type(() => ElementProperty) elements!: ElementProperty[];
  @IsOptional() @IsBoolean() isIterative?: boolean; 
}

export class RenderOption {
  @IsBoolean() saveToDb!: boolean;
  @IsOptional() @IsBoolean() asZip?: boolean; 
}

export class Configuration {
  @IsNumber() pdfId!: number; 
  @IsString() pdfFileName!: string; 
  @IsString() projectName!: string;
  @IsEnum(['mahasiswa', 'tamu']) tableReference!: 'mahasiswa' | 'tamu';
  
  @ValidateNested() @Type(() => RenderOption) renderOption!: RenderOption;
  @IsEnum(['iterateInside', 'iterateOutside']) editOption!: 'iterateInside' | 'iterateOutside';
}

export default class PdfEditRequestDto {
  @IsNumber() userId!: number; 
  @IsEnum(UserRole) userRole!: UserRoleKeys;
  @ValidateNested() @Type(() => Configuration) configuration!: Configuration;
  @IsArray() @ValidateNested({ each: true }) @Type(() => EditablePage) editablePages!: EditablePage[];
}