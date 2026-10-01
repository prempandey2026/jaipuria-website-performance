// ============================================================
// Summary Page
// ============================================================

import {
    UI,
    initializeIcons,
    animatePageContent,
    toNumber,
    formatNumber,
    formatPercent,
    escapeHtml
} from "../utils.js";

import {
    dashboardData
} from "../data.js";

// ============================================================
// Constants
// ============================================================

const YEARS = [
    "2024-25",
    "2025-26",
    "2026-27"
];

const MONTHS = [
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
];

const LEAD_SHEETS = {
    "2024-25": "Leads 2024-25",
    "2025-26": "Leads 2025-26",
    "2026-27": "Leads - 2026-27"
};


// ============================================================
// Render Summary Page
// ============================================================

export function renderSummaryPage() {

    const pageContent =
        document.getElementById("pageContent");

    if (!pageContent) {
        return;
    }

    pageContent.innerHTML = `
    <div
    id="summaryLoader"
    class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px]"
>
    <div
        class="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-xl border border-slate-200"
    >
        <div
            class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
        ></div>

        <span class="text-sm font-medium text-slate-700">
            Updating dashboard...
        </span>
    </div>
</div>
        ${renderSummaryFilters()}
        ${renderSummaryHero()}
        ${renderSummaryKpis()}
        ${renderSummaryFunnelSection()}
        ${renderSummaryQualityTrafficSection()}
        ${renderSummarySourceMix()}
    `;

    initializeSummaryFilters();
    renderSummaryData();

    initializeIcons();

    requestAnimationFrame(() => {
        animatePageContent();
    });
}


// ============================================================
// Filters UI
// ============================================================

function renderSummaryFilters() {

    return `
        <div
            class="
                mb-6
                rounded-2xl
                border border-slate-200/80
                bg-white/90
                p-4
                shadow-sm
                backdrop-blur
                transition-all duration-300
                hover:shadow-md
            "
        >

            <div
                class="
                    mb-4
                    flex items-center
                    justify-between
                "
            >

                <div class="flex items-center gap-2">

                    <div
                        class="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <i
                            data-lucide="sliders-horizontal"
                            class="h-4 w-4"
                        ></i>
                    </div>

                    <div>

                        <div
                            class="
                                text-sm
                                font-semibold
                                text-slate-900
                            "
                        >
                            Filters
                        </div>

                        <div
                            class="
                                text-xs
                                text-slate-500
                            "
                        >
                            Refine the dashboard view
                        </div>

                    </div>

                </div>

                <button
                    id="resetFilters"
                    type="button"
                    class="
                        rounded-lg
                        px-3 py-2
                        text-xs
                        font-semibold
                        text-slate-500
                        transition-all duration-200
                        hover:bg-slate-100
                        hover:text-slate-900
                    "
                >
                    Reset Filters
                </button>

            </div>

            <div
                class="
                    grid grid-cols-1 gap-4
                    sm:grid-cols-2
                    lg:grid-cols-5
                "
            >

                ${renderFilter(
        "year",
        "Academic Year",
        "All Years"
    )}

                ${renderFilter(
        "month",
        "Month",
        "All Months"
    )}

                ${renderFilter(
        "quality",
        "Lead Quality",
        "All Quality"
    )}

                ${renderFilter(
        "source",
        "Lead Source",
        "All Sources"
    )}

                ${renderFilter(
        "state",
        "State",
        "All States"
    )}

            </div>

        </div>
    `;
}


// ============================================================
// Filter Field
// ============================================================

function renderFilter(
    id,
    label,
    defaultLabel
) {

    return `
        <div>

            <label
                for="${id}"
                class="
                    mb-1.5
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                ${label}
            </label>

            <select
                id="${id}"
                class="${UI.select}"
            >
                <option value="all">
                    ${defaultLabel}
                </option>
            </select>

        </div>
    `;
}


// ============================================================
// Hero
// ============================================================

function renderSummaryHero() {

    return `
        <div
            class="
                relative
                mb-6
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                from-slate-950
                via-slate-900
                to-blue-950
                px-6 py-7
                text-white
                shadow-xl
                sm:px-8
            "
        >

            <div
                class="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-20
                    h-64 w-64
                    rounded-full
                    bg-blue-500/10
                    blur-3xl
                "
            ></div>

            <div
                class="
                    pointer-events-none
                    absolute
                    -bottom-24
                    -left-10
                    h-52 w-52
                    rounded-full
                    bg-indigo-500/10
                    blur-3xl
                "
            ></div>

            <div class="relative">

                <div
                    class="
                        mb-2
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-blue-300
                    "
                >
                    Executive overview
                </div>

                <h2
                    class="
                        text-2xl
                        font-bold
                        tracking-tight
                        sm:text-3xl
                    "
                >
                    Jaipuria performance, at a glance.
                </h2>

                <div
                    id="summaryScope"
                    class="
                        mt-2
                        text-sm
                        text-slate-300
                    "
                ></div>

            </div>

        </div>
    `;
}


