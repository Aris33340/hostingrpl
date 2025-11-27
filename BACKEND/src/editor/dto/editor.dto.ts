// dto/editor.dto.ts

import { userRole } from "@prisma/client";


export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface userDetail{
  id :number;
  role: userRole;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: RGBColor;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type ElementType = 'text' | 'image' | 'field' | 'qr';

export interface ElementProperty {
  id: string;
  type: ElementType;
  content?: string;      // teks custom
  fieldName?: string;    // nama field mahasiswa (misal: 'nama', 'nim')
  fileId?: string;       // untuk image
  position: Position;
  size: Size;
  textstyle?: TextStyle;
  opacity?: number;
  rotation: number;
}



export interface EditablePage {
  pageNumber: number;
  elements: ElementProperty[];
}

export interface RenderOption {
  saveToDb: boolean;
  insertMode?: boolean; // true = insert for each student, false = render only editable pages
}

export default interface PdfEditRequestDto {
  userDetail: userDetail;
  configuration:{
      pdfId:number,
      pdfFileName: string;
      renderOption: RenderOption;
      editOption: 'iterateInside' | 'iterateOutside';
  } 
  editablePages: EditablePage[];
}
