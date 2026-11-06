/**
 * PDF REPORT EXPORT ENGINE - MODULE R2
 * Generates Executive PDF Reports directly from CampaignReportSnapshot (SSOT)
 */

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CampaignReportSnapshot } from '../types/campaign';

/**
 * Tải file PDF trực tiếp từ phần tử HTML báo cáo (High-Fidelity Canvas + jsPDF)
 * Đảm bảo 100% hiển thị tiếng Việt có dấu sắc nét, không bị vỡ font hay mất ký tự.
 */
export async function downloadPdfFromElement(
  element: HTMLElement,
  fileName: string = 'Bao-Cao-KPI-Facebook-Ads.pdf',
  onProgress?: (percent: number) => void
): Promise<void> {
  if (!element) {
    throw new Error('Không tìm thấy phần tử báo cáo để xuất PDF');
  }

  onProgress?.(20);

  // Chụp ảnh canvas với độ phân giải cao (scale 2x)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  onProgress?.(60);

  const imgData = canvas.toDataURL('image/png');

  // Khởi tạo file PDF khổ A4 tiêu chuẩn (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Thêm trang đầu tiên
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Nếu nội dung dài hơn 1 trang A4, tự động ngắt trang
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  onProgress?.(90);

  // Tải file PDF về máy tính người dùng
  pdf.save(fileName);

  onProgress?.(100);
}

/**
 * Mở hộp thoại in ấn / lưu PDF trực tiếp của trình duyệt (Native Browser Print)
 */
export function printReportDirectly(): void {
  window.print();
}
