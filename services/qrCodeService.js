const QRCode = require('qrcode');
const path = require('path');

class QRCodeService {
    async generateBookQR(bookId) {
        const qrData = {
            type: 'book',
            id: bookId,
            timestamp: Date.now()
        };

        const qrString = JSON.stringify(qrData);
        const filename = `qr_${bookId}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../public/qrcodes', filename);

        await QRCode.toFile(filePath, qrString, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        return filename;
    }

    async generateMembershipQR(userId) {
        const qrData = {
            type: 'membership',
            id: userId,
            timestamp: Date.now()
        };

        const qrString = JSON.stringify(qrData);
        const filename = `membership_${userId}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../public/qrcodes', filename);

        await QRCode.toFile(filePath, qrString, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        return filename;
    }
}