// ============================================================
// KPI Cards
// ============================================================

function renderSummaryKpis() {

    const kpis = [
        "Leads",
        "Applications",
        "Lead → Application",
        "Admissions",
        "Interview Done",
        "Offer Sent",
        "Full Fee Paid",
        "Partial Fee Paid",
        "Registered",
        "Refund",
        "Net Admissions (After Refund)",
        "Application → Admissions"
    ];

    return `
        <div
            id="summaryKpis"
            class="
                mb-6
                grid grid-cols-1 gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        >

            ${kpis.map(
        (label, index) => `

                    <div
                        class="${UI.kpiCard}"
                        style="
                            animation-delay:
                            ${index * 45}ms
                        "
                    >

                        <div
                            class="
                                pointer-events-none
                                absolute
                                -right-8
                                -top-8
                                h-24 w-24
                                rounded-full
                                bg-blue-500/[0.04]
                                transition-all duration-500
                                group-hover:scale-150
                            "
                        ></div>

                        <div class="relative">

                            <div
                                class="
                                    flex items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                <div
                                    class="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    ${label}
                                </div>

                                <div
                                    class="
                                        flex h-8 w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-50
                                        text-slate-400
                                        transition-all duration-300
                                        group-hover:bg-blue-50
                                        group-hover:text-blue-600
                                    "
                                >
                                    <i
                                        data-lucide="trending-up"
                                        class="h-4 w-4"
                                    ></i>
                                </div>

                            </div>

                            <div
                                class="${UI.kpiValue}"
                                data-kpi="${label}"
                            >
                                -
                            </div>

                            <div
                                class="
                                    mt-3
                                    h-1
                                    overflow-hidden
                                    rounded-full
                                    bg-slate-100
                                "
                            >

                                <div
                                    class="
                                        h-full
                                        w-1/3
                                        rounded-full
                                        bg-blue-500/70
                                    "
                                ></div>

                            </div>

                        </div>

                    </div>
                `
    ).join("")}

        </div>
    `;
}


// ============================================================
// Funnel
// ============================================================

function renderSummaryFunnelSection() {

    return `
        <div
            class="
                mb-6
                grid grid-cols-1 gap-6
                xl:grid-cols-2
            "
        >

            <div
                class="${UI.card} p-5 sm:p-6"
            >

                <div
                    class="
                        mb-5
                        flex items-center
                        justify-between
                        gap-4
                    "
                >

                    <h2 class="${UI.sectionTitle}">
                        Funnel Health
                    </h2>

                    <div
                        id="funnelHealthBadge"
                    ></div>

                </div>

                <div
                    id="summaryFunnel"
                ></div>

            </div>

            <div
                class="${UI.card} p-5 sm:p-6"
            >

                <h2 class="${UI.sectionTitle}">
                    Key Conversion Checkpoints
                </h2>

                <div
                    id="funnelHealth"
                    class="mt-5"
                ></div>

            </div>

        </div>
    `;
}


// ============================================================
// Quality + Traffic
// ============================================================

function renderSummaryQualityTrafficSection() {

    return `
        <div
            class="
                mb-6
                grid grid-cols-1 gap-6
                xl:grid-cols-2
            "
        >

            <div
                class="${UI.card} p-5 sm:p-6"
            >

                <div
                    class="
                        mb-5
                        flex items-center
                        justify-between
                    "
                >

                    <h2 class="${UI.sectionTitle}">
                        Lead Quality
                    </h2>

                    <span
                        class="
                            rounded-full
                            bg-slate-100
                            px-2.5 py-1
                            text-[11px]
                            font-semibold
                            text-slate-500
                        "
                    >
                        Distribution
                    </span>

                </div>

                <div
                    id="summaryQuality"
                ></div>

            </div>

            <div
                class="${UI.card} p-5 sm:p-6"
            >

                <div
                    class="
                        mb-5
                        flex items-center
                        justify-between
                    "
                >

                    <h2 class="${UI.sectionTitle}">
                        Traffic Performance
                    </h2>

                    <span
                        class="
                            rounded-full
                            bg-blue-50
                            px-2.5 py-1
                            text-[11px]
                            font-semibold
                            text-blue-600
                        "
                    >
                        Sessions
                    </span>

                </div>

                <div
                    id="summaryTraffic"
                    class="
                        grid grid-cols-1 gap-3
                        sm:grid-cols-2
                    "
                ></div>

            </div>

        </div>
    `;
}


// ============================================================
// Lead Source Mix
// ============================================================

function renderSummarySourceMix() {

    return `
        <div
            class="${UI.card} p-5 sm:p-6"
        >

            <div
                class="
                    mb-5
                    flex items-center
                    justify-between
                    gap-4
                "
            >

                <div>

                    <h2 class="${UI.sectionTitle}">
                        Lead Source Mix
                    </h2>

                    <p
                        class="
                            mt-1
                            text-xs
                            text-slate-500
                        "
                    >
                        Lead source contribution and conversion
                    </p>

                </div>

                <div
                    class="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-500
                    "
                >

                    <i
                        data-lucide="bar-chart-3"
                        class="h-4 w-4"
                    ></i>

                </div>

            </div>

            <div
                id="summarySourceTable"
                class="overflow-x-auto"
            ></div>

        </div>
    `;
}


