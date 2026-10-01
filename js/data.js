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
// Central Dashboard Data Store
// ============================================================

export let dashboardData = {};

// ============================================================
// Fetch One Sheet
// ============================================================

export async function fetchGoogleSheet(sheetName) {

    const url =
        `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}` +
        `/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch sheet: ${sheetName}`
        );
    }

    const text = await response.text();

    const match = text.match(
        /google\.visualization\.Query\.setResponse\(([\s\S]+)\);?\s*$/
    );

    if (!match) {
        throw new Error(
            `Invalid Google Sheet response: ${sheetName}`
        );
    }

    return JSON.parse(match[1]);
}

// ============================================================
// Load All Sheets
// ============================================================

// ============================================================
// Dashboard Cache
// ============================================================

const CACHE_KEY =
    "jaipuria_dashboard_data_v1";


// ============================================================
// Load Dashboard Data
// ============================================================

export async function loadDashboardData(
    options = {}
) {

    const {
        forceRefresh = false
    } = options;


    // --------------------------------------------------------
    // Load cached data first
    // --------------------------------------------------------

    if (!forceRefresh) {

        const cachedData =
            getCachedDashboardData();

        if (cachedData) {

            dashboardData =
                cachedData;

            return dashboardData;
        }
    }


    // --------------------------------------------------------
    // Fetch fresh data
    // --------------------------------------------------------

    const result = {};


    await Promise.all(
        SHEET_NAMES.map(
            async sheetName => {

                const rawData =
                    await fetchGoogleSheet(
                        sheetName
                    );

                result[sheetName] =
                    gvizToRows(rawData);
            }
        )
    );


    // --------------------------------------------------------
    // Update central store
    // --------------------------------------------------------

    dashboardData =
        result;


    // --------------------------------------------------------
    // Save cache
    // --------------------------------------------------------

    saveCachedDashboardData(
        dashboardData
    );


    return dashboardData;
}


// ============================================================
// Read Cache
// ============================================================

function getCachedDashboardData() {

    try {

        const cached =
            sessionStorage.getItem(
                CACHE_KEY
            );

        if (!cached) {
            return null;
        }


        const data =
            JSON.parse(cached);


        if (
            !data ||
            typeof data !== "object"
        ) {
            return null;
        }


        return data;

    } catch (error) {

        console.warn(
            "Dashboard cache read failed:",
            error
        );

        return null;
    }
}


// ============================================================
// Save Cache
// ============================================================

function saveCachedDashboardData(
    data
) {

    try {

        sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify(data)
        );

    } catch (error) {

        console.warn(
            "Dashboard cache save failed:",
            error
        );
    }
}

// ============================================================
// Check Cached Dashboard Data
// ============================================================

export function hasCachedDashboardData() {

    try {

        const cached =
            sessionStorage.getItem(
                CACHE_KEY
            );

        return Boolean(cached);

    } catch (error) {

        return false;
    }
}

// ============================================================
// Google Visualization → Normal JS Rows
// ============================================================

function gvizToRows(data) {

    const columns =
        data.table.cols.map(
            column => column.label || ""
        );

    return data.table.rows.map(row => {

        const record = {};

        columns.forEach((columnName, index) => {

            record[columnName] =
                row.c?.[index]?.v ?? null;

        });

        return record;
    });
}