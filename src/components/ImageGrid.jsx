export default function ImageGrid({ attachments, onImageClick }) {
    const commonClass = "w-full h-full object-cover cursor-pointer rounded-md";

    if (!attachments || attachments.length === 0) return null;

    if (attachments.length === 1) {
        return (
            <div className="grid aspect-video rounded-md overflow-hidden">
                <img
                    src={attachments[0]}
                    className={commonClass}
                    onClick={() => onImageClick(0, attachments)}
                    alt="Attachment"
                />
            </div>
        );
    }

    if (attachments.length === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 rounded-md overflow-hidden">
                {attachments.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        className={commonClass}
                        onClick={() => onImageClick(i, attachments)}
                        alt={`Attachment ${i + 1}`}
                    />
                ))}
            </div>
        );
    }

    if (attachments.length === 3) {
        return (
            <div className="grid grid-cols-3 grid-rows-2 gap-1 rounded-md overflow-hidden">
                <img
                    src={attachments[0]}
                    className={`${commonClass} col-span-2 row-span-2`}
                    onClick={() => onImageClick(0, attachments)}
                    alt="Attachment 1"
                />
                <img
                    src={attachments[1]}
                    className={commonClass}
                    onClick={() => onImageClick(1, attachments)}
                    alt="Attachment 2"
                />
                <img
                    src={attachments[2]}
                    className={commonClass}
                    onClick={() => onImageClick(2, attachments)}
                    alt="Attachment 3"
                />
            </div>
        );
    }

    if (attachments.length === 4) {
        return (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 rounded-md overflow-hidden">
                {attachments.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        className={commonClass}
                        onClick={() => onImageClick(i, attachments)}
                        alt={`Attachment ${i + 1}`}
                    />
                ))}
            </div>
        );
    }

    return null;
}
