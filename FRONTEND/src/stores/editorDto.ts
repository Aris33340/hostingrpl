export interface RGBColor {
    r: number;
    g: number;
    b: number;
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
  
  export type ElementType = 'text' | 'image' | 'field';
  
  export interface EditorElement {
    id: string;
    type: ElementType;
    content?: string;      // teks custom
    fieldName?: string;    // nama field mahasiswa (misal: 'nama', 'nim')
    fileId?: string;       // untuk image
    position: Position;
    size: Size;
    style?: TextStyle;
    opacity?: number;
  }
  
  export interface EditablePage {
    pageNumber: number;
    elements: EditorElement[];
  }
  
  export interface RenderOption {
    saveToDb: boolean;
    insertMode?: boolean; // true = insert for each student, false = render only editable pages
  }
  
  export default interface PdfEditRequestDto {
    pdfId: string;
    pdfFileName: string;
    editOption: 'renderonlyeditablepages' | 'renderinsidepage';
    editablePages: EditablePage[];
    renderOption: RenderOption;
  }