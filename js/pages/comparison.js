// ============================================================
// Year Comparison
// ============================================================

import {
    dashboardData
} from "../data.js";

import {
    UI,
    initializeIcons,
    animatePageContent,
    formatNumber,
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

const TRAFFIC_SHEET =
    "Jaipuria - All Traffic";

const GEO_SHEETS = {
    states: {
        organic:
            "Organic Traffic by States",
        direct:
            "Direct Traffic by States"
    },

    cities: {
        organic:
            "Organic Traffic by Cities",
        direct:
            "Direct Traffic by Cities"
    }
};

// ============================================================
// State
// ============================================================

let selectedYear = "all";

let leadCache = new Map();

let trafficCache = null;

let geoCache = {
    states: {
        organic: null,
        direct: null
    },
    cities: {
        organic: null,
        direct: null
    }
};

// ============================================================
// Page
// ============================================================

export function renderComparisonPage() {

    const pageContent =
        document.getElementById(
            "pageContent"
        );

    if (!pageContent) {
        return;
    }

    selectedYear = "all";

    invalidateCaches();

    pageContent.innerHTML = `

        <!-- ================================================== -->
        <!-- Hero -->
        <!-- ================================================== -->

        <section
            class="
                mb-6
                rounded-3xl
                border border-slate-200/80
                bg-gradient-to-br
                from-slate-900
                via-slate-800
                to-slate-900
                p-6
                text-white
                shadow-lg
            "
        >

            <div
                class="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                "
            >

                <div>

                    <div
                        class="
                            mb-2
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-blue-300
                        "
                    >
                        Year-over-year view
                    </div>

                    <h1
                        class="
                            text-2xl
                            font-bold
                            tracking-tight
                            sm:text-3xl
                        "
                    >
                        Academic year comparison.
                    </h1>

                    <p
                        id="comparisonScope"
                        class="
                            mt-2
                            text-sm
                            text-slate-300
                        "
                    ></p>

                </div>

                <div
                    class="
                        w-full
                        sm:w-64
                    "
                >

                    <label
                        class="
                            mb-1.5
                            block
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Compare Academic Year
                    </label>

                    <select
                        id="comparisonYear"
                        class="
                            w-full
                            rounded-xl
                            border
                            border-white/15
                            bg-white/10
                            px-3.5
                            py-2.5
                            text-sm
                            text-white
                            outline-none
                            transition
                            focus:border-blue-400
                            focus:ring-4
                            focus:ring-blue-500/10
                        "
                    ></select>

                </div>

            </div>

        </section>


        <!-- ================================================== -->
        <!-- 1. Annual Summary -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                mb-6
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    Leads, Applications & Net Admissions
                </h2>

            </div>

            <div
                id="comparisonSummary"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- 2. Monthly Leads & Applications -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                mb-6
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    Monthly Leads & Applications Comparison
                </h2>

            </div>

            <div
                id="monthlyComparison"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- 3. Funnel -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                mb-6
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    Conversion Funnel by Academic Year
                </h2>

            </div>

            <div
                id="comparisonFunnel"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- 4. Website Traffic -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                mb-6
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    Website Traffic by Year
                </h2>

            </div>

            <div
                id="yearTrafficTable"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- 5. Monthly Traffic -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                mb-6
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    Monthly Traffic MoM & YoY Comparison
                </h2>

            </div>

            <div
                id="comparisonTrafficMonthly"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- 6. State Traffic -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                mb-6
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    State-wise Traffic Comparison
                </h2>

                <p
                    class="
                        mt-1
                        text-xs
                        text-slate-500
                    "
                >
                    Organic and Direct traffic compared
                    with the immediately previous
                    academic year.
                </p>

            </div>

            <div
                id="comparisonStateTraffic"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- 7. City Traffic -->
        <!-- ================================================== -->

        <section
            class="
                ${UI.cardStatic}
                overflow-hidden
            "
        >

            <div class="p-5 pb-3">

                <h2
                    class="${UI.sectionTitle}"
                >
                    Top 50 Cities – Traffic Comparison
                </h2>

                <p
                    class="
                        mt-1
                        text-xs
                        text-slate-500
                    "
                >
                    Ranked by current academic-year
                    Organic + Direct traffic.
                </p>

            </div>

            <div
                id="comparisonCityTraffic"
                class="overflow-x-auto"
            ></div>

        </section>

    `;

    initializeComparisonFilters();

    renderComparisonData();

    initializeIcons();
    animatePageContent();
}


// ============================================================
// Filters
// ============================================================

function initializeComparisonFilters() {

    const select =
        document.getElementById(
            "comparisonYear"
        );

    if (!select) {
        return;
    }

    select.innerHTML = `
        <option value="all">
            Latest Academic Year vs Previous
        </option>

        ${YEARS.map(
        year => `
                <option value="${year}">
                    ${year.replace("-", "–")}
                    vs previous year
                </option>
            `
    ).join("")}
    `;

    select.value = "all";

    select.addEventListener(
        "change",
        event => {

            selectedYear =
                event.target.value ||
                "all";

            renderComparisonData();
        }
    );
}


// ============================================================
// Main Renderer
// ============================================================

function renderComparisonData() {

    const currentYear =
        getCurrentYear();

    const previousYear =
        getPreviousYear(
            currentYear
        );

    updateScope(
        currentYear,
        previousYear
    );

    const currentMetrics =
        getSelectionMetrics(
            currentYear
        );

    const previousMetrics =
        previousYear
            ? getSelectionMetrics(
                previousYear
            )
            : null;

    renderAnnualSummary(
        currentYear,
        previousYear,
        currentMetrics,
        previousMetrics
    );

    renderMonthlyComparison(
        currentYear,
        previousYear
    );

    renderFunnelComparison(
        currentYear,
        previousYear,
        currentMetrics,
        previousMetrics
    );

    renderYearTraffic(
        currentYear,
        previousYear
    );

    renderMonthlyTraffic(
        currentYear,
        previousYear
    );

    renderStateTraffic(
        currentYear,
        previousYear
    );

    renderCityTraffic(
        currentYear,
        previousYear
    );

    initializeIcons();
}


// ============================================================
// Year Pair
// ============================================================

function getCurrentYear() {

    if (
        selectedYear !== "all"
    ) {
        return selectedYear;
    }

    return YEARS[
        YEARS.length - 1
    ];
}


function getPreviousYear(
    year
) {

    const index =
        YEARS.indexOf(
            year
        );

    return index > 0
        ? YEARS[index - 1]
        : null;
}


// ============================================================
// Scope
// ============================================================

function updateScope(
    currentYear,
    previousYear
) {

    const element =
        document.getElementById(
            "comparisonScope"
        );

    if (!element) {
        return;
    }

    if (previousYear) {

        element.textContent =
            `Comparing ${formatYear(
                currentYear
            )} vs ${formatYear(
                previousYear
            )} · exact same periods`;

    } else {

        element.textContent =
            `Showing ${formatYear(
                currentYear
            )} · no earlier academic year available`;
    }
}


// ============================================================
// Lead Records
// ============================================================

function getLeadRecords(
    year
) {

    if (
        leadCache.has(
            year
        )
    ) {
        return leadCache.get(
            year
        );
    }

    const rows =
        dashboardData[
        LEAD_SHEETS[year]
        ] || [];


    const records =
        rows.map(
            row =>
                normalizeLeadRecord(
                    row
                )
        );


    leadCache.set(
        year,
        records
    );

    return records;
}


// ============================================================
// Lead Normalization
// ============================================================

function normalizeLeadRecord(
    row
) {

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
// Selection Metrics
// ============================================================

function getSelectionMetrics(
    year
) {

    const leads =
        getLeadRecords(
            year
        );

    const transactions =
        leads.filter(
            record =>
                Boolean(
                    record.transactionDate
                )
        );


    return calculateMetrics(
        leads,
        transactions
    );
}


// ============================================================
// Monthly Metrics
// ============================================================

function getMonthMetrics(
    year,
    month
) {

    const records =
        getLeadRecords(
            year
        );


    const monthlyLeads =
        records.filter(
            record =>
                normalize(
                    record.month
                ) ===
                normalize(
                    month
                )
        );


    const monthlyTransactions =
        records.filter(
            record =>
                normalize(
                    record.transactionMonth
                ) ===
                normalize(
                    month
                )
        );


    return calculateMetrics(
        monthlyLeads,
        monthlyTransactions
    );
}


// ============================================================
// Metrics
// ============================================================

function calculateMetrics(
    leads,
    transactions
) {

    const metrics = {

        leads:
            leads.length,

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


    leads.forEach(
        record => {

            if (
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Interview Done"
                )
            ) {

                metrics.interview++;
            }


            if (
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Offer Sent"
                )
            ) {

                metrics.offer++;
            }
        }
    );


    transactions.forEach(
        record => {

            metrics.applications++;


            if (
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Full Fee Paid"
                )
            ) {

                metrics.full++;
            }


            if (
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Partial Fee Paid"
                )
            ) {

                metrics.partial++;
            }


            if (
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Registered"
                )
            ) {

                metrics.registered++;
            }


            if (
                normalize(
                    record.stage
                ) ===
                normalize(
                    "Refund"
                )
            ) {

                metrics.refund++;
            }

        }
    );


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


    return metrics;
}


