// ============================================================
// Dashboard Data Layer
// ============================================================

const GOOGLE_SHEET_ID =
    "1I_cc9v1oPQHfgfB381zKYSANkaxP7sVV";


// ============================================================
// Google Sheet Tabs
// ============================================================

export const SHEET_NAMES = [
    "Summary",
    "Jaipuria - All Traffic",
    "Jaipuria - Organic Traffic",
    "Jaipuria - Direct Traffic",
    "Leads - 2026-27",
    "Leads 2025-26",
    "Leads 2024-25",
    "Campuswise Applications",
    "Organic Traffic by States",
    "Organic Traffic by Cities",
    "Direct Traffic by States",
    "Direct Traffic by Cities",
    "Top URLs by Click",
    " Top Organic URLS"
];


// ============================================================
// Page-wise Required Sheets
// ============================================================

export const PAGE_SHEETS = {

    "index.html": [
        "Leads - 2026-27",
        "Leads 2025-26",
        "Leads 2024-25",
        "Jaipuria - All Traffic"
    ],

    "leads.html": [
        "Leads - 2026-27",
        "Leads 2025-26",
        "Leads 2024-25"
    ],

    "traffic.html": [
        "Jaipuria - All Traffic",
        "Jaipuria - Organic Traffic",
        "Jaipuria - Direct Traffic"
    ],

    "comparison.html": [
        "Leads - 2026-27",
        "Leads 2025-26",
        "Leads 2024-25",
        "Jaipuria - All Traffic",
        "Organic Traffic by States",
        "Organic Traffic by Cities",
        "Direct Traffic by States",
        "Direct Traffic by Cities"
    ],

    "state.html": [
        "Leads - 2026-27",
        "Leads 2025-26",
        "Leads 2024-25",
        "Organic Traffic by States",
        "Organic Traffic by Cities",
        "Direct Traffic by States",
        "Direct Traffic by Cities"
    ],

    "projection.html": []
};


// ============================================================
// Central Dashboard Data Store
// ============================================================

export let dashboardData = {};


// ============================================================
// Get Required Sheets For Page
// ============================================================

export function getRequiredSheets(
    pageName
) {

    return PAGE_SHEETS[pageName] || [];
}


// ============================================================
// Fetch One Sheet
// ============================================================

export async function fetchGoogleSheet(
    sheetName
) {

    const url =
        `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}` +
        `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Failed to fetch sheet: ${sheetName}`
        );
    }

    const text =
    await response.text();

const match =
    text.match(
        /google\.visualization\.Query\.setResponse\(([\s\S]+)\);\s*$/
    );

if (!match) {
    throw new Error(
        `Invalid Google Sheet response: ${sheetName}`
    );
}

const data =
    JSON.parse(match[1]);

console.log(
    `[DATA] ${sheetName}:`,
    data.table?.rows?.length ?? 0,
    "rows"
);

return data;
}


// ============================================================
// Load Required Dashboard Data
// ============================================================

export async function loadDashboardData(
    sheetNames = []
) {

    if (
        !Array.isArray(sheetNames) ||
        sheetNames.length === 0
    ) {

        dashboardData = {};

        return dashboardData;
    }


    // --------------------------------------------------------
    // Validate requested sheets
    // --------------------------------------------------------

    const requestedSheets =
        [
            ...new Set(
                sheetNames.filter(
                    sheetName =>
                        SHEET_NAMES.includes(
                            sheetName
                        )
                )
            )
        ];


    // --------------------------------------------------------
    // Fetch only requested sheets
    // --------------------------------------------------------

    const result = {};

    await Promise.all(
        requestedSheets.map(
            async sheetName => {

                const rawData =
                    await fetchGoogleSheet(
                        sheetName
                    );

                result[sheetName] =
                    gvizToRows(
                        rawData
                    );
            }
        )
    );


    // --------------------------------------------------------
    // Merge into central store
    // --------------------------------------------------------

    dashboardData = {
        ...dashboardData,
        ...result
    };


    return dashboardData;
}


// ============================================================
// Google Visualization → Normal JS Rows
// ============================================================

function gvizToRows(
    data
) {

    const columns =
        data.table.cols.map(
            column =>
                column.label || ""
        );


    return data.table.rows.map(
        row => {

            const record = {};

            columns.forEach(
                (
                    columnName,
                    index
                ) => {

                    record[columnName] =
                        row.c?.[index]?.v ??
                        null;
                }
            );

            return record;
        }
    );
}