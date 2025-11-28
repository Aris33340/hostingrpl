export interface userDetail {
    id: number;
    role: string;
}

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

export type ElementType = 'text' | 'image' | 'field' | 'qr';

export interface ElementProperty {
    id: number;
    type: ElementType;
    content?: string;
    fieldName?: string | null;
    fileId?: number | null;
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
    insertMode?: boolean;
}

export interface PdfEditRequestDto {
    userDetail: userDetail;
    configuration: {
        pdfId: number,
        pdfFileName: string;
        renderOption: RenderOption;
        editOption: 'iterateInside' | 'iterateOutside';
    }
    editablePages: EditablePage[];
}