// ============================================================
// 1. Annual Summary
// ============================================================

function renderAnnualSummary(
    currentYear,
    previousYear,
    current,
    previous
) {

    const container =
        document.getElementById(
            "comparisonSummary"
        );

    if (!container) {
        return;
    }


    const rows = [

        [
            "Leads",
            current.leads,
            previous?.leads
        ],

        [
            "Applications",
            current.applications,
            previous?.applications
        ],

        [
            "Admissions",
            current.admissions,
            previous?.admissions
        ],

        [
            "Net Admissions",
            current.net,
            previous?.net
        ]

    ];


    container.innerHTML =
        renderComparisonTable(
            [
                "Metric",
                formatYear(
                    currentYear
                ),
                previousYear
                    ? formatYear(
                        previousYear
                    )
                    : "Previous Year",
                "YoY Growth %"
            ],
            rows.map(
                row => [

                    row[0],

                    formatNumber(
                        row[1]
                    ),

                    row[2] == null
                        ? "—"
                        : formatNumber(
                            row[2]
                        ),

                    row[2] == null
                        ? "—"
                        : renderGrowth(
                            growth(
                                row[2],
                                row[1]
                            )
                        )

                ]
            )
        );

    appendNote(
        container,
        "YoY = current academic year compared with the exact same academic-year period in the immediately previous year."
    );
}