// ============================================================
// Filter Initialization
// ============================================================

function initializeSummaryFilters() {

    populateFilterOptions();

    const filterIds = [
        "year",
        "month",
        "quality",
        "source",
        "state"
    ];

    filterIds.forEach(id => {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "change",
            renderSummaryData
        );
    });

    const resetButton =
        document.getElementById("resetFilters");

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetSummaryFilters
        );
    }
}


// ============================================================
// Populate Filter Options
// ============================================================

function populateFilterOptions() {

    fillSelect(
        "year",
        YEARS,
        "All Years"
    );

    fillSelect(
        "month",
        MONTHS,
        "All Months"
    );

    const allRecords =
        YEARS.flatMap(year =>
            getRecords(year)
        );

    fillSelect(
        "quality",
        uniqueSorted(
            allRecords.map(record => record.quality)
        ),
        "All Quality"
    );

    fillSelect(
        "source",
        uniqueSorted(
            allRecords.map(record => record.source)
        ),
        "All Sources"
    );

    fillSelect(
        "state",
        uniqueSorted(
            allRecords.map(record => record.state)
        ),
        "All States"
    );
}


// ============================================================
// Fill Select
// ============================================================

function fillSelect(
    id,
    values,
    defaultLabel
) {

    const select =
        document.getElementById(id);

    if (!select) {
        return;
    }

    const currentValue =
        select.value || "all";

    select.innerHTML = `
        <option value="all">
            ${escapeHtml(defaultLabel)}
        </option>

        ${values
            .filter(Boolean)
            .map(value => `
                <option value="${escapeHtml(value)}">
                    ${escapeHtml(value)}
                </option>
            `)
            .join("")
        }
    `;

    const exists =
        [...select.options]
            .some(option =>
                option.value === currentValue
            );

    select.value =
        exists
            ? currentValue
            : "all";
}


// ============================================================
// Reset Filters
// ============================================================

function resetSummaryFilters() {

    [
        "year",
        "month",
        "quality",
        "source",
        "state"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "all";
        }
    });

    renderSummaryData();
}


// ============================================================
// Main Summary Renderer
// ============================================================

function showSummaryLoader() {

    const loader =
        document.getElementById("summaryLoader");

    if (loader) {
        loader.classList.remove("hidden");
    }
}

function hideSummaryLoader() {

    const loader =
        document.getElementById("summaryLoader");

    if (loader) {
        loader.classList.add("hidden");
    }
}

function renderSummaryData() {

    const metrics =
        getSummaryMetrics();

    const filters =
        getSummaryFilters();

    const years =
        getActiveYears();

    renderScope(filters, years);
    renderKpiValues(metrics);
    renderFunnel(metrics);
    renderFunnelHealth(metrics);
    renderQuality(years);
    renderTraffic(years, filters);
    renderSourceMix();
}


// ============================================================
// Filters State
// ============================================================

function getSummaryFilters() {

    return {
        year:
            document.getElementById("year")?.value ||
            "all",

        month:
            document.getElementById("month")?.value ||
            "all",

        quality:
            document.getElementById("quality")?.value ||
            "all",

        source:
            document.getElementById("source")?.value ||
            "all",

        state:
            document.getElementById("state")?.value ||
            "all"
    };
}


// ============================================================
// Active Years
// ============================================================

function getActiveYears() {

    const year =
        getSummaryFilters().year;

    return year === "all"
        ? [...YEARS]
        : [year];
}


// ============================================================
// Get Raw Lead Rows
// ============================================================

function getLeadRows(year) {

    const sheetName =
        LEAD_SHEETS[year];

    return dashboardData[sheetName] || [];
}


// ============================================================
// Normalize Lead Record
// ============================================================

function normalizeLeadRecord(row) {

    const createdDate =
        parseSheetDate(
            row["Created On"]
        );

    const transactionDate =
        parseSheetDate(
            row["Transaction Date"]
        );

    return {

        createdDate,

        transactionDate,

        month:
            createdDate
                ? createdDate.toLocaleString(
                    "en-US",
                    {
                        month: "long"
                    }
                )
                : "",

        transactionMonth:
            transactionDate
                ? transactionDate.toLocaleString(
                    "en-US",
                    {
                        month: "long"
                    }
                )
                : "",

        source:
            String(
                row["Lead Source"] ||
                "Unknown"
            ).trim(),

        owner:
            String(
                row["Owner"] ||
                "Unknown"
            ).trim(),

        quality:
            String(
                row["LeadSubstage"] ||
                "Blank"
            ).trim(),

        counter:
            String(
                row["Counter"] ||
                "Unassigned"
            ).trim(),

        state:
            String(
                row["Correspondence State"] ||
                "Unknown"
            ).trim(),

        city:
            String(
                row["Correspondence City"] ||
                "Unknown"
            ).trim(),

        stage:
            String(
                row["Lead Stage"] ||
                "Unknown"
            ).trim()
    };
}


