// ============================================================
// Leads & Applications Page
// ============================================================

import {
    dashboardData
} from "../data.js";

import {
    UI,
    initializeIcons,
    animatePageContent,
    toNumber,
    formatNumber,
    formatPercent,
    escapeHtml
} from "../utils.js";

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
// Page State
// ============================================================

let recordsCache = {};

// ============================================================
// Main Renderer
// ============================================================

export function renderLeadsPage() {
    const pageContent =
        document.getElementById("pageContent");

    if (!pageContent) {
        return;
    }

    pageContent.innerHTML = `
        ${renderLeadsFilters()}
        ${renderLeadsHero()}
        ${renderLeadKpis()}
        ${renderYearSection()}
        ${renderCounterSection()}
        ${renderMonthlySection()}
        ${renderStateSection()}
    `;

    initializeLeadsFilters();
    renderLeadsData();

    initializeIcons();

    requestAnimationFrame(() => {
        animatePageContent();
    });
}

// ============================================================
// Filters
// ============================================================

function renderLeadsFilters() {
    return `
        <section
            class="
                mb-6
                rounded-2xl
                border border-slate-200/80
                bg-white
                p-4
                shadow-sm
            "
        >
            <div
                class="
                    mb-4
                    flex flex-col gap-1
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2 class="text-sm font-semibold text-slate-900">
                        Lead Filters
                    </h2>

                    <p class="text-xs text-slate-500">
                        Filter leads, applications and admissions data.
                    </p>
                </div>

                <button
                    id="leadsResetFilters"
                    type="button"
                    class="
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-xl
                        border border-slate-200
                        bg-white
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-slate-600
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-slate-50
                        hover:shadow-sm
                    "
                >
                    <i
                        data-lucide="rotate-ccw"
                        class="h-3.5 w-3.5"
                    ></i>
                    Reset Filters
                </button>
            </div>

            <div
                class="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-6
                "
            >
                ${renderFilterSelect(
        "leadsYearFilter",
        "Academic Year"
    )}

                ${renderFilterSelect(
        "leadsMonthFilter",
        "Month"
    )}

                ${renderFilterSelect(
        "leadsQualityFilter",
        "Lead Quality"
    )}

                ${renderFilterSelect(
        "leadsSourceFilter",
        "Lead Source"
    )}

                ${renderFilterSelect(
        "leadsStateFilter",
        "State"
    )}

                ${renderFilterSelect(
        "leadsOwnerFilter",
        "Owner"
    )}
            </div>
        </section>
    `;
}

function renderFilterSelect(id, label) {
    return `
        <label class="block">
            <span
                class="
                    mb-1.5
                    block
                    text-xs
                    font-medium
                    text-slate-500
                "
            >
                ${escapeHtml(label)}
            </span>

            <select
                id="${id}"
                class="${UI.select}"
            >
                <option value="all">
                    All ${escapeHtml(label)}
                </option>
            </select>
        </label>
    `;
}

// ============================================================
// Hero
// ============================================================

function renderLeadsHero() {
    return `
        <section
            class="
                relative
                mb-6
                overflow-hidden
                rounded-3xl
                border border-slate-200/80
                bg-gradient-to-br
                from-slate-950
                via-slate-900
                to-blue-950
                p-6
                text-white
                shadow-lg
                sm:p-8
            "
        >
            <div
                class="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-48
                    w-48
                    rounded-full
                    bg-blue-500/20
                    blur-3xl
                "
            ></div>

            <div class="relative">
                <div
                    class="
                        mb-3
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border border-white/10
                        bg-white/10
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-blue-100
                    "
                >
                    <i
                        data-lucide="users"
                        class="h-3.5 w-3.5"
                    ></i>

                    Lead & application intelligence
                </div>

                <h1
                    class="
                        text-2xl
                        font-bold
                        tracking-tight
                        sm:text-3xl
                    "
                >
                    Leads, applications and admissions.
                </h1>

                <p
                    id="leadsScope"
                    class="
                        mt-2
                        text-sm
                        text-slate-300
                    "
                >
                    All Academic Years
                </p>
            </div>
        </section>
    `;
}

// ============================================================
// KPI Shell
// ============================================================

function renderLeadKpis() {
    return `
        <section
            id="leadKpis"
            class="
                mb-6
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        ></section>
    `;
}