// ============================================================
// 2. Monthly Leads & Applications
// ============================================================

function renderMonthlyComparison(
    currentYear,
    previousYear
) {

    const container =
        document.getElementById(
            "monthlyComparison"
        );

    if (!container) {
        return;
    }


    const rows =
        MONTHS.map(
            month => {

                const current =
                    getMonthMetrics(
                        currentYear,
                        month
                    );

                const previous =
                    previousYear
                        ? getMonthMetrics(
                            previousYear,
                            month
                        )
                        : null;


                return [

                    month,

                    formatNumber(
                        current.leads
                    ),

                    previous
                        ? formatNumber(
                            previous.leads
                        )
                        : "—",

                    previous
                        ? renderGrowth(
                            growth(
                                previous.leads,
                                current.leads
                            )
                        )
                        : "—",

                    formatNumber(
                        current.applications
                    ),

                    previous
                        ? formatNumber(
                            previous.applications
                        )
                        : "—",

                    previous
                        ? renderGrowth(
                            growth(
                                previous.applications,
                                current.applications
                            )
                        )
                        : "—"

                ];
            }
        );


    container.innerHTML =
        renderComparisonTable(
            [
                "Month",
                `${formatYear(
                    currentYear
                )} Leads`,
                previousYear
                    ? `${formatYear(
                        previousYear
                    )} Leads`
                    : "Previous Leads",
                "Lead YoY %",
                `${formatYear(
                    currentYear
                )} Applications`,
                previousYear
                    ? `${formatYear(
                        previousYear
                    )} Applications`
                    : "Previous Applications",
                "Application YoY %"
            ],
            rows
        );


    appendNote(
        container,
        "Leads use Created On. Applications use Transaction Date. Each month is compared with the same month in the previous academic year."
    );
}


// ============================================================
// 3. Funnel
// ============================================================

function renderFunnelComparison(
    currentYear,
    previousYear,
    current,
    previous
) {

    const container =
        document.getElementById(
            "comparisonFunnel"
        );

    if (!container) {
        return;
    }


    const funnel = [

        [
            "Leads",
            "leads"
        ],

        [
            "Applications",
            "applications"
        ],

        [
            "Interview Done",
            "interview"
        ],

        [
            "Offer Sent",
            "offer"
        ],

        [
            "Full Fee Paid",
            "full"
        ],

        [
            "Partial Fee Paid",
            "partial"
        ],

        [
            "Registered",
            "registered"
        ],

        [
            "Admissions",
            "admissions"
        ],

        [
            "Refund",
            "refund"
        ],

        [
            "Net Admissions",
            "net"
        ]

    ];


    const rows =
        funnel.map(
            ([label, key]) => [

                label,

                formatNumber(
                    current[key] || 0
                ),

                previous
                    ? formatNumber(
                        previous[key] || 0
                    )
                    : "—",

                previous
                    ? renderGrowth(
                        growth(
                            previous[key] || 0,
                            current[key] || 0
                        )
                    )
                    : "—"

            ]
        );


    container.innerHTML =
        renderComparisonTable(
            [
                "Funnel Metric",
                formatYear(
                    currentYear
                ),
                previousYear
                    ? formatYear(
                        previousYear
                    )
                    : "Previous Year",
                "YoY Growth %"
            ],
            rows
        );
}


// ============================================================
// 4. Annual Traffic
// ============================================================