// ============================================================
// Get Normalized Records
// ============================================================

const recordsCache = new Map();

function getRecords(year) {

    const sheetName = LEAD_SHEETS[year];
    const rows = dashboardData[sheetName] || [];

    const cached = recordsCache.get(year);

    if (cached && cached.rows === rows) {
        return cached.records;
    }

    const records = rows.map(normalizeLeadRecord);

    recordsCache.set(year, {
        rows,
        records
    });

    return records;
}


// ============================================================
// Date Parser
// ============================================================

function parseSheetDate(value) {

    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return isNaN(value.getTime())
            ? null
            : value;
    }

    const text =
        String(value).trim();

    if (!text) {
        return null;
    }

    const googleDate =
        text.match(
            /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/
        );

    if (googleDate) {

        const year =
            Number(googleDate[1]);

        const month =
            Number(googleDate[2]);

        const day =
            Number(googleDate[3]);

        const hour =
            Number(googleDate[4] || 0);

        const minute =
            Number(googleDate[5] || 0);

        const second =
            Number(googleDate[6] || 0);

        return new Date(
            year,
            month,
            day,
            hour,
            minute,
            second
        );
    }

    const parsed =
        new Date(text);

    return isNaN(parsed.getTime())
        ? null
        : parsed;
}


// ============================================================
// Filter Matching
// ============================================================

function matchesNonMonthFilters(
    record,
    filters
) {

    return (

        (
            filters.quality === "all" ||
            normalize(record.quality) ===
            normalize(filters.quality)
        )

        &&

        (
            filters.source === "all" ||
            normalize(record.source) ===
            normalize(filters.source)
        )

        &&

        (
            filters.state === "all" ||
            normalize(record.state) ===
            normalize(filters.state)
        )
    );
}


// ============================================================
// Lead Records For Selected View
// ============================================================

function getFilteredLeadRecords(year) {

    const filters =
        getSummaryFilters();

    return getRecords(year)
        .filter(record => {

            if (
                filters.month !== "all" &&
                normalize(record.month) !==
                normalize(filters.month)
            ) {
                return false;
            }

            return matchesNonMonthFilters(
                record,
                filters
            );
        });
}


// ============================================================
// Transaction Records
// ============================================================

function getTransactionRecords(year) {

    const filters =
        getSummaryFilters();

    return getRecords(year)
        .filter(record => {

            if (!record.transactionDate) {
                return false;
            }

            if (
                filters.month !== "all" &&
                normalize(
                    record.transactionMonth
                ) !==
                normalize(filters.month)
            ) {
                return false;
            }

            return matchesNonMonthFilters(
                record,
                filters
            );
        });
}


// ============================================================
// Calculate Metrics
// ============================================================

function calculateMetrics(
    records,
    transactionRecords
) {

    const metrics = {

        leads: records.length,

        applications: 0,

        interview: 0,

        offer: 0,

        full: 0,

        partial: 0,

        registered: 0,

        refund: 0,

        admissions: 0,

        net: 0,

        conversion: 0,

        appToAdm: 0,

        appToInterview: 0,

        interviewToOffer: 0,

        offerToAdm: 0
    };


    // --------------------------------------------------------
    // Lead-side stages
    // --------------------------------------------------------

    records.forEach(record => {

        if (
            normalize(record.stage) ===
            normalize("Interview Done")
        ) {
            metrics.interview++;
        }

        if (
            normalize(record.stage) ===
            normalize("Offer Sent")
        ) {
            metrics.offer++;
        }
    });


    // --------------------------------------------------------
    // Transaction-side stages
    // --------------------------------------------------------

    transactionRecords.forEach(record => {

        metrics.applications++;

        if (
            normalize(record.stage) ===
            normalize("Full Fee Paid")
        ) {
            metrics.full++;
        }

        if (
            normalize(record.stage) ===
            normalize("Partial Fee Paid")
        ) {
            metrics.partial++;
        }

        if (
            normalize(record.stage) ===
            normalize("Registered")
        ) {
            metrics.registered++;
        }

        if (
            normalize(record.stage) ===
            normalize("Refund")
        ) {
            metrics.refund++;
        }
    });


    metrics.admissions =
        metrics.full +
        metrics.partial +
        metrics.registered;

    metrics.net =
        metrics.admissions -
        metrics.refund;

    metrics.conversion =
        metrics.leads
            ? (
                metrics.applications /
                metrics.leads
            ) * 100
            : 0;

    metrics.appToAdm =
        metrics.applications
            ? (
                metrics.admissions /
                metrics.applications
            ) * 100
            : 0;

    metrics.appToInterview =
        metrics.applications
            ? (
                metrics.interview /
                metrics.applications
            ) * 100
            : 0;

    metrics.interviewToOffer =
        metrics.interview
            ? (
                metrics.offer /
                metrics.interview
            ) * 100
            : 0;

    metrics.offerToAdm =
        metrics.offer
            ? (
                metrics.admissions /
                metrics.offer
            ) * 100
            : 0;

    return metrics;
}