// ============================================================
// KPI Card
// ============================================================

function renderKpiCard(
    label,
    value,
    icon,
    tone = "slate"
) {
    const tones = {
        slate:
            "bg-slate-100 text-slate-700",
        blue:
            "bg-blue-50 text-blue-600",
        emerald:
            "bg-emerald-50 text-emerald-600",
        amber:
            "bg-amber-50 text-amber-600",
        violet:
            "bg-violet-50 text-violet-600",
        rose:
            "bg-rose-50 text-rose-600"
    };

    return `
        <article class="${UI.kpiCard} p-5">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p
                        class="
                            text-xs
                            font-medium
                            text-slate-500
                        "
                    >
                        ${escapeHtml(label)}
                    </p>

                    <p class="${UI.kpiValue}">
                        ${escapeHtml(value)}
                    </p>
                </div>

                <div
                    class="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${tones[tone] || tones.slate}
                    "
                >
                    <i
                        data-lucide="${icon}"
                        class="h-5 w-5"
                    ></i>
                </div>
            </div>
        </article>
    `;
}

// ============================================================
// Sections
// ============================================================

function renderYearSection() {
    return `
        <section class="${UI.cardStatic} mb-6 p-5 sm:p-6">
            <div class="mb-5">
                <h2 class="${UI.sectionTitle}">
                    Year-wise Leads, Applications & Admissions
                </h2>

                <p class="${UI.muted} mt-1">
                    Academic-year performance and year-over-year growth.
                </p>
            </div>

            <div
                id="leadYearTable"
                class="overflow-x-auto"
            ></div>
        </section>
    `;
}

function renderCounterSection() {
    return `
        <section class="${UI.cardStatic} mb-6 p-5 sm:p-6">
            <div
                class="
                    mb-5
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2 class="${UI.sectionTitle}">
                        Counter-wise Leads & Applications
                    </h2>

                    <p class="${UI.muted} mt-1">
                        Counter-level view; not divided by LeadSubstage.
                    </p>
                </div>
            </div>

            <div
                id="counterTable"
                class="overflow-x-auto"
            ></div>
        </section>
    `;
}

function renderMonthlySection() {
    return `
        <section class="${UI.cardStatic} mb-6 p-5 sm:p-6">
            <div class="mb-5">
                <h2 class="${UI.sectionTitle}">
                    Monthly Performance
                </h2>

                <p class="${UI.muted} mt-1">
                    Monthly leads, applications, admissions and conversion.
                </p>
            </div>

            <div
                id="monthlyLeadTable"
                class="overflow-x-auto"
            ></div>
        </section>
    `;
}

function renderStateSection() {
    return `
        <section class="${UI.cardStatic} mb-6 p-5 sm:p-6">
            <div class="mb-5">
                <h2 class="${UI.sectionTitle}">
                    State-wise Performance
                </h2>

                <p class="${UI.muted} mt-1">
                    Lead, application and admission performance by state.
                </p>
            </div>

            <div
                id="leadStateTable"
                class="overflow-x-auto"
            ></div>
        </section>
    `;
}

// ============================================================
// Filter Initialization
// ============================================================

function initializeLeadsFilters() {
    populateLeadFilterOptions();

    [
        "leadsYearFilter",
        "leadsMonthFilter",
        "leadsQualityFilter",
        "leadsSourceFilter",
        "leadsStateFilter",
        "leadsOwnerFilter"
    ].forEach(id => {
        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "change",
            renderLeadsData
        );
    });

    const resetButton =
        document.getElementById(
            "leadsResetFilters"
        );

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            resetLeadFilters
        );
    }
}

// ============================================================
// Populate Filters
// ============================================================