function renderYearTraffic(
    currentYear,
    previousYear
) {

    const container =
        document.getElementById(
            "yearTrafficTable"
        );

    if (!container) {
        return;
    }


    const current =
        getAnnualTraffic(
            currentYear
        );

    const previous =
        previousYear
            ? getAnnualTraffic(
                previousYear
            )
            : null;


    const rows = [

        [
            "Total Traffic",
            current.all,
            previous?.all
        ],

        [
            "Organic",
            current.organic,
            previous?.organic
        ],

        [
            "Direct",
            current.direct,
            previous?.direct
        ],

        [
            "AI Assistant",
            current.ai,
            previous?.ai
        ],

        [
            "Organic + Direct + AI",
            current.organic +
            current.direct +
            current.ai,

            previous
                ? previous.organic +
                previous.direct +
                previous.ai
                : null
        ]

    ];


    container.innerHTML =
        renderComparisonTable(
            [
                "Channel",
                formatYear(
                    currentYear
                ),
                previousYear
                    ? formatYear(
                        previousYear
                    )
                    : "Previous Year",
                "YoY Growth %"
            ],
            rows.map(
                row => [

                    row[0],

                    formatNumber(
                        row[1]
                    ),

                    row[2] == null
                        ? "—"
                        : formatNumber(
                            row[2]
                        ),

                    row[2] == null
                        ? "—"
                        : renderGrowth(
                            growth(
                                row[2],
                                row[1]
                            )
                        )

                ]
            )
        );
}


// ============================================================
// 5. Monthly Traffic
// ============================================================

function renderMonthlyTraffic(
    currentYear,
    previousYear
) {

    const container =
        document.getElementById(
            "comparisonTrafficMonthly"
        );

    if (!container) {
        return;
    }


    const rows =
        MONTHS.map(
            (month, index) => {

                const channels = [
                    "all",
                    "organic",
                    "direct",
                    "ai"
                ];


                const cells = [
                    month
                ];


                channels.forEach(
                    channel => {

                        const current =
                            getTrafficValue(
                                channel,
                                currentYear,
                                month
                            );

                        const previous =
                            previousYear
                                ? getTrafficValue(
                                    channel,
                                    previousYear,
                                    month
                                )
                                : null;


                        const previousMonth =
                            index > 0
                                ? MONTHS[
                                index - 1
                                ]
                                : null;


                        const previousMonthValue =
                            previousMonth
                                ? getTrafficValue(
                                    channel,
                                    currentYear,
                                    previousMonth
                                )
                                : null;


                        cells.push(
                            formatNumber(
                                current
                            )
                        );

                        cells.push(
                            previous == null
                                ? "—"
                                : formatNumber(
                                    previous
                                )
                        );

                        cells.push(
                            previous == null
                                ? "—"
                                : renderGrowth(
                                    growth(
                                        previous,
                                        current
                                    )
                                )
                        );

                        cells.push(
                            previousMonthValue ===
                                null
                                ? "—"
                                : renderGrowth(
                                    growth(
                                        previousMonthValue,
                                        current
                                    )
                                )
                        );
                    }
                );


                return cells;
            }
        );


    const headers = [
        "Month"
    ];


    [
        "Total Traffic",
        "Organic",
        "Direct",
        "AI Assistant"
    ].forEach(
        () => {

            headers.push(
                `${formatYear(
                    currentYear
                )}`
            );

            headers.push(
                previousYear
                    ? `${formatYear(
                        previousYear
                    )}`
                    : "Previous"
            );

            headers.push(
                "YoY %"
            );

            headers.push(
                "MoM %"
            );
        }
    );


    container.innerHTML =
        renderComparisonTable(
            headers,
            rows
        );


    appendNote(
        container,
        "YoY compares the exact same month in the previous academic year. MoM compares the selected year's month with its immediately preceding month."
    );
}


// ============================================================
// 6. State Traffic
// ============================================================

