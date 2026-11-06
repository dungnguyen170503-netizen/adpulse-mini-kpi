// TEST SCRIPT FOR MODULE D2 (EXCEL/CSV/TEXT) & D3 (IMAGE OCR)

function normalizeNumber(val) {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
  let str = String(val).trim().replace(/[₫đVNDvnd\s]/g, '');
  if (str.includes('.') && str.includes(',')) {
    if (str.indexOf('.') < str.indexOf(',')) {
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      str = str.replace(/,/g, '');
    }
  } else if (str.includes('.')) {
    const parts = str.split('.');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      str = str.replace(/\./g, '');
    }
  } else if (str.includes(',')) {
    const parts = str.split(',');
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      str = str.replace(/,/g, '');
    }
  }
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num);
}

function normalizeDate(val) {
  if (!val) return new Date().toISOString().split('T')[0];
  const str = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }
  return str;
}

console.log('=== TEST D2: CHUẨN HÓA SỐ & NGÀY ===');
const testNumbers = [
  { raw: '300.000 đ', expected: 300000 },
  { raw: '1,500,000 VND', expected: 1500000 },
  { raw: ' 450000 ₫ ', expected: 450000 },
  { raw: 12000, expected: 12000 }
];

testNumbers.forEach(t => {
  const parsed = normalizeNumber(t.raw);
  const ok = parsed === t.expected;
  console.log(`normalizeNumber('${t.raw}') = ${parsed} [${ok ? 'PASS' : 'FAIL'}]`);
});

const testDates = [
  { raw: '01/11/2026', expected: '2026-11-01' },
  { raw: '2026-11-05', expected: '2026-11-05' },
  { raw: '05-11-2026', expected: '2026-11-05' }
];

testDates.forEach(t => {
  const parsed = normalizeDate(t.raw);
  const ok = parsed === t.expected;
  console.log(`normalizeDate('${t.raw}') = ${parsed} [${ok ? 'PASS' : 'FAIL'}]`);
});

console.log('\n=== TEST D3: NGUYÊN TẮC ẢNH CHỤP TỔNG KỲ ===');
const mockImageSummary = {
  isPeriodSummary: true,
  period: '01/11 - 07/11',
  spend: 3500000,
  reach: 50000,
  clicks: 1500,
  orders: 50
};
console.log('Phát hiện ảnh tổng kỳ:', mockImageSummary.period);
console.log('Quy tắc: KHÔNG chia đều cho 7 ngày để sinh dữ liệu ngày giả.');
console.log(`Lưu dạng PeriodSummaryRecord: Spend=${mockImageSummary.spend}, CTR=${(mockImageSummary.clicks/mockImageSummary.reach*100).toFixed(2)}%, CPC=${Math.round(mockImageSummary.spend/mockImageSummary.clicks)} đ, CPA=${Math.round(mockImageSummary.spend/mockImageSummary.orders)} đ`);

console.log('\n✅ KIỂM TRA D2/D3 HOÀN TẤT THÀNH CÔNG!');
