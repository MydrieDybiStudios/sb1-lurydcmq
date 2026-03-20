import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateOlympiadDiploma(
  userName: string,
  olympiadTitle: string,
  place: number | null,
  percentage: number,
  totalScore: number,
  maxScore: number,
  diplomaText?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 portrait
  const { width, height } = page.getSize();

  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Рамка
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.8, 0.6, 0),
    borderWidth: 3,
  });

  // Заголовок
  page.drawText('ДИПЛОМ', {
    x: 50,
    y: height - 100,
    size: 48,
    font: helveticaBold,
    color: rgb(0.8, 0.6, 0),
  });

  page.drawText('Награждается', {
    x: 50,
    y: height - 180,
    size: 16,
    font: helvetica,
  });

  page.drawText(userName, {
    x: 50,
    y: height - 220,
    size: 28,
    font: helveticaBold,
  });

  let placeText = '';
  if (place === 1) placeText = 'I место';
  else if (place === 2) placeText = 'II место';
  else if (place === 3) placeText = 'III место';
  else placeText = 'участие';

  page.drawText(`за ${placeText}`, {
    x: 50,
    y: height - 260,
    size: 20,
    font: helveticaBold,
    color: rgb(0.8, 0.6, 0),
  });

  page.drawText(`в олимпиаде «${olympiadTitle}»`, {
    x: 50,
    y: height - 300,
    size: 16,
    font: helvetica,
  });

  page.drawText(`Результат: ${percentage}% (${totalScore} из ${maxScore} баллов)`, {
    x: 50,
    y: height - 340,
    size: 14,
    font: helvetica,
  });

  if (diplomaText) {
    page.drawText(diplomaText, {
      x: 50,
      y: height - 380,
      size: 12,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const today = new Date().toLocaleDateString('ru-RU');
  page.drawText(`Дата выдачи: ${today}`, {
    x: 50,
    y: 100,
    size: 12,
    font: helvetica,
  });

  page.drawText('Организационный комитет', {
    x: width - 200,
    y: 100,
    size: 12,
    font: helvetica,
  });

  return await pdfDoc.save();
}