function renderStateTraffic(
    currentYear,
    previousYear
) {

    const container =
        document.getElementById(
            "comparisonStateTraffic"
        );

    if (!container) {
        return;
    }


    if (!previousYear) {

        container.innerHTML =
            renderEmpty(
                "No previous academic year is available for comparison."
            );

        return;
    }


    const names =
        getGeoNames(
            "states",
            currentYear,
            previousYear
        );


    names.sort(
        (a, b) => {

            const aTotal =
                getGeoValue(
                    "states",
                    "organic",
                    currentYear,
                    a
                ) +
                getGeoValue(
                    "states",
                    "direct",
                    currentYear,
                    a
                );


            const bTotal =
                getGeoValue(
                    "states",
                    "organic",
                    currentYear,
                    b
                ) +
                getGeoValue(
                    "states",
                    "direct",
                    currentYear,
                    b
                );


            return bTotal - aTotal;
        }
    );


    const rows =
        names.map(
            name => {

                const currentOrganic =
                    getGeoValue(
                        "states",
                        "organic",
                        currentYear,
                        name
                    );

                const previousOrganic =
                    getGeoValue(
                        "states",
                        "organic",
                        previousYear,
                        name
                    );


                const currentDirect =
                    getGeoValue(
                        "states",
                        "direct",
                        currentYear,
                        name
                    );

                const previousDirect =
                    getGeoValue(
                        "states",
                        "direct",
                        previousYear,
                        name
                    );


                const currentTotal =
                    currentOrganic +
                    currentDirect;

                const previousTotal =
                    previousOrganic +
                    previousDirect;


                return [

                    name,

                    formatNumber(
                        currentOrganic
                    ),

                    formatNumber(
                        previousOrganic
                    ),

                    renderGrowth(
                        growth(
                            previousOrganic,
                            currentOrganic
                        )
                    ),

                    formatNumber(
                        currentDirect
                    ),

                    formatNumber(
                        previousDirect
                    ),

                    renderGrowth(
                        growth(
                            previousDirect,
                            currentDirect
                        )
                    ),

                    formatNumber(
                        currentTotal
                    ),

                    formatNumber(
                        previousTotal
                    ),

                    renderGrowth(
                        growth(
                            previousTotal,
                            currentTotal
                        )
                    )

                ];
            }
        );


    container.innerHTML =
        renderComparisonTable(
            [
                "State",
                `${formatYear(
                    currentYear
                )} Organic`,
                `${formatYear(
                    previousYear
                )} Organic`,
                "Organic YoY %",
                `${formatYear(
                    currentYear
                )} Direct`,
                `${formatYear(
                    previousYear
                )} Direct`,
                "Direct YoY %",
                `${formatYear(
                    currentYear
                )} Traffic`,
                `${formatYear(
                    previousYear
                )} Traffic`,
                "Traffic YoY %"
            ],
            rows
        );
}


// ============================================================
// 7. City Traffic
// ============================================================

function renderCityTraffic(
    currentYear,
    previousYear
) {

    const container =
        document.getElementById(
            "comparisonCityTraffic"
        );

    if (!container) {
        return;
    }


    if (!previousYear) {

        container.innerHTML =
            renderEmpty(
                "No previous academic year is available for comparison."
            );

        return;
    }


    const names =
        getGeoNames(
            "cities",
            currentYear,
            previousYear
        );


    names.sort(
        (a, b) => {

            const aTotal =
                getGeoValue(
                    "cities",
                    "organic",
                    currentYear,
                    a
                ) +
                getGeoValue(
                    "cities",
                    "direct",
                    currentYear,
                    a
                );


            const bTotal =
                getGeoValue(
                    "cities",
                    "organic",
                    currentYear,
                    b
                ) +
                getGeoValue(
                    "cities",
                    "direct",
                    currentYear,
                    b
                );


            return bTotal - aTotal;
        }
    );


    const topCities =
        names.slice(
            0,
            50
        );


    const rows =
        topCities.map(
            (name, index) => {

                const currentOrganic =
                    getGeoValue(
                        "cities",
                        "organic",
                        currentYear,
                        name
                    );

                const previousOrganic =
                    getGeoValue(
                        "cities",
                        "organic",
                        previousYear,
                        name
                    );


                const currentDirect =
                    getGeoValue(
                        "cities",
                        "direct",
                        currentYear,
                        name
                    );

                const previousDirect =
                    getGeoValue(
                        "cities",
                        "direct",
                        previousYear,
                        name
                    );


                const currentTotal =
                    currentOrganic +
                    currentDirect;

                const previousTotal =
                    previousOrganic +
                    previousDirect;


                return [

                    index + 1,

                    name,

                    formatNumber(
                        currentOrganic
                    ),

                    formatNumber(
                        previousOrganic
                    ),

                    renderGrowth(
                        growth(
                            previousOrganic,
                            currentOrganic
                        )
                    ),

                    formatNumber(
                        currentDirect
                    ),

                    formatNumber(
                        previousDirect
                    ),

                    renderGrowth(
                        growth(
                            previousDirect,
                            currentDirect
                        )
                    ),

                    formatNumber(
                        currentTotal
                    ),

                    formatNumber(
                        previousTotal
                    ),

                    renderGrowth(
                        growth(
                            previousTotal,
                            currentTotal
                        )
                    )

                ];
            }
        );


    container.innerHTML =
        renderComparisonTable(
            [
                "Rank",
                "City",
                `${formatYear(
                    currentYear
                )} Organic`,
                `${formatYear(
                    previousYear
                )} Organic`,
                "Organic YoY %",
                `${formatYear(
                    currentYear
                )} Direct`,
                `${formatYear(
                    previousYear
                )} Direct`,
                "Direct YoY %",
                `${formatYear(
                    currentYear
                )} Traffic`,
                `${formatYear(
                    previousYear
                )} Traffic`,
                "Traffic YoY %"
            ],
            rows
        );


    appendNote(
        container,
        "Top 50 cities are ranked by current academic-year Organic + Direct traffic; YoY compares the exact same academic-year period."
    );
}


