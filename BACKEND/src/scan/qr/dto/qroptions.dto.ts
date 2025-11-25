// dto/editor.dto.ts
export enum DotsType {
    Rounded = "rounded",
    Dots = "dots",
    Classy = "classy",
    ClassyRounded = "classy-rounded",
    Square = "square",
    ExtraRounded = "extra-rounded"
}

export enum CornerSquareType {
    Dot = "dot",
    Square = "square",
    ExtraRounded = "extra-rounded"
}

export enum CornerDotType {
    Dot = "dot",
    Square = "square"
}

export default interface QRDTO {
    fileName: string;
    folderName: string;
    width: number;
    height: number;

    /** Data / link yang akan di-encode */
    data: string;

    /** Gambar logo di tengah (opsional) */
    image?: string;

    /** Opsi tampilan titik-titik QR */
    dotsOptions: {
        color: string;
        type: DotsType;
    };

    /** Opsi warna background */
    backgroundOptions: {
        color: string;
    };

    /** Opsi gambar/logo */
    imageOptions: {
        crossOrigin: string;
        margin: number;
    };

    /** Opsi corner (pojok) QR Code */
    cornersSquareOptions?: {
        color?: string;
        type?: CornerSquareType;
    };

    cornersDotOptions?: {
        color?: string;
        type?: CornerDotType;
    };
}