function populateLeadFilterOptions() {
    fillSelect(
        "leadsYearFilter",
        YEARS,
        "All Academic Years"
    );

    fillSelect(
        "leadsMonthFilter",
        MONTHS,
        "All Months"
    );

    const allRecords =
        YEARS.flatMap(
            year => getRecords(year)
        );

    fillSelect(
        "leadsQualityFilter",
        uniqueSorted(
            allRecords.map(
                record => record.quality
            )
        ),
        "All Lead Quality"
    );

    fillSelect(
        "leadsSourceFilter",
        uniqueSorted(
            allRecords.map(
                record => record.source
            )
        ),
        "All Lead Sources"
    );

    fillSelect(
        "leadsStateFilter",
        uniqueSorted(
            allRecords.map(
                record => record.state
            )
        ),
        "All States"
    );

    fillSelect(
        "leadsOwnerFilter",
        uniqueSorted(
            allRecords.map(
                record => record.owner
            )
        ),
        "All Owners"
    );
}

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
            .map(
                value => `
                    <option value="${escapeHtml(value)}">
                        ${escapeHtml(value)}
                    </option>
                `
            )
            .join("")}
    `;

    const exists =
        [...select.options].some(
            option =>
                option.value === currentValue
        );

    select.value =
        exists
            ? currentValue
            : "all";
}

function uniqueSorted(values) {
    return [
        ...new Set(
            values
                .map(
                    value =>
                        String(
                            value ?? ""
                        ).trim()
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

// ============================================================
// Filter State
// ============================================================

function getLeadFilters() {
    return {
        year:
            document.getElementById(
                "leadsYearFilter"
            )?.value || "all",

        month:
            document.getElementById(
                "leadsMonthFilter"
            )?.value || "all",

        quality:
            document.getElementById(
                "leadsQualityFilter"
            )?.value || "all",

        source:
            document.getElementById(
                "leadsSourceFilter"
            )?.value || "all",

        state:
            document.getElementById(
                "leadsStateFilter"
            )?.value || "all",

        owner:
            document.getElementById(
                "leadsOwnerFilter"
            )?.value || "all"
    };
}

function resetLeadFilters() {
    [
        "leadsYearFilter",
        "leadsMonthFilter",
        "leadsQualityFilter",
        "leadsSourceFilter",
        "leadsStateFilter",
        "leadsOwnerFilter"
    ].forEach(id => {
        const element =
            document.getElementById(id);

        if (element) {
            element.value = "all";
        }
    });

    renderLeadsData();
}

// ============================================================
// Records
// ============================================================

function getRecords(year) {
    const rows =
        dashboardData[
        LEAD_SHEETS[year]
        ] || [];

    const cached =
        recordsCache[year];

    if (
        cached &&
        cached.rows === rows
    ) {
        return cached.records;
    }

    const records =
        rows.map(row =>
            normalizeLeadRecord(row)
        );

    recordsCache[year] = {
        rows,
        records
    };

    return records;
}

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
// Date Parser
// ============================================================

function parseSheetDate(value) {

    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime())
            ? null
            : value;
    }

    let text = String(value).trim();

    if (!text) {
        return null;
    }

    // Remove wrapping quotes if GViz returns them
    text = text.replace(/^['"]|['"]$/g, "").trim();


    // ========================================================
    // Google Visualization Date format
    // Date(2026,8,14,21,53,0)
    // ========================================================

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


    // ========================================================
    // DD/MM/YY or DD/MM/YYYY
    // Example: 1/8/26 22:55
    // ========================================================

    const slashDate =
        text.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
        );

    if (slashDate) {

        const day =
            Number(slashDate[1]);

        const month =
            Number(slashDate[2]);

        let year =
            Number(slashDate[3]);

        const hour =
            Number(slashDate[4] || 0);

        const minute =
            Number(slashDate[5] || 0);

        const second =
            Number(slashDate[6] || 0);

        if (year < 100) {
            year += 2000;
        }

        return new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second
        );
    }


    // ========================================================
    // DD-MM-YY or DD-MM-YYYY
    // Example: 14-09-2026 21:53
    // ========================================================

    const dashDate =
        text.match(
            /^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
        );

    if (dashDate) {

        const day =
            Number(dashDate[1]);

        const month =
            Number(dashDate[2]);

        let year =
            Number(dashDate[3]);

        const hour =
            Number(dashDate[4] || 0);

        const minute =
            Number(dashDate[5] || 0);

        const second =
            Number(dashDate[6] || 0);

        if (year < 100) {
            year += 2000;
        }

        return new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second
        );
    }


    // ========================================================
    // Final fallback
    // ========================================================

    const parsed =
        new Date(text);

    return Number.isNaN(parsed.getTime())
        ? null
        : parsed;
}

// ============================================================
// Active / Filtered Records
// ============================================================

function getActiveYears() {
    const filters =
        getLeadFilters();

    return filters.year === "all"
        ? [...YEARS]
        : [filters.year];
}

function getFilteredRecords(
    year,
    options = {}
) {
    const filters =
        getLeadFilters();

    const records =
        getRecords(year);

    return records.filter(record => {
        if (
            filters.month !== "all" &&
            options.transactionMonth
        ) {
            if (
                record.transactionMonth !==
                filters.month
            ) {
                return false;
            }
        } else if (
            filters.month !== "all"
        ) {
            if (
                record.month !==
                filters.month
            ) {
                return false;
            }
        }

        if (
            filters.quality !== "all" &&
            normalize(
                record.quality
            ) !==
            normalize(
                filters.quality
            )
        ) {
            return false;
        }

        if (
            filters.source !== "all" &&
            normalize(
                record.source
            ) !==
            normalize(
                filters.source
            )
        ) {
            return false;
        }

        if (
            filters.state !== "all" &&
            normalize(
                record.state
            ) !==
            normalize(
                filters.state
            )
        ) {
            return false;
        }

        if (
            filters.owner !== "all" &&
            normalize(
                record.owner
            ) !==
            normalize(
                filters.owner
            )
        ) {
            return false;
        }

        return true;
    });
}

function getLeadRecords(year) {
    return getFilteredRecords(
        year,
        {
            transactionMonth: false
        }
    );
}

function getApplicationRecords(year) {
    return getFilteredRecords(
        year,
        {
            transactionMonth: true
        }
    ).filter(
        record =>
            record.transactionDate
    );
}

// ============================================================
// Metrics
// ============================================================

function calculateMetrics(year) {
    const leads =
        getLeadRecords(year);

    const applications =
        getApplicationRecords(year);

    const interview =
        applications.filter(
            record =>
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Interview Done"
                )
        ).length;

    const offer =
        applications.filter(
            record =>
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Offer Sent"
                )
        ).length;

    const full =
        applications.filter(
            record =>
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Full Fee Paid"
                )
        ).length;

    const partial =
        applications.filter(
            record =>
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Partial Fee Paid"
                )
        ).length;

    const registered =
        applications.filter(
            record =>
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Registered"
                )
        ).length;

    const refund =
        applications.filter(
            record =>
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Refund"
                )
        ).length;

    const admissions =
        full +
        partial +
        registered;

    const net =
        admissions -
        refund;

    return {
        leads: leads.length,
        applications: applications.length,
        interview,
        offer,
        full,
        partial,
        registered,
        refund,
        admissions,
        net,

        conversion:
            leads.length
                ? (
                    applications.length /
                    leads.length
                ) * 100
                : 0,

        appToAdm:
            applications.length
                ? (
                    admissions /
                    applications.length
                ) * 100
                : 0,

        appToInterview:
            applications.length
                ? (
                    interview /
                    applications.length
                ) * 100
                : 0
    };
}

function getCombinedMetrics(years) {
    const output = {
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
        const metrics =
            calculateMetrics(year);

        Object.keys(output).forEach(
            key => {
                output[key] +=
                    metrics[key] || 0;
            }
        );
    });

    output.conversion =
        output.leads
            ? (
                output.applications /
                output.leads
            ) * 100
            : 0;

    output.appToAdm =
        output.applications
            ? (
                output.admissions /
                output.applications
            ) * 100
            : 0;

    output.appToInterview =
        output.applications
            ? (
                output.interview /
                output.applications
            ) * 100
            : 0;

    return output;
}

// ============================================================
// Main Data Renderer
// ============================================================

function renderLeadsData() {
    const filters =
        getLeadFilters();

    const years =
        getActiveYears();

    const metrics =
        getCombinedMetrics(years);

    renderScope(
        filters,
        years
    );

    renderKpis(metrics);
    renderYearTable(years);
    renderCounterTable(years);
    renderMonthlyTable(years);
    renderStateTable(years);

    initializeIcons();
}

// ============================================================
// Scope
// ============================================================

function renderScope(
    filters,
    years
) {
    const parts = [];

    if (filters.year === "all") {
        parts.push("All Academic Years");
    } else {
        parts.push(
            filters.year.replace(
                "-",
                "–"
            )
        );
    }

    if (filters.month !== "all") {
        parts.push(filters.month);
    }

    if (filters.quality !== "all") {
        parts.push(
            `Quality: ${filters.quality}`
        );
    }

    if (filters.source !== "all") {
        parts.push(
            `Source: ${filters.source}`
        );
    }

    if (filters.state !== "all") {
        parts.push(
            `State: ${filters.state}`
        );
    }

    if (filters.owner !== "all") {
        parts.push(
            `Owner: ${filters.owner}`
        );
    }

    const element =
        document.getElementById(
            "leadsScope"
        );

    if (element) {
        element.textContent =
            parts.join(" · ");
    }
}

// ============================================================
// KPI Rendering
// ============================================================

function renderKpis(metrics) {
    const container =
        document.getElementById(
            "leadKpis"
        );

    if (!container) {
        return;
    }

    container.innerHTML = [
        renderKpiCard(
            "Leads",
            formatNumber(
                metrics.leads
            ),
            "users",
            "blue"
        ),

        renderKpiCard(
            "Applications",
            formatNumber(
                metrics.applications
            ),
            "file-check-2",
            "violet"
        ),

        renderKpiCard(
            "Lead → Application",
            formatPercent(
                metrics.conversion
            ),
            "arrow-right",
            "emerald"
        ),

        renderKpiCard(
            "Admissions",
            formatNumber(
                metrics.admissions
            ),
            "graduation-cap",
            "emerald"
        ),

        renderKpiCard(
            "Interview Done",
            formatNumber(
                metrics.interview
            ),
            "messages-square",
            "blue"
        ),

        renderKpiCard(
            "Offer Sent",
            formatNumber(
                metrics.offer
            ),
            "send",
            "violet"
        ),

        renderKpiCard(
            "Partial Fee Paid",
            formatNumber(
                metrics.partial
            ),
            "wallet-cards",
            "amber"
        ),

        renderKpiCard(
            "Registered",
            formatNumber(
                metrics.registered
            ),
            "badge-check",
            "emerald"
        ),

        renderKpiCard(
            "Refund",
            formatNumber(
                metrics.refund
            ),
            "undo-2",
            "rose"
        ),

        renderKpiCard(
            "Net Admissions (After Refund)",
            formatNumber(
                metrics.net
            ),
            "trending-up",
            "emerald"
        ),

        renderKpiCard(
            "Application → Admissions",
            formatPercent(
                metrics.appToAdm
            ),
            "arrow-right",
            "emerald"
        ),

        renderKpiCard(
            "Application → Interview",
            formatPercent(
                metrics.appToInterview
            ),
            "arrow-right",
            "blue"
        )
    ].join("");
}

// ============================================================
// Year-wise Table
// ============================================================

function renderYearTable(years) {
    const container =
        document.getElementById(
            "leadYearTable"
        );

    if (!container) {
        return;
    }

    let previous = null;

    const rows =
        years.map(year => {
            const metrics =
                calculateMetrics(year);

            const leadGrowth =
                previous
                    ? calculateGrowth(
                        previous.leads,
                        metrics.leads
                    )
                    : null;

            const applicationGrowth =
                previous
                    ? calculateGrowth(
                        previous.applications,
                        metrics.applications
                    )
                    : null;

            const row = `
                <tr>
                    <td class="font-medium text-slate-900">
                        ${escapeHtml(
                year.replace(
                    "-",
                    "–"
                )
            )}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.leads
            )}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.applications
            )}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.admissions
            )}
                    </td>

                    <td class="text-right">
                        ${formatPercent(
                metrics.conversion
            )}
                    </td>

                    <td class="text-right">
                        ${leadGrowth === null
                    ? "—"
                    : formatGrowth(
                        leadGrowth
                    )
                }
                    </td>

                    <td class="text-right">
                        ${applicationGrowth === null
                    ? "—"
                    : formatGrowth(
                        applicationGrowth
                    )
                }
                    </td>
                </tr>
            `;

            previous = metrics;

            return row;
        }).join("");

    container.innerHTML =
        renderTable(
            [
                "Academic Year",
                "Leads",
                "Applications",
                "Admissions",
                "Lead → Application %",
                "Lead Growth %",
                "Application Growth %"
            ],
            rows
        );
}

// ============================================================
// Counter Table
// ============================================================

function renderCounterTable(years) {
    const container =
        document.getElementById(
            "counterTable"
        );

    if (!container) {
        return;
    }

    const counterMap = {};

    years.forEach(year => {
        getLeadRecords(year)
            .forEach(record => {
                const counter =
                    record.counter ||
                    "Unassigned";

                counterMap[counter] ??= {
                    leads: 0,
                    applications: 0
                };

                counterMap[
                    counter
                ].leads++;
            });

        getApplicationRecords(year)
            .forEach(record => {
                const counter =
                    record.counter ||
                    "Unassigned";

                counterMap[counter] ??= {
                    leads: 0,
                    applications: 0
                };

                counterMap[
                    counter
                ].applications++;
            });
    });

    const rows =
        Object.entries(counterMap)
            .sort(
                (a, b) =>
                    b[1].leads -
                    a[1].leads
            )
            .map(
                ([counter, value]) => `
                    <tr>
                        <td class="font-medium text-slate-900">
                            ${escapeHtml(
                    counter
                )}
                        </td>

                        <td class="text-right">
                            ${formatNumber(
                    value.leads
                )}
                        </td>

                        <td class="text-right">
                            ${formatNumber(
                    value.applications
                )}
                        </td>

                        <td class="text-right">
                            ${formatPercent(
                    value.leads
                        ? (
                            value.applications /
                            value.leads
                        ) * 100
                        : 0
                )}
                        </td>
                    </tr>
                `
            )
            .join("");

    container.innerHTML =
        renderTable(
            [
                "Counter",
                "Leads",
                "Applications",
                "Lead → Application %"
            ],
            rows
        );
}

// ============================================================
// Monthly Table
// ============================================================

function renderMonthlyTable(years) {
    const container =
        document.getElementById(
            "monthlyLeadTable"
        );

    if (!container) {
        return;
    }

    const rows =
        MONTHS.map(month => {
            const metrics =
                monthMetricsAllYears(
                    years,
                    month
                );

            return `
                <tr>
                    <td class="font-medium text-slate-900">
                        ${escapeHtml(month)}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.leads
            )}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.applications
            )}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.admissions
            )}
                    </td>

                    <td class="text-right">
                        ${formatNumber(
                metrics.net
            )}
                    </td>

                    <td class="text-right">
                        ${formatPercent(
                metrics.conversion
            )}
                    </td>
                </tr>
            `;
        }).join("");

    container.innerHTML =
        renderTable(
            [
                "Month",
                "Leads",
                "Applications",
                "Admissions",
                "Net Admissions",
                "Lead → Application %"
            ],
            rows
        );
}

function monthMetricsAllYears(
    years,
    month
) {
    const output = {
        leads: 0,
        applications: 0,
        admissions: 0,
        net: 0
    };

    years.forEach(year => {
        const records =
            getRecords(year);

        const leads =
            records.filter(
                record =>
                    record.month ===
                    month &&
                    matchesNonMonthFilters(
                        record
                    )
            );

        const applications =
            records.filter(
                record =>
                    record.transactionDate &&
                    record.transactionMonth ===
                    month &&
                    matchesNonMonthFilters(
                        record
                    )
            );

        output.leads +=
            leads.length;

        output.applications +=
            applications.length;

        output.admissions +=
            applications.filter(
                isAdmission
            ).length;

        output.net +=
            applications.filter(
                isAdmission
            ).length -
            applications.filter(
                isRefund
            ).length;
    });

    output.conversion =
        output.leads
            ? (
                output.applications /
                output.leads
            ) * 100
            : 0;

    return output;
}

// ============================================================
// State Table
// ============================================================

function renderStateTable(years) {
    const container =
        document.getElementById(
            "leadStateTable"
        );

    if (!container) {
        return;
    }

    const stateMap = {};

    years.forEach(year => {
        getLeadRecords(year)
            .forEach(record => {
                const state =
                    cleanText(
                        record.state
                    ) || "Unknown";

                stateMap[state] ??= {
                    leads: 0,
                    applications: 0,
                    admissions: 0
                };

                stateMap[state].leads++;
            });

        getApplicationRecords(year)
            .forEach(record => {
                const state =
                    cleanText(
                        record.state
                    ) || "Unknown";

                stateMap[state] ??= {
                    leads: 0,
                    applications: 0,
                    admissions: 0
                };

                stateMap[
                    state
                ].applications++;

                if (
                    isAdmission(record)
                ) {
                    stateMap[
                        state
                    ].admissions++;
                }
            });
    });

    const rows =
        Object.entries(stateMap)
            .sort((a, b) => b[1].leads - a[1].leads).map(
                ([state, value]) => `
                    <tr>
                        <td class="font-medium text-slate-900">
                            ${escapeHtml(state)}
                        </td>

                        <td class="text-right">
                            ${formatNumber(
                    value.leads
                )}
                        </td>

                        <td class="text-right">
                            ${formatNumber(
                    value.applications
                )}
                        </td>

                        <td class="text-right">
                            ${formatNumber(
                    value.admissions
                )}
                        </td>

                        <td class="text-right">
                            ${formatPercent(
                    value.leads
                        ? (
                            value.applications /
                            value.leads
                        ) * 100
                        : 0
                )}
                        </td>

                        <td class="text-right">
                            ${formatPercent(
                    value.applications
                        ? (
                            value.admissions /
                            value.applications
                        ) * 100
                        : 0
                )}
                        </td>
                    </tr>
                `
            )
            .join("");

    container.innerHTML =
        renderTable(
            [
                "State",
                "Leads",
                "Applications",
                "Admissions",
                "Lead → Application %",
                "Application → Admission %"
            ],
            rows
        );
}

// ============================================================
// Shared Table Renderer
// ============================================================

function renderTable(
    headers,
    rows
) {
    if (!rows) {
        return renderEmptyTable();
    }

    return `
        <div class="min-w-[760px]">
            <table
                class="
                    w-full
                    border-collapse
                    text-sm
                "
            >
                <thead>
                    <tr
                        class="
                            border-b
                            border-slate-200
                            text-left
                        "
                    >
                        ${headers
            .map(
                header => `
                                    <th
                                        class="
                                            whitespace-nowrap
                                            px-4
                                            py-3
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                            first:pl-0
                                            last:pr-0
                                        "
                                    >
                                        ${escapeHtml(
                    header
                )}
                                    </th>
                                `
            )
            .join("")}
                    </tr>
                </thead>

                <tbody
                    class="
                        divide-y
                        divide-slate-100
                    "
                >
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function renderEmptyTable() {
    return `
        <div class="py-12 text-center">
            <i
                data-lucide="inbox"
                class="
                    mx-auto
                    mb-2
                    h-6
                    w-6
                    text-slate-300
                "
            ></i>

            <p class="text-sm text-slate-500">
                No data available.
            </p>
        </div>
    `;
}

