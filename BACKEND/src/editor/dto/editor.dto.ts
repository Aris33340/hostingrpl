import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  SEKRETARIAT = 'SEKRETARIAT',
  BUKUWISUDA = 'BUKUWISUDA',
  PETUGAS = 'PETUGAS',
}

export enum ElementType {
  TEXT = 'text',
  IMAGE = 'image',
  FIELD = 'field', // Data dinamis dari DB
  QR = 'qr',       // QR Code
}

export class RGBColor {
  @IsNumber() r: number;
  @IsNumber() g: number;
  @IsNumber() b: number;
}

export class TextStyle {
  @IsNumber() fontSize: number;
  @IsString() fontFamily: string; // 'TimesRoman', 'Helvetica', etc.
  @IsOptional() @IsBoolean() bold?: boolean;
  @IsOptional() @IsBoolean() italic?: boolean;
  @IsOptional() @ValidateNested() @Type(() => RGBColor) color?: RGBColor;
}

export class Position {
  @IsNumber() x: number;
  @IsNumber() y: number;
}

export class Size {
  @IsNumber() width: number;
  @IsNumber() height: number;
}

export class ElementProperty {
  @IsString() id: string;
  @IsEnum(ElementType) type: ElementType;
  
  @IsOptional() @IsString() fieldName?: string; // key untuk mapping DB: 'mahasiswa.nama', 'tamu.instansi'
  @IsOptional() @IsString() content?: string;   // Teks statis
  @IsOptional() @IsNumber() fileId?: number;    // ID File untuk static image (Logo)
  
  @ValidateNested() @Type(() => Position) position: Position;
  @ValidateNested() @Type(() => Size) size: Size;
  @IsOptional() @ValidateNested() @Type(() => TextStyle) textstyle?: TextStyle;
  
  @IsOptional() @IsNumber() opacity?: number;
  @IsOptional() @IsNumber() rotation?: number;
}

export class EditablePage {
  @IsNumber() pageNumber: number; // Halaman ke-berapa di PDF Template asli (1-based)
  @ValidateNested({ each: true }) @Type(() => ElementProperty) elements: ElementProperty[];
  @IsOptional() @IsBoolean() isIterative?: boolean; // True jika halaman ini dicetak ulang per siswa
}

export class RenderOption {
  @IsBoolean() saveToDb: boolean;
  @IsOptional() @IsBoolean() asZip?: boolean; // Opsi baru: Bungkus hasil 'outside' jadi ZIP?
}

export class Configuration {
  @IsNumber() pdfId: number; // ID File Template di DB
  @IsString() pdfFileName: string; // Nama output
  @IsString() projectName: string;
  @IsEnum(['mahasiswa', 'tamu']) tableReference: 'mahasiswa' | 'tamu';
  
  @ValidateNested() @Type(() => RenderOption) renderOption: RenderOption;
  @IsEnum(['iterateInside', 'iterateOutside']) editOption: 'iterateInside' | 'iterateOutside';
}

export default class PdfEditRequestDto {
  @IsNumber() userId: number; // Dikirim dari Controller (dari JWT/Session)
  @ValidateNested() @Type(() => Configuration) configuration: Configuration;
  @IsArray() @ValidateNested({ each: true }) @Type(() => EditablePage) editablePages: EditablePage[];
}