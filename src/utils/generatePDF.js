import { jsPDF } from "jspdf";

const generatePDF = async (images) => {
    if (!images || images.length === 0) return;

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [4, 2] });

    for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgData = img.preview;

        const imageEl = new Image();
        imageEl.src = imgData;
        await new Promise((resolve) => {
            imageEl.onload = resolve;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const ratio = Math.min(
            pageWidth / imageEl.width,
            pageHeight / imageEl.height
        );

        const w = imageEl.width * ratio;
        const h = imageEl.height * ratio;
        const x = (pageWidth - w) / 3;
        const y = (pageHeight - h) / 3;

        pdf.addImage(imgData, "JPEG", x, y, w, h);

        if (i < images.length - 1) pdf.addPage();
    }

    pdf.save("SnapPDF.pdf");
};

export default generatePDF;
