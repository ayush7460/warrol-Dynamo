import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { format } from 'date-fns';

export const generateTicket = async (booking) => {
  try {
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Generate QR code
    const qrData = {
      bookingCode: booking.bookingCode,
      scheduleId: booking.scheduleId,
      seats: booking.seats.map(s => s.seatNumber)
    };
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));

    // Add content to PDF
    doc
      .fontSize(20)
      .text('Bus Ticket', { align: 'center' })
      .moveDown();

    doc
      .fontSize(12)
      .text(`Booking Code: ${booking.bookingCode}`)
      .text(`Booking Date: ${format(booking.createdAt, 'dd/MM/yyyy HH:mm')}`)
      .moveDown();

    // Add passenger details
    doc
      .fontSize(14)
      .text('Passenger Details', { underline: true })
      .moveDown();

    booking.seats.forEach(seat => {
      doc
        .fontSize(12)
        .text(`Seat ${seat.seatNumber}: ${seat.passengerName}`)
        .text(`Age: ${seat.age} | Gender: ${seat.gender}`)
        .moveDown();
    });

    // Add QR code
    doc.image(qrCodeImage, {
      fit: [100, 100],
      align: 'center'
    });

    // Generate buffer
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      
      doc.on('error', reject);
      doc.end();
    });
  } catch (error) {
    console.error('Ticket generation error:', error);
    throw error;
  }
};