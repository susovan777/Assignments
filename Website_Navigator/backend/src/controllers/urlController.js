import * as XLSX from 'xlsx';
import UrlSet from '../models/UrlSet.js';

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({
        message: 'No file uploaded',
      });

    // Parse workbook from buffer (works for .xlsx and .csv)
    const workbook = XLSX.read(req.file.buffer, { type: buffer });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Extract anything that looks like a URL from any cell
    const urls = rows
      .flat()
      .filter(
        (cell) => typeof cell === 'string' && /^https?:\/\//i.test(cell.trim())
      );

    if (urls.length === 0)
      return res
        .status(422)
        .json({ message: 'No valid URLs found in the file' });

    // Save to Database
    const saved = await UrlSet.create({
      fileName: req.file.originalName,
      urls,
    });

    res.status(201).json({ succes: true, id: saved._id, urls });
  } catch (error) {
    next(error);
  }
};