// ============================================================
// Traffic Data
// ============================================================

function getTrafficData() {

    if (trafficCache) {
        return trafficCache;
    }


    const rows =
        dashboardData[
        TRAFFIC_SHEET
        ] || [];


    if (!rows.length) {
        trafficCache = {};
        return trafficCache;
    }


    const headers =
        Object.keys(
            rows[0]
        );


    const result = {};


    YEARS.forEach(
        year => {

            result[year] = {};

            MONTHS.forEach(
                month => {

                    result[
                        year
                    ][month] = {

                        all: 0,
                        organic: 0,
                        direct: 0,
                        ai: 0

                    };
                }
            );
        }
    );


    const metricRows = {};


    rows.forEach(
        row => {

            const values =
                Object.values(
                    row
                );

            const label =
                normalize(
                    values[0]
                );

            metricRows[
                label
            ] = row;
        }
    );


    headers.forEach(
        header => {

            const parsed =
                parseTrafficHeader(
                    header
                );

            if (!parsed) {
                return;
            }


            const {
                year,
                month
            } = parsed;


            if (
                !result[year] ||
                !result[year][month]
            ) {
                return;
            }


            result[
                year
            ][month].all =
                findTrafficMetric(
                    metricRows,
                    [
                        "total",
                        "total traffic"
                    ],
                    header
                );


            result[
                year
            ][month].organic =
                findTrafficMetric(
                    metricRows,
                    [
                        "organic search",
                        "organic traffic",
                        "organic"
                    ],
                    header
                );


            result[
                year
            ][month].direct =
                findTrafficMetric(
                    metricRows,
                    [
                        "direct",
                        "direct traffic"
                    ],
                    header
                );


            result[
                year
            ][month].ai =
                findTrafficMetric(
                    metricRows,
                    [
                        "ai assistant",
                        "ai"
                    ],
                    header
                );
        }
    );


    trafficCache =
        result;

    return result;
}


// ============================================================
// Annual Traffic
// ============================================================

function getAnnualTraffic(
    year
) {

    const data =
        getTrafficData();


    const result = {

        all: 0,
        organic: 0,
        direct: 0,
        ai: 0

    };


    MONTHS.forEach(
        month => {

            const row =
                data[
                year
                ]?.[
                month
                ];


            if (!row) {
                return;
            }


            result.all +=
                row.all || 0;

            result.organic +=
                row.organic || 0;

            result.direct +=
                row.direct || 0;

            result.ai +=
                row.ai || 0;
        }
    );


    return result;
}


// ============================================================
// Single Traffic Value
// ============================================================

function getTrafficValue(
    channel,
    year,
    month
) {

    return (
        getTrafficData()
        ?.[year]
        ?.[month]
        ?.[channel]
        || 0
    );
}


// ============================================================
// Traffic Header
// ============================================================

function parseTrafficHeader(
    value
) {

    const text =
        String(
            value ?? ""
        )
            .trim()
            .replace(
                /'/g,
                ""
            );


    const match =
        text.match(
            /^([A-Za-z]{3})(\d{2})$/
        );


    if (!match) {
        return null;
    }


    const monthMap = {

        Aug: "August",
        Sep: "September",
        Oct: "October",
        Nov: "November",
        Dec: "December",
        Jan: "January",
        Feb: "February",
        Mar: "March",
        Apr: "April",
        May: "May",
        Jun: "June",
        Jul: "July"

    };


    const month =
        monthMap[
        match[1]
        ];


    if (!month) {
        return null;
    }


    const calendarYear =
        2000 +
        Number(
            match[2]
        );


    const year =
        [
            "August",
            "September",
            "October",
            "November",
            "December"
        ].includes(
            month
        )
            ? `${calendarYear}-${String(
                calendarYear + 1
            ).slice(-2)}`
            : `${calendarYear - 1}-${String(
                calendarYear
            ).slice(-2)}`;


    return {
        month,
        year
    };
}


// ============================================================
// Traffic Metric Lookup
// ============================================================

function findTrafficMetric(
    metricRows,
    labels,
    column
) {

    for (
        const label
        of labels
    ) {

        const row =
            metricRows[
            normalize(
                label
            )
            ];


        if (row) {

            return toNumber(
                row[column]
            );
        }
    }


    return 0;
}


