import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export const createDocument = async (pokemon) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([500, 750]);
    const form = pdfDoc.getForm();
    // const { width, height } = page.getSize();
    // const fontSize = 30;

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Your pokedex', {
        x: 50,
        y: 700,
        size: 20,
        font: helveticaFont,
        color: rgb(0, 0.53, 0.71),
    });

    const nameField = form.createTextField('name');
    nameField.setText(pokemon.name);
    nameField.addToPage(page, {
        x: 50,
        y: 650,
    });

    // page.drawText(`Height: ${pokemon.height}`, {
    //     x: 50,
    //     y: height - 5 * fontSize,
    //     size: fontSize,
    //     font: helveticaFont,
    //     color: rgb(0, 0.53, 0.71),
    // });

    // page.drawText(`Weight: ${pokemon.weight}`, {
    //     x: 50,
    //     y: height - 6 * fontSize,
    //     size: fontSize,
    //     font: helveticaFont,
    //     color: rgb(0, 0.53, 0.71),
    // });

    const pdfBytes = await pdfDoc.save();

    await writeFile('./pdf/created.pdf', pdfBytes);
    return {
        path: './pdf/created.pdf',
        pdfBytes,
    };
};

export const createPdf = async (input, output) => {
    try {
        const pdfDoc = await PDFDocument.load(await readFile(input));

        // modify doc
        const fields = pdfDoc.getForm().getFields();
        const firstFieldName = fields[0].getName();
        const firstField = pdfDoc.getForm().getTextField(firstFieldName);
        firstField.setText('Hello World');
        console.log(firstFieldName);
        const pdfBytes = await pdfDoc.save();
        await writeFile(output, pdfBytes);
        console.log('PDF created successfully');
    } catch (error) {
        console.log(error);
    }
};

// createPdf('./pdf/example.pdf', './pdf/example-modified.pdf');