// ============================================================
// Summary Metrics Across Years
// ============================================================

function getSummaryMetrics() {

    const years =
        getActiveYears();

    const total = {

        leads: 0,
        applications: 0,
        interview: 0,
        offer: 0,
        full: 0,
        partial: 0,
        registered: 0,
        refund: 0,
        admissions: 0,
        net: 0
    };


    years.forEach(year => {

        const records =
            getFilteredLeadRecords(year);

        const transactionRecords =
            getTransactionRecords(year);

        const metrics =
            calculateMetrics(
                records,
                transactionRecords
            );

        Object.keys(total)
            .forEach(key => {

                total[key] +=
                    metrics[key] || 0;
            });
    });


    total.conversion =
        total.leads
            ? (
                total.applications /
                total.leads
            ) * 100
            : 0;

    total.appToAdm =
        total.applications
            ? (
                total.admissions /
                total.applications
            ) * 100
            : 0;

    total.appToInterview =
        total.applications
            ? (
                total.interview /
                total.applications
            ) * 100
            : 0;

    total.interviewToOffer =
        total.interview
            ? (
                total.offer /
                total.interview
            ) * 100
            : 0;

    total.offerToAdm =
        total.offer
            ? (
                total.admissions /
                total.offer
            ) * 100
            : 0;

    return total;
}


// ============================================================
// Render Scope
// ============================================================

function renderScope(
    filters,
    years
) {

    const element =
        document.getElementById(
            "summaryScope"
        );

    if (!element) {
        return;
    }

    const yearText =
        years.length === YEARS.length
            ? "All Academic Years"
            : years.join(", ");

    const monthText =
        filters.month === "all"
            ? "All Months"
            : filters.month;

    element.textContent =
        `${yearText} · ${monthText}`;
}


// ============================================================
// Render KPI Values
// ============================================================

function renderKpiValues(metrics) {

    const values = {

        "Leads":
            formatNumber(metrics.leads),

        "Applications":
            formatNumber(metrics.applications),

        "Lead → Application":
            formatPercent(metrics.conversion),

        "Admissions":
            formatNumber(metrics.admissions),

        "Interview Done":
            formatNumber(metrics.interview),

        "Offer Sent":
            formatNumber(metrics.offer),

        "Full Fee Paid":
            formatNumber(metrics.full),

        "Partial Fee Paid":
            formatNumber(metrics.partial),

        "Registered":
            formatNumber(metrics.registered),

        "Refund":
            formatNumber(metrics.refund),

        "Net Admissions (After Refund)":
            formatNumber(metrics.net),

        "Application → Admissions":
            formatPercent(metrics.appToAdm)
    };


    document
        .querySelectorAll("[data-kpi]")
        .forEach(element => {

            const key =
                element.dataset.kpi;

            element.textContent =
                values[key] ?? "-";
        });
}


// ============================================================
// Funnel
// ============================================================

function renderFunnel(metrics) {

    const container =
        document.getElementById(
            "summaryFunnel"
        );

    if (!container) {
        return;
    }

    const stages = [
        {
            label: "Leads",
            value: metrics.leads,
            color: "bg-slate-900"
        },

        {
            label: "Applications",
            value: metrics.applications,
            color: "bg-blue-600"
        },

        {
            label: "Interview Done",
            value: metrics.interview,
            color: "bg-indigo-600"
        },

        {
            label: "Offer Sent",
            value: metrics.offer,
            color: "bg-violet-600"
        },

        {
            label: "Admissions",
            value: metrics.admissions,
            color: "bg-emerald-600"
        },

        {
            label: "Refund",
            value: metrics.refund,
            color: "bg-red-500"
        },

        {
            label: "Net Admissions (After Refund)",
            value: metrics.net,
            color: "bg-emerald-700"
        }
    ];


    container.innerHTML = stages
        .map((stage, index) => {

            const width =
                metrics.leads > 0
                    ? Math.max(
                        8,
                        (
                            stage.value /
                            metrics.leads
                        ) * 100
                    )
                    : 8;

            return `
                <div
                    class="
                        group
                        mb-4
                        last:mb-0
                    "
                >

                    <div
                        class="
                            mb-1.5
                            flex items-center
                            justify-between
                            gap-3
                        "
                    >

                        <span
                            class="
                                text-xs
                                font-semibold
                                text-slate-600
                            "
                        >
                            ${stage.label}
                        </span>

                        <span
                            class="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            ${formatNumber(stage.value)}
                        </span>

                    </div>

                    <div
                        class="
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-slate-100
                        "
                    >

                        <div
                            class="
                                h-full
                                rounded-full
                                ${stage.color}
                                transition-all
                                duration-700
                            "
                            style="
                                width:${width}%
                            "
                        ></div>

                    </div>

                </div>
            `;
        })
        .join("");
}


