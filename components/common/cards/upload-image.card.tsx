import Image, {StaticImageData} from "next/image";

type property = {
    preview: string;
    alt: string;
    base: StaticImageData;
};

function UploadImageCard({ preview, base, alt }: property) {
    return (
        <Image
            src={preview ? preview : base}
            alt={alt}
            width="100"
            height="50"
            style={{ width: "150px", height: "150px" }}
        />
    );
}

export default UploadImageCard;

export function UploadImage({ preview, base, alt }: property) {
    return (
        <Image
            src={preview ? preview : base}
            alt={alt}
            width="100"
            height="50"
            style={{ width: "150px", height: "150px" }}
        />
    );
}
