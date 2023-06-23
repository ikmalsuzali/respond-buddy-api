// 1. User add spreadsheet as a source in UI
// 2. Will connect to make.com to create a new trigger API (need to research on make.com gt API for creation or not)
// 3. Pull spreadsheet data & store to redis and supabase
// 4. Once make.com receive trigger (update/delete) from spreadsheet
//    -> delete: remove data in redis & supabase via sheetID
//    -> update: update data to redis & supabase

// What I can do to archieve:
// x 1. Integrate spreadsheet and get the data 
// x 2. Create an API for read data from spreadsheet and store to redis & supabase
// 3. Research on make.com API for add source from UI in respond buddy
//    -> If make.com unable to add source through API, will need to find Ikmal on how his UI work, is it will link to make.com UI for user to do setting
// 4. After integromat platform make.com integrate, may need to think of how to update data in redis & supabase & s3

import { GoogleService } from "./GoogleService";

const { google } = require("googleapis")
const ExcelJS = require('exceljs');
const tmp = require('tmp');

interface SheetData {
  sheetTitle: string,
  data: any[]
}

export class GoogleSheetService extends GoogleService {
  private _spreadsheetId: string
  private _googleSheet?: any
  private _tempFile?: any
  private _tempFilePath?: string
  protected metadata?: any

  constructor({spreadsheetId, scopes, keyFile} : {
    spreadsheetId: string,
    scopes: string,
    keyFile?: string
  }) {
    super({scopes, keyFile})
    this._spreadsheetId = spreadsheetId
    this._googleSheet = google.sheets({version: "v4", auth: this.client})
  }

  async init() {
    await this.loadCredential()

    if (!this._googleSheet) throw new Error('Unable to connect Google Sheet API')

    this.metadata = await this._googleSheet.spreadsheets.get({
      auth: this.auth,
      spreadsheetId: this._spreadsheetId,
      includeGridData: true,
    })
  }

  async getAllSheetData(sheetName?: string[]) {
    const allSheetData: SheetData[] = []

    // If user didnt specify which sheet name need to be read, read all
    for (const sheet of sheetName || this.metadata?.data?.sheets || []) {
      const sheetTitle = sheetName ? sheetName : sheet?.properties?.title;
      const sheetData = await this._googleSheet.spreadsheets.values.get({
        auth: this.auth,
        spreadsheetId: this._spreadsheetId,
        range: sheetTitle
      })
      allSheetData.push({sheetTitle, data: sheetData.data.values})
    }

    return allSheetData;
  }

  async convertSheetDataToExcel(sheetData: SheetData[]) {
    const workbook = new ExcelJS.Workbook();

    for (const {sheetTitle, data} of sheetData) {
      const worksheet = workbook.addWorksheet(sheetTitle ?? 'Sheet 1');

      for (const row of data) {
        worksheet.addRow(row);
      }
    }

    this._tempFile = tmp.fileSync({ postfix: '.xlsx' });
    this._tempFilePath = this._tempFile.name;

    await workbook.xlsx.writeFile(this._tempFilePath);

    return {tempFilePath: this._tempFilePath, tempFile: this._tempFile}
  }

  removeTempFile() {
    if (this._tempFile) this._tempFile.removeCallback(); 
  }

  getSpreadsheetUrl = () => this.metadata?.data.spreadsheetUrl;
}