// ============================================================
// Funnel Health
// ============================================================

function renderFunnelHealth(metrics) {

    const container =
        document.getElementById(
            "funnelHealth"
        );

    const badge =
        document.getElementById(
            "funnelHealthBadge"
        );

    if (!container || !badge) {
        return;
    }


    let health;
    let badgeClass;

    if (metrics.conversion >= 15) {

        health = "Healthy";
        badgeClass =
            "bg-emerald-50 text-emerald-700";

    } else if (metrics.conversion >= 8) {

        health = "Watch";
        badgeClass =
            "bg-amber-50 text-amber-700";

    } else {

        health = "Needs attention";
        badgeClass =
            "bg-red-50 text-red-700";
    }


    badge.innerHTML = `
        <span
            class="
                inline-flex
                items-center
                rounded-full
                px-2.5 py-1
                text-[11px]
                font-bold
                ${badgeClass}
            "
        >
            ${health}
            ·
            ${formatPercent(metrics.conversion)}
            Lead → Application
        </span>
    `;


    const checkpoints = [

        {
            label: "Lead → Application",
            value: metrics.conversion
        },

        {
            label: "Application → Interview",
            value: metrics.appToInterview
        },

        {
            label: "Interview → Offer",
            value: metrics.interviewToOffer
        },

        {
            label: "Offer → Admission",
            value: metrics.offerToAdm
        },

        {
            label: "Application → Admission",
            value: metrics.appToAdm
        }
    ];


    container.innerHTML =
        checkpoints
            .map(item => `

                <div
                    class="
                        mb-4
                        last:mb-0
                    "
                >

                    <div
                        class="
                            mb-1.5
                            flex items-center
                            justify-between
                            gap-3
                        "
                    >

                        <span
                            class="
                                text-xs
                                font-medium
                                text-slate-600
                            "
                        >
                            ${item.label}
                        </span>

                        <span
                            class="
                                text-xs
                                font-bold
                                text-slate-900
                            "
                        >
                            ${formatPercent(item.value)}
                        </span>

                    </div>

                    <div
                        class="
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-slate-100
                        "
                    >

                        <div
                            class="
                                h-full
                                rounded-full
                                bg-blue-500
                                transition-all
                                duration-700
                            "
                            style="
                                width:${Math.min(
                100,
                Math.max(
                    0,
                    item.value
                )
            )}%
                            "
                        ></div>

                    </div>

                </div>

            `)
            .join("");
}


// ============================================================
// Lead Quality
// ============================================================

function renderQuality(years) {

    const container =
        document.getElementById(
            "summaryQuality"
        );

    if (!container) {
        return;
    }


    const records =
        years.flatMap(year =>
            getFilteredLeadRecords(year)
        );


    if (!records.length) {

        container.innerHTML = `
            <div
                class="
                    rounded-xl
                    bg-slate-50
                    px-4 py-8
                    text-center
                    text-sm
                    text-slate-400
                "
            >
                No lead quality data
                for this selection.
            </div>
        `;

        return;
    }


    const counts = {};

    records.forEach(record => {

        const quality =
            record.quality ||
            "Blank";

        counts[quality] =
            (counts[quality] || 0) + 1;
    });


    const sorted =
        Object.entries(counts)
            .sort((a, b) =>
                b[1] - a[1]
            );


    const total =
        records.length;


    container.innerHTML =
        sorted
            .map(([label, count]) => {

                const percent =
                    total
                        ? (
                            count /
                            total
                        ) * 100
                        : 0;

                return `
                    <div class="mb-4 last:mb-0">

                        <div
                            class="
                                mb-1.5
                                flex items-center
                                justify-between
                                gap-3
                            "
                        >

                            <span
                                class="
                                    max-w-[70%]
                                    truncate
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                "
                                title="${escapeHtml(label)}"
                            >
                                ${escapeHtml(label)}
                            </span>

                            <span
                                class="
                                    text-xs
                                    font-bold
                                    text-slate-900
                                "
                            >
                                ${formatNumber(count)}
                                ·
                                ${formatPercent(percent)}
                            </span>

                        </div>

                        <div
                            class="
                                h-2
                                overflow-hidden
                                rounded-full
                                bg-slate-100
                            "
                        >

                            <div
                                class="
                                    h-full
                                    rounded-full
                                    bg-blue-500
                                    transition-all
                                    duration-700
                                "
                                style="
                                    width:${percent}%
                                "
                            ></div>

                        </div>

                    </div>
                `;
            })
            .join("");
}


// ============================================================
// Traffic
// ============================================================

