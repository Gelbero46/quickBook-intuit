import { NextResponse } from 'next/server';
import axios from 'axios';
import ExcelJS from 'exceljs';
import IntuitOAuth from 'intuit-oauth';

type LedgerRow = {
    ColData?: { value?: string }[];
    Rows?: { Row: LedgerRow[] };
  };

type LedgerResponse = {
  Header: {};
  Columns: { Column: {ColTitle: string; ColType: string}[]};
  Rows: {Row :LedgerRow[]};
};

const oauthClient = new IntuitOAuth({
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI!,
});

async function getAccessToken(): Promise<string> {
  try {
    const authResponse = await oauthClient.refreshUsingToken(process.env.QUICKBOOKS_REFRESH_TOKEN!);
    return authResponse.getJson().access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to get QuickBooks access token');
  }
}

export async function GET(): Promise<Response> {
  try {
    const accessToken = await getAccessToken();
    console.log("accessToken", accessToken)
    const companyId = process.env.QUICKBOOKS_COMPANY_ID!;
    const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/reports/GeneralLedger`;
    
    // Fetch general ledger data
    const response = await axios.get<LedgerResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const ledgerData = response.data;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('General Ledger');
    
    // Add headers
    // worksheet.addRow(['Account Name', 'Date', 'Transaction Type', 'Amount', 'Balance']);
    worksheet.addRow(ledgerData.Columns.Column.map(item => item.ColTitle));
    
     // Recursive function to process rows
     function processRows(rows: LedgerRow[]) {
        rows.forEach((row) => {

          if (row.ColData) {
            const values: any[] = [];
            row.ColData?.forEach((dRow) => values.push(dRow.value || '-'))
            worksheet.addRow(values)
          }
          if (row.Rows) {
            processRows(row.Rows.Row);
          }
        });
      }
      
      // Process ledger rows
      if (ledgerData.Rows?.Row) {
        processRows(ledgerData.Rows.Row);
      }

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="GeneralLedger.xlsx"',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch general ledger' }, { status: 500 });
  }
}
