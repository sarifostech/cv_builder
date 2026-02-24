import PDFDocument from 'pdfkit';

export async function generatePdf(cv: any, mode: 'ats' | 'visual' | 'both'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    const pi = cv.content?.personalInfo || {};

    const addHeader = (text: string, size: number = 20, color: string = '#000') => {
      doc.fontSize(size).font('Helvetica-Bold').text(text, { align: 'center' }).moveDown();
      doc.font('Helvetica').fillColor(color);
    };

    const renderATS = () => {
      // Header block
      doc.fontSize(14).font('Helvetica-Bold').text(pi.fullName || 'Name').moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(`${pi.email || ''} | ${pi.phone || ''}${pi.location ? ' | ' + pi.location : ''}`).moveDown();

      // Summary
      if (cv.content?.summary?.text) {
        doc.fontSize(12).font('Helvetica-Bold').text('Summary').moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(cv.content.summary.text).moveDown();
      }

      // Experience
      if (cv.content?.experience?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Experience').moveDown(0.5);
        cv.content.experience.forEach((exp: any) => {
          doc.fontSize(11).font('Helvetica-Bold').text(`${exp.title} at ${exp.company}`);
          doc.fontSize(9).font('Helvetica').text(`${exp.startDate} - ${exp.endDate || 'Present'}`);
          if (exp.description) doc.fontSize(10).font('Helvetica').text(exp.description);
          doc.moveDown();
        });
      }

      // Education
      if (cv.content?.education?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Education').moveDown(0.5);
        cv.content.education.forEach((edu: any) => {
          doc.fontSize(11).font('Helvetica-Bold').text(`${edu.degree} at ${edu.institution}`);
          doc.fontSize(9).font('Helvetica').text(`${edu.startDate} - ${edu.endDate || 'Present'}`);
          if (edu.description) doc.fontSize(10).font('Helvetica').text(edu.description);
          doc.moveDown();
        });
      }

      // Skills
      if (cv.content?.skills?.items?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Skills').moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(cv.content.skills.items.join(', ')).moveDown();
      }

      // Projects
      if (cv.content?.projects?.length) {
        doc.fontSize(12).font('Helvetica-Bold').text('Projects').moveDown(0.5);
        cv.content.projects.forEach((proj: any) => {
          doc.fontSize(11).font('Helvetica-Bold').text(proj.name);
          if (proj.link) doc.fontSize(9).font('Helvetica').text(proj.link);
          if (proj.description) doc.fontSize(10).font('Helvetica').text(proj.description);
          doc.moveDown();
        });
      }
    };

    const renderVisual = () => {
      addHeader(pi.fullName || 'Name', 24, '#2563eb');
      doc.fontSize(11).fillColor('#555').text(`${pi.email || ''} | ${pi.phone || ''}${pi.location ? ' | ' + pi.location : ''}`, { align: 'center' }).moveDown();

      const sections = [
        { title: 'Summary', content: cv.content?.summary?.text ? [cv.content.summary.text] : [] },
        { title: 'Experience', content: cv.content?.experience?.map((exp: any) => `${exp.title} at ${exp.company}\n${exp.startDate} - ${exp.endDate || 'Present'}\n${exp.description}`) || [] },
        { title: 'Education', content: cv.content?.education?.map((edu: any) => `${edu.degree} at ${edu.institution}\n${edu.startDate} - ${edu.endDate || 'Present'}\n${edu.description || ''}`) || [] },
        { title: 'Skills', content: [cv.content?.skills?.items?.join(', ') || ''] },
        { title: 'Projects', content: cv.content?.projects?.map((proj: any) => `${proj.name}\n${proj.link || ''}\n${proj.description}`) || [] },
      ];

      sections.forEach(sec => {
        if (!sec.content || sec.content.every((c: string) => !c || c.trim() === '')) return;
        doc.fillColor('#2563eb').fontSize(16).font('Helvetica-Bold').text(sec.title).moveDown(0.5);
        doc.fillColor('#000');
        sec.content.forEach((c: string) => {
          if (c) doc.fontSize(11).font('Helvetica').text(c.trim());
        });
        doc.moveDown();
      });
    };

    try {
      if (mode === 'ats') {
        renderATS();
      } else if (mode === 'visual') {
        renderVisual();
      } else if (mode === 'both') {
        renderATS();
        doc.addPage();
        renderVisual();
      }
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