function renderTraffic(
    years,
    filters
) {

    const container =
        document.getElementById(
            "summaryTraffic"
        );

    if (!container) {
        return;
    }


    const months =
        filters.month === "all"
            ? MONTHS
            : [filters.month];


    const annualMode =
        filters.month === "all";


    const traffic = {

        all:
            trafficAggregate(
                "all",
                years,
                months,
                annualMode
            ),

        organic:
            trafficAggregate(
                "organic",
                years,
                months,
                annualMode
            ),

        direct:
            trafficAggregate(
                "direct",
                years,
                months,
                annualMode
            ),

        ai:
            trafficAggregate(
                "ai",
                years,
                months,
                annualMode
            )
    };


    const cards = [

        {
            label: "Total Traffic (Sessions)",
            value: traffic.all,
            icon: "globe-2"
        },

        {
            label: "Organic",
            value: traffic.organic,
            icon: "search"
        },

        {
            label: "Direct",
            value: traffic.direct,
            icon: "mouse-pointer-2"
        },

        {
            label: "AI Assistant",
            value: traffic.ai,
            icon: "bot"
        },

        {
            label: "Organic + Direct + AI",
            value:
                traffic.organic +
                traffic.direct +
                traffic.ai,
            icon: "layers-3"
        }
    ];


    container.innerHTML =
        cards
            .map(card => `

                <div
                    class="
                        group
                        rounded-xl
                        border border-slate-100
                        bg-slate-50/70
                        p-4
                        transition-all duration-300
                        hover:-translate-y-0.5
                        hover:bg-white
                        hover:shadow-sm
                    "
                >

                    <div
                        class="
                            mb-3
                            flex items-center
                            justify-between
                        "
                    >

                        <span
                            class="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            ${card.label}
                        </span>

                        <i
                            data-lucide="${card.icon}"
                            class="
                                h-4 w-4
                                text-slate-400
                            "
                        ></i>

                    </div>

                    <div
                        class="
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        ${formatNumber(card.value)}
                    </div>

                </div>
            `)
            .join("");
}


// ============================================================
// Traffic Aggregate
// ============================================================

function trafficAggregate(
    channel,
    years,
    months,
    annualMode = false
) {

    return years.reduce(
        (yearTotal, year) => {

            const rows =
                getTrafficRows(year);

            if (!rows.length) {
                return yearTotal;
            }


            const values =
                rows.map(row => {

                    const month =
                        row.month;

                    if (
                        annualMode ||
                        months.includes(month)
                    ) {
                        return toNumber(
                            row[channel]
                        );
                    }

                    return 0;
                });


            return (
                yearTotal +
                values.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                )
            );
        },
        0
    );
}


// ============================================================
// Parse Traffic Sheet
// ============================================================

function getTrafficRows(year) {

    const rows =
        dashboardData[
        "Jaipuria - All Traffic"
        ] || [];

    if (!rows.length) {
        return [];
    }


    const firstRow =
        rows[0];

    const headers =
        Object.keys(firstRow);


    const monthColumns =
        headers
            .filter(header =>
                /^[A-Za-z]{3}'?\d{2}$/
                    .test(
                        String(header).trim()
                    )
            );


    if (!monthColumns.length) {

        return parseTrafficRowsFallback(
            rows,
            year
        );
    }


    const output = [];


    monthColumns.forEach(column => {

        const parsed =
            parseTrafficHeader(column);

        if (!parsed) {
            return;
        }

        if (
            parsed.academicYear !== year
        ) {
            return;
        }


        const getValue =
            (...labels) => {

                const row =
                    rows.find(item => {

                        const first =
                            Object.values(item)[0];

                        const normalized =
                            normalize(first);

                        return labels
                            .map(normalize)
                            .includes(
                                normalized
                            );
                    });

                if (!row) {
                    return 0;
                }

                return toNumber(
                    row[column]
                );
            };


        output.push({

            month:
                parsed.month,

            all:
                getValue(
                    "Total",
                    "Total Traffic"
                ),

            organic:
                getValue(
                    "Organic Search",
                    "Organic Traffic",
                    "Organic"
                ),

            direct:
                getValue(
                    "Direct",
                    "Direct Traffic"
                ),

            ai:
                getValue(
                    "AI Assistant",
                    "AI"
                )
        });
    });


    return output;
}


// ============================================================
// Traffic Fallback Parser
// ============================================================

function parseTrafficRowsFallback(
    rows,
    year
) {

    const result = [];


    rows.forEach(row => {

        const keys =
            Object.keys(row);

        keys.forEach(key => {

            const parsed =
                parseTrafficHeader(key);

            if (
                !parsed ||
                parsed.academicYear !== year
            ) {
                return;
            }


            let existing =
                result.find(
                    item =>
                        item.month ===
                        parsed.month
                );


            if (!existing) {

                existing = {
                    month: parsed.month,
                    all: 0,
                    organic: 0,
                    direct: 0,
                    ai: 0
                };

                result.push(existing);
            }


            const label =
                normalize(
                    Object.values(row)[0]
                );


            const value =
                toNumber(row[key]);


            if (
                label === "total" ||
                label === "total traffic"
            ) {
                existing.all = value;
            }

            if (
                label === "organic" ||
                label === "organic search" ||
                label === "organic traffic"
            ) {
                existing.organic = value;
            }

            if (
                label === "direct" ||
                label === "direct traffic"
            ) {
                existing.direct = value;
            }

            if (
                label === "ai" ||
                label === "ai assistant"
            ) {
                existing.ai = value;
            }
        });
    });


    return result;
}


