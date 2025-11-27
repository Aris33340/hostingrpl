// dto/editor.dto.ts
import {
    TypeNumber,
    Mode,
    ErrorCorrectionLevel,
    DotType,
    CornerDotType,
    CornerSquareType,
    Gradient
} from "qr-code-styling";

export default interface QRDTO {
    /** Nama file untuk disimpan di server */
    fileName: string;
    /** Folder tujuan penyimpanan */
    folderName: string;

    /** Opsi bawaan qr-code-styling */
    type?: "canvas" | "svg";
    shape?: "square" | "circle";

    width?: number;
    height?: number;
    margin?: number; // margin putih luar (opsional)
    data?: string; // data yang diencode
    image?: string;

    nodeCanvas?: any;
    jsdom?: any;

    /** QR-related options */
    qrOptions?: {
        typeNumber?: TypeNumber;
        mode?: Mode;
        errorCorrectionLevel?: ErrorCorrectionLevel; // "L" | "M" | "Q" | "H"
    };

    /** Styling untuk gambar/logo */
    imageOptions?: {
        saveAsBlob?: boolean;
        hideBackgroundDots?: boolean;
        imageSize?: number;
        crossOrigin?: string;
        margin?: number;
    };

    /** Styling titik QR */
    dotsOptions?: {
        type?: DotType;
        color?: string;
        gradient?: Gradient;
        roundSize?: boolean;
    };

    /** Styling pojok QR */
    cornersSquareOptions?: {
        type?: CornerSquareType;
        color?: string;
        gradient?: Gradient;
    };

    cornersDotOptions?: {
        type?: CornerDotType;
        color?: string;
        gradient?: Gradient;
    };

    /** Styling background */
    backgroundOptions?: {
        round?: number;
        color?: string;
        gradient?: Gradient;
    };
}