// ============================================================
// Geographic Data
// ============================================================

function getGeoData(
    type,
    channel
) {

    if (
        geoCache[type][channel]
    ) {

        return geoCache[
            type
        ][
            channel
        ];
    }


    const rows =
        dashboardData[
        GEO_SHEETS[
        type
        ][
        channel
        ]
        ] || [];


    const result = {};


    YEARS.forEach(
        year => {

            result[
                year
            ] = {};
        }
    );


    if (!rows.length) {

        geoCache[
            type
        ][
            channel
        ] = result;

        return result;
    }


    const headers =
        Object.keys(
            rows[0]
        );


    const yearBlocks =
        detectGeoYearBlocks(
            headers
        );


    if (
        yearBlocks.length
    ) {

        yearBlocks.forEach(
            block => {

                rows.forEach(
                    row => {

                        const name =
                            String(
                                row[
                                block.nameColumn
                                ] ?? ""
                            ).trim();


                        if (
                            !name ||
                            normalize(
                                name
                            ) ===
                            "total"
                        ) {
                            return;
                        }


                        const value =
                            toNumber(
                                row[
                                block.valueColumn
                                ]
                            );


                        if (
                            !Number.isFinite(
                                value
                            )
                        ) {
                            return;
                        }


                        result[
                            block.year
                        ][
                            name
                        ] =
                            (
                                result[
                                block.year
                                ][
                                name
                                ] || 0
                            ) + value;
                    }
                );
            }
        );

    } else {

        parseGeoFallback(
            rows,
            result
        );
    }


    geoCache[
        type
    ][
        channel
    ] = result;


    return result;
}


// ============================================================
// Geo Blocks
// ============================================================

function detectGeoYearBlocks(
    headers
) {

    const blocks = [];


    YEARS.forEach(
        year => {

            const yearText =
                year.replace(
                    "-",
                    ""
                );


            const possible =
                headers.find(
                    header =>
                        normalize(
                            header
                        ).includes(
                            normalize(
                                year
                            )
                        )
                );


            if (possible) {

                const index =
                    headers.indexOf(
                        possible
                    );


                blocks.push({

                    year,

                    nameColumn:
                        headers[
                        index
                        ],

                    valueColumn:
                        headers[
                        index + 1
                        ]

                });
            }
        }
    );


    return blocks;
}


// ============================================================
// Geo Fallback
// ============================================================

function parseGeoFallback(
    rows,
    result
) {

    rows.forEach(
        row => {

            const values =
                Object.values(
                    row
                );


            const name =
                String(
                    values[0] ?? ""
                ).trim();


            if (
                !name ||
                normalize(
                    name
                ) ===
                "total"
            ) {
                return;
            }


            YEARS.forEach(
                year => {

                    const key =
                        Object.keys(
                            row
                        ).find(
                            column =>
                                normalize(
                                    column
                                ).includes(
                                    normalize(
                                        year
                                    )
                                )
                        );


                    if (!key) {
                        return;
                    }


                    result[
                        year
                    ][
                        name
                    ] =
                        toNumber(
                            row[key]
                        );
                }
            );
        }
    );
}


// ============================================================
// Geo Names
// ============================================================

function getGeoNames(
    type,
    currentYear,
    previousYear
) {

    const names =
        new Set();


    [
        "organic",
        "direct"
    ].forEach(
        channel => {

            const current =
                getGeoData(
                    type,
                    channel
                )[
                currentYear
                ] || {};


            const previous =
                previousYear
                    ? getGeoData(
                        type,
                        channel
                    )[
                    previousYear
                    ] || {}
                    : {};


            Object.keys(
                current
            ).forEach(
                name =>
                    names.add(
                        name
                    )
            );


            Object.keys(
                previous
            ).forEach(
                name =>
                    names.add(
                        name
                    )
            );
        }
    );


    return [
        ...names
    ];
}


// ============================================================
// Geo Value
// ============================================================

function getGeoValue(
    type,
    channel,
    year,
    name
) {

    const data =
        getGeoData(
            type,
            channel
        );


    const normalizedName =
        normalize(
            name
        );


    const exact =
        data[
        year
        ]?.[
        name
        ];


    if (
        exact !== undefined
    ) {
        return exact;
    }


    const match =
        Object.entries(
            data[
            year
            ] || {}
        ).find(
            ([key]) =>
                normalize(
                    key
                ) ===
                normalizedName
        );


    return match
        ? match[1]
        : 0;
}


// ============================================================
// Table
// ============================================================