// ============================================================
// Traffic Header Parser
// ============================================================

function parseTrafficHeader(
    header
) {

    const text =
        String(header || "")
            .trim();

    const match =
        text.match(
            /^([A-Za-z]{3})'?(\d{2})$/
        );

    if (!match) {
        return null;
    }


    const monthDate =
        new Date(
            `${match[1]} 1, 20${match[2]}`
        );


    if (
        isNaN(
            monthDate.getTime()
        )
    ) {
        return null;
    }


    const month =
        monthDate.toLocaleString(
            "en-US",
            {
                month: "long"
            }
        );


    const calendarYear =
        Number(match[2]) + 2000;


    const academicYear =
        [
            "August",
            "September",
            "October",
            "November",
            "December"
        ].includes(month)

            ? `${calendarYear}-${String(
                calendarYear + 1
            ).slice(-2)}`

            : `${calendarYear - 1}-${String(
                calendarYear
            ).slice(-2)}`;


    return {
        month,
        academicYear
    };
}


// ============================================================
// Lead Source Mix
// ============================================================

function renderSourceMix() {

    const container =
        document.getElementById(
            "summarySourceTable"
        );

    if (!container) {
        return;
    }


    const years =
        getActiveYears();

    const filters =
        getSummaryFilters();


    const sourceMap = {};


    years.forEach(year => {

        getFilteredLeadRecords(year)
            .forEach(record => {

                const source =
                    record.source ||
                    "Unknown";

                if (!sourceMap[source]) {

                    sourceMap[source] = {
                        leads: 0,
                        applications: 0
                    };
                }

                sourceMap[source].leads++;
            });


        getTransactionRecords(year)
            .forEach(record => {

                const source =
                    record.source ||
                    "Unknown";

                if (!sourceMap[source]) {

                    sourceMap[source] = {
                        leads: 0,
                        applications: 0
                    };
                }

                sourceMap[source].applications++;
            });
    });


    const rows =
        Object.entries(sourceMap)
            .sort(
                (a, b) =>
                    b[1].leads -
                    a[1].leads
            );


    if (!rows.length) {

        container.innerHTML = `
            <div
                class="
                    rounded-xl
                    bg-slate-50
                    px-4 py-8
                    text-center
                    text-sm
                    text-slate-400
                "
            >
                No source data
                for this selection.
            </div>
        `;

        return;
    }


    container.innerHTML = `
        <table class="w-full min-w-[600px]">

            <thead>

                <tr
                    class="
                        border-b
                        border-slate-200
                    "
                >

                    <th
                        class="
                            px-3 py-3
                            text-left
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Lead Source
                    </th>

                    <th
                        class="
                            px-3 py-3
                            text-right
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Leads
                    </th>

                    <th
                        class="
                            px-3 py-3
                            text-right
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Applications
                    </th>

                    <th
                        class="
                            px-3 py-3
                            text-right
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Conversion
                    </th>

                </tr>

            </thead>

            <tbody>

                ${rows.map(
        ([source, data]) => {
            console.log(source, data.applications, data.leads);

            const conversion =
                data.leads
                    ? (
                        data.applications /
                        data.leads
                    ) * 100
                    : 0;

            return `
                            <tr
                                class="
                                    border-b
                                    border-slate-100
                                    transition-colors
                                    hover:bg-slate-50
                                "
                            >

                                <td
                                    class="
                                        px-3 py-3
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    ${escapeHtml(source)}
                                </td>

                                <td class=" p-3 text-right text-sm font-semibold text-slate-900">
                                    ${formatNumber(data.leads)}
                                </td>

                                <td class="p-3 text-right text-sm font-semibold text-slate-900">
                                    ${formatNumber(data.applications)}
                                </td>

                                <td
                                    class="
                                        px-3 py-3
                                        text-right
                                        text-sm
                                        font-bold
                                        text-blue-600
                                    "
                                >
                                    ${formatPercent(
                conversion
            )}
                                </td>

                            </tr>
                        `;
        }
    ).join("")}

            </tbody>

        </table>
    `;
}


// ============================================================
// Utility: Normalize
// ============================================================

function normalize(value) {

    return String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

// ============================================================
// Utility: Unique + Sorted
// ============================================================

function uniqueSorted(values) {

    return [
        ...new Set(
            values
                .map(value =>
                    String(value ?? "").trim()
                )
                .filter(Boolean)
        )
    ].sort(
        (a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity: "base"
                }
            )
    );
}