// ============================================================
// Matching Helpers
// ============================================================

function matchesNonMonthFilters(
    record
) {
    const filters =
        getLeadFilters();

    return (
        (
            filters.quality === "all" ||
            normalize(
                record.quality
            ) ===
            normalize(
                filters.quality
            )
        ) &&

        (
            filters.source === "all" ||
            normalize(
                record.source
            ) ===
            normalize(
                filters.source
            )
        ) &&

        (
            filters.state === "all" ||
            normalize(
                record.state
            ) ===
            normalize(
                filters.state
            )
        ) &&

        (
            filters.owner === "all" ||
            normalize(
                record.owner
            ) ===
            normalize(
                filters.owner
            )
        )
    );
}

function isAdmission(record) {
    return [
        "Full Fee Paid",
        "Partial Fee Paid",
        "Registered"
    ].some(
        stage =>
            normalize(
                record.stage
            ) ===
            normalize(stage)
    );
}

function isRefund(record) {
    return (
        normalize(
            record.stage
        ) ===
        normalize("Refund")
    );
}

// ============================================================
// Formatting Helpers
// ============================================================

function normalize(value) {
    return String(
        value ?? ""
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .toLowerCase();
}

function cleanText(value) {
    return String(
        value ?? ""
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}

function calculateGrowth(
    previous,
    current
) {
    if (
        !previous ||
        previous === 0
    ) {
        return null;
    }

    return (
        (
            current -
            previous
        ) /
        previous
    ) * 100;
}

function formatGrowth(value) {
    if (value === null) {
        return "—";
    }

    const formatted =
        formatPercent(
            Math.abs(value)
        );

    if (value > 0) {
        return `+${formatted}`;
    }

    if (value < 0) {
        return `-${formatted}`;
    }

    return formatted;
}