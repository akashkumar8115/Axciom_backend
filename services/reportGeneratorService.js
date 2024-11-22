const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');

class ReportGeneratorService {
    async generatePDFReport(data, type) {
        const doc = new PDFDocument();
        const filename = `report_${type}_${Date.now()}.pdf`;
        const stream = fs.createWriteStream(`./reports/${filename}`);

        doc.pipe(stream);
        this.addReportHeader(doc, type);
        this.addReportContent(doc, data);
        doc.end();

        return filename;
    }

    async generateExcelReport(data, type) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(type);

        worksheet.columns = this.getColumnsForType(type);
        worksheet.addRows(data);

        const filename = `report_${type}_${Date.now()}.xlsx`;
        await workbook.xlsx.writeFile(`./reports/${filename}`);
        return filename;
    }

    getColumnsForType(type) {
        const columnTypes = {
            inventory: [
                { header: 'Title', key: 'title' },
                { header: 'Quantity', key: 'quantity' },
                { header: 'Available', key: 'available' }
            ],
            transactions: [
                { header: 'Date', key: 'date' },
                { header: 'Book', key: 'book' },
                { header: 'User', key: 'user' }
            ]
        };
        return columnTypes[type] || [];
    }
}