function renderComparisonTable(
    headers,
    rows
) {

    if (!rows.length) {

        return renderEmpty(
            "No data available for this selection."
        );
    }


    return `
        <table
            class="
                min-w-full
                text-sm
            "
        >

            <thead
                class="
                    bg-slate-50
                "
            >

                <tr>

                    ${headers
            .map(
                (
                    header,
                    index
                ) => `
                                <th
                                    class="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-left
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                        ${index > 0
                        ? "text-right"
                        : ""
                    }
                                    "
                                >
                                    ${escapeHtml(
                        String(
                            header
                        )
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

                ${rows
            .map(
                row => `
                            <tr
                                class="
                                    transition-colors
                                    duration-150
                                    hover:bg-slate-50/70
                                "
                            >

                                ${row
                        .map(
                            (
                                cell,
                                index
                            ) => `
                                            <td
                                                class="
                                                    whitespace-nowrap
                                                    px-4
                                                    py-3
                                                    ${index > 0
                                    ? "text-right"
                                    : ""
                                }
                                                    text-slate-700
                                                "
                                            >
                                                ${cell}
                                            </td>
                                        `
                        )
                        .join("")}

                            </tr>
                        `
            )
            .join("")}

            </tbody>

        </table>
    `;
}


// ============================================================
// Growth
// ============================================================

function growth(
    previous,
    current
) {

    const oldValue =
        Number(
            previous
        ) || 0;

    const newValue =
        Number(
            current
        ) || 0;


    if (
        oldValue === 0
    ) {

        return newValue === 0
            ? 0
            : null;
    }


    return (
        (
            newValue -
            oldValue
        ) /
        oldValue
    ) *
        100;
}


function renderGrowth(
    value
) {

    if (
        value === null ||
        !Number.isFinite(
            value
        )
    ) {

        return `
            <span
                class="
                    text-slate-400
                "
            >
                —
            </span>
        `;
    }


    const positive =
        value >= 0;


    return `
        <span
            class="
                font-semibold
                ${positive
            ? "text-emerald-600"
            : "text-red-500"
        }
            "
        >
            ${positive
            ? "+"
            : ""
        }${value.toFixed(1)}%
        </span>
    `;
}


// ============================================================
// Empty
// ============================================================

function renderEmpty(
    message
) {

    return `
        <div
            class="
                flex
                min-h-32
                items-center
                justify-center
                p-6
            "
        >

            <div
                class="
                    text-center
                "
            >

                <div
                    class="
                        mx-auto
                        mb-3
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                    "
                >

                    <i
                        data-lucide="inbox"
                        class="
                            h-5
                            w-5
                            text-slate-400
                        "
                    ></i>

                </div>

                <p
                    class="
                        text-sm
                        text-slate-500
                    "
                >
                    ${escapeHtml(
        message
    )}
                </p>

            </div>

        </div>
    `;
}


// ============================================================
// Note
// ============================================================

function appendNote(
    container,
    message
) {

    container.insertAdjacentHTML(
        "beforeend",
        `
            <p
                class="
                    border-t
                    border-slate-100
                    px-5
                    py-3
                    text-xs
                    leading-5
                    text-slate-400
                "
            >
                ${escapeHtml(
            message
        )}
            </p>
        `
    );
}


// ============================================================
// Date Parser
// ============================================================

function parseSheetDate(
    value
) {

    if (!value) {
        return null;
    }


    if (
        value instanceof Date
    ) {
        return value;
    }


    const string =
        String(
            value
        ).trim();


    const googleDate =
        string.match(
            /^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)$/
        );


    if (
        googleDate
    ) {

        return new Date(

            Number(
                googleDate[1]
            ),

            Number(
                googleDate[2]
            ),

            Number(
                googleDate[3]
            ),

            Number(
                googleDate[4] || 0
            ),

            Number(
                googleDate[5] || 0
            ),

            Number(
                googleDate[6] || 0
            )

        );
    }


    const date =
        new Date(
            string
        );


    return Number.isNaN(
        date.getTime()
    )
        ? null
        : date;
}


// ============================================================
// Utilities
// ============================================================

function normalize(
    value
) {

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


function toNumber(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return 0;
    }


    const number =
        Number(
            String(
                value
            )
                .replace(
                    /,/g,
                    ""
                )
                .replace(
                    /%/g,
                    ""
                )
                .trim()
        );


    return Number.isFinite(
        number
    )
        ? number
        : 0;
}


function formatYear(
    year
) {

    return String(
        year
    ).replace(
        "-",
        "–"
    );
}


// ============================================================
// Cache
// ============================================================

function invalidateCaches() {

    leadCache =
        new Map();

    trafficCache =
        null;

    geoCache = {

        states: {
            organic: null,
            direct: null
        },

        cities: {
            organic: null,
            direct: null
        }

    };
}