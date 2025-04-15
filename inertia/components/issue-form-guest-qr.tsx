import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import jsPDF from "jspdf";

// const loginLink = "/issue-form-guest-qr/login/token";
const loginLink = route("welcome");

const IssueFormQR = () => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCodeAsPDF = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const qrSize = 120; // Size of the QR code in the PDF
      const margin = 20;

      // Add header with title
      pdf.setFontSize(24);
      pdf.setTextColor("#333333");
      pdf.setFont("helvetica", "bold");
      const maxTextWidth = pageWidth - 40; // Keep margins
      const titleText =
        "Do you want to fix something in the business? Scan here";
      const wrappedText = pdf.splitTextToSize(titleText, maxTextWidth);

      // Draw the text centered
      pdf.text(wrappedText, pageWidth / 2, margin, { align: "center" });

      // Draw a border around the QR code
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = (pageHeight - qrSize) / 2;
      pdf.setDrawColor("#cccccc");
      pdf.setLineWidth(0.5);
      pdf.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

      // Add QR Code to the PDF
      pdf.addImage(pngFile, "PNG", qrX, qrY, qrSize, qrSize);

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor("#999999");
      pdf.text(
        "This QR code is valid for guest users. Contact admin for more details.",
        pageWidth / 2,
        pageHeight - margin,
        { align: "center" },
      );

      // Save the PDF
      pdf.save("qr-code.pdf");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>QR</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] sm:max-h-[500px] justify-center">
        <DialogTitle className="wrap-text">
          Share with guest users to <br />
          submit issue form.
        </DialogTitle>
        <div className="items-center" ref={qrRef}>
          <QRCodeSVG value={loginLink} size={256} />
        </div>
        <Button onClick={downloadQRCodeAsPDF} className="mt-4">
          Download QR Code as PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormQR;
