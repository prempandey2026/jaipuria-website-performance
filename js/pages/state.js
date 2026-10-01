// ============================================================
// State Performance
// ============================================================

import {
    dashboardData
} from "../data.js";

import {
    UI,
    initializeIcons,
    animatePageContent,
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
let selectedMonth = "all";

let recordsCache = new Map();

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
// Render Page
// ============================================================

export function renderStatePage() {

    const pageContent =
        document.getElementById(
            "pageContent"
        );

    if (!pageContent) {
        return;
    }

    selectedYear = "all";
    selectedMonth = "all";

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
                        Geographic performance
                    </div>

                    <h1
                        class="
                            text-2xl
                            font-bold
                            tracking-tight
                            sm:text-3xl
                        "
                    >
                        State performance.
                    </h1>

                    <p
                        id="stateScope"
                        class="
                            mt-2
                            text-sm
                            text-slate-300
                        "
                    ></p>

                </div>


                <div
                    class="
                        grid
                        w-full
                        gap-3
                        sm:grid-cols-2
                        lg:w-auto
                    "
                >

                    <div>

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
                            Academic Year
                        </label>

                        <select
                            id="stateYear"
                            class="
                                w-full
                                min-w-52
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
                        >

                            <option
                                value="all"
                            >
                                All Years
                            </option>

                            ${YEARS.map(
        year => `
                                    <option
                                        value="${year}"
                                    >
                                        ${formatYear(
            year
        )}
                                    </option>
                                `
    ).join("")}

                        </select>

                    </div>


                    <div>

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
                            Month
                        </label>

                        <select
                            id="stateMonth"
                            class="
                                w-full
                                min-w-52
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
                        >

                            <option
                                value="all"
                            >
                                All Months
                            </option>

                            ${MONTHS.map(
        month => `
                                    <option
                                        value="${month}"
                                    >
                                        ${month}
                                    </option>
                                `
    ).join("")}

                        </select>

                    </div>

                </div>

            </div>

        </section>


        <!-- ================================================== -->
        <!-- KPIs -->
        <!-- ================================================== -->

        <section
            id="stateKpis"
            class="
                mb-6
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            "
        ></section>


        <!-- ================================================== -->
        <!-- State Performance -->
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
                    State-wise Performance
                </h2>

                <p
                    class="
                        mt-1
                        text-xs
                        text-slate-500
                    "
                >
                    Leads are based on Created On.
                    Applications and Admissions are based
                    on Transaction Date.
                </p>

            </div>

            <div
                id="stateTable"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- City Performance -->
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
                    City Performance
                </h2>

            </div>

            <div
                id="cityTable"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- State Traffic -->
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
                    with the immediately previous academic year.
                </p>

            </div>

            <div
                id="stateTrafficComparison"
                class="overflow-x-auto"
            ></div>

        </section>


        <!-- ================================================== -->
        <!-- City Traffic -->
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
                    Organic and Direct traffic compared
                    with the immediately previous academic year.
                </p>

            </div>

            <div
                id="cityTrafficComparison"
                class="overflow-x-auto"
            ></div>

        </section>

    `;

    initializeStateFilters();

    renderStateData();

    initializeIcons();
    animatePageContent();
}


// ============================================================
// Filters
// ============================================================

function initializeStateFilters() {

    const yearSelect =
        document.getElementById(
            "stateYear"
        );

    const monthSelect =
        document.getElementById(
            "stateMonth"
        );


    yearSelect?.addEventListener(
        "change",
        event => {

            selectedYear =
                event.target.value ||
                "all";

            renderStateData();
        }
    );


    monthSelect?.addEventListener(
        "change",
        event => {

            selectedMonth =
                event.target.value ||
                "all";

            renderStateData();
        }
    );
}


// ============================================================
// Main Renderer
// ============================================================

function renderStateData() {

    const activeYears =
        getActiveYears();


    updateScope(
        activeYears
    );


    const metrics =
        calculateOverallMetrics(
            activeYears
        );


    renderKpis(
        metrics
    );


    renderStateTable(
        activeYears
    );


    renderCityTable(
        activeYears
    );


    renderStateTrafficComparison(
        getComparisonPair()
    );


    renderCityTrafficComparison(
        getComparisonPair()
    );


    initializeIcons();
}


// ============================================================
// Active Years
// ============================================================

function getActiveYears() {

    return selectedYear === "all"
        ? [...YEARS]
        : [selectedYear];
}


// ============================================================
// Comparison Pair
// ============================================================

function getComparisonPair() {

    const currentYear =
        selectedYear === "all"
            ? YEARS[
            YEARS.length - 1
            ]
            : selectedYear;


    const index =
        YEARS.indexOf(
            currentYear
        );


    return {

        current:
            currentYear,

        previous:
            index > 0
                ? YEARS[index - 1]
                : null

    };
}


// ============================================================
// Scope
// ============================================================

function updateScope(
    activeYears
) {

    const element =
        document.getElementById(
            "stateScope"
        );

    if (!element) {
        return;
    }


    const yearText =
        selectedYear === "all"
            ? "All academic years"
            : formatYear(
                selectedYear
            );


    const monthText =
        selectedMonth === "all"
            ? "All months"
            : selectedMonth;


    element.textContent =
        `Showing ${yearText} · ${monthText}`;
}


// ============================================================
// Records
// ============================================================

function getRecords(
    year
) {

    if (
        recordsCache.has(
            year
        )
    ) {

        return recordsCache.get(
            year
        );
    }


    const rows =
        dashboardData[
        LEAD_SHEETS[year]
        ] || [];


    const records =
        rows.map(
            normalizeLeadRecord
        );


    recordsCache.set(
        year,
        records
    );


    return records;
}


// ============================================================
// Normalize Lead Record
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

        createdMonth:
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

        state:
            String(
                row[
                "Correspondence State"
                ] ||
                "Unknown"
            ).trim(),

        city:
            String(
                row[
                "Correspondence City"
                ] ||
                "Unknown"
            ).trim(),

        stage:
            String(
                row[
                "Lead Stage"
                ] ||
                "Unknown"
            ).trim()

    };
}


// ============================================================
// Filter Records
// ============================================================

function getFilteredRecords(
    year
) {

    const records =
        getRecords(
            year
        );


    if (
        selectedMonth === "all"
    ) {

        return records;
    }


    return records.filter(
        record =>
            normalize(
                record.createdMonth
            ) ===
            normalize(
                selectedMonth
            )
            ||
            normalize(
                record.transactionMonth
            ) ===
            normalize(
                selectedMonth
            )
    );
}


// ============================================================
// Overall Metrics
// ============================================================

function calculateOverallMetrics(
    years
) {

    let leads = 0;
    let applications = 0;
    let admissions = 0;


    years.forEach(
        year => {

            const records =
                getFilteredRecords(
                    year
                );


            records.forEach(
                record => {

                    if (
                        selectedMonth ===
                        "all" ||
                        normalize(
                            record.createdMonth
                        ) ===
                        normalize(
                            selectedMonth
                        )
                    ) {

                        leads++;
                    }


                    if (
                        record.transactionDate &&
                        (
                            selectedMonth ===
                            "all" ||
                            normalize(
                                record.transactionMonth
                            ) ===
                            normalize(
                                selectedMonth
                            )
                        )
                    ) {

                        applications++;


                        if (
                            isAdmission(
                                record
                            )
                        ) {

                            admissions++;
                        }
                    }

                }
            );

        }
    );


    return {

        leads,

        applications,

        admissions,

        conversion:
            leads
                ? (
                    applications /
                    leads
                ) * 100
                : 0

    };
}


// ============================================================
// KPI Render
// ============================================================

function renderKpis(
    metrics
) {

    const container =
        document.getElementById(
            "stateKpis"
        );

    if (!container) {
        return;
    }


    container.innerHTML = [

        renderKpi(
            "Leads",
            formatNumber(
                metrics.leads
            ),
            "users"
        ),

        renderKpi(
            "Applications",
            formatNumber(
                metrics.applications
            ),
            "file-check-2"
        ),

        renderKpi(
            "Lead → Application",
            formatPercent(
                metrics.conversion
            ),
            "percent"
        ),

        renderKpi(
            "Admissions",
            formatNumber(
                metrics.admissions
            ),
            "graduation-cap"
        )

    ].join("");
}


// ============================================================
// KPI Card
// ============================================================

function renderKpi(
    label,
    value,
    icon
) {

    return `

        <div
            class="${UI.kpiCard}"
        >

            <div
                class="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                <span
                    class="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                    "
                >
                    ${escapeHtml(
        label
    )}
                </span>

                <span
                    class="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-slate-600
                    "
                >
                    <i
                        data-lucide="${icon}"
                        class="h-4 w-4"
                    ></i>
                </span>

            </div>

            <div
                class="${UI.kpiValue}"
            >
                ${value}
            </div>

        </div>

    `;
}


// ============================================================
// State Map
// ============================================================

function getStateMap(
    year
) {

    const result = {};


    getRecords(
        year
    ).forEach(
        record => {

            if (
                selectedMonth !== "all" &&
                normalize(
                    record.createdMonth
                ) !==
                normalize(
                    selectedMonth
                ) &&
                normalize(
                    record.transactionMonth
                ) !==
                normalize(
                    selectedMonth
                )
            ) {
                return;
            }


            const state =
                record.state ||
                "Unknown";


            result[state] ??= {

                leads: 0,

                applications: 0,

                admissions: 0

            };


            if (
                selectedMonth ===
                "all" ||
                normalize(
                    record.createdMonth
                ) ===
                normalize(
                    selectedMonth
                )
            ) {

                result[
                    state
                ].leads++;
            }


            if (
                record.transactionDate &&
                (
                    selectedMonth ===
                    "all" ||
                    normalize(
                        record.transactionMonth
                    ) ===
                    normalize(
                        selectedMonth
                    )
                )
            ) {

                result[
                    state
                ].applications++;


                if (
                    isAdmission(
                        record
                    )
                ) {

                    result[
                        state
                    ].admissions++;
                }
            }

        }
    );


    return result;
}


// ============================================================
// City Map
// ============================================================

function getCityMap(
    year
) {

    const result = {};


    getRecords(
        year
    ).forEach(
        record => {

            if (
                selectedMonth !== "all" &&
                normalize(
                    record.createdMonth
                ) !==
                normalize(
                    selectedMonth
                ) &&
                normalize(
                    record.transactionMonth
                ) !==
                normalize(
                    selectedMonth
                )
            ) {
                return;
            }


            const city =
                record.city ||
                "Unknown";


            result[city] ??= {

                leads: 0,

                applications: 0,

                admissions: 0

            };


            if (
                selectedMonth ===
                "all" ||
                normalize(
                    record.createdMonth
                ) ===
                normalize(
                    selectedMonth
                )
            ) {

                result[
                    city
                ].leads++;
            }


            if (
                record.transactionDate &&
                (
                    selectedMonth ===
                    "all" ||
                    normalize(
                        record.transactionMonth
                    ) ===
                    normalize(
                        selectedMonth
                    )
                )
            ) {

                result[
                    city
                ].applications++;


                if (
                    isAdmission(
                        record
                    )
                ) {

                    result[
                        city
                    ].admissions++;
                }
            }

        }
    );


    return result;
}


// ============================================================
// State Table
// ============================================================

function renderStateTable(
    years
) {

    const container =
        document.getElementById(
            "stateTable"
        );

    if (!container) {
        return;
    }


    const maps =
        Object.fromEntries(
            years.map(
                year => [
                    year,
                    getStateMap(
                        year
                    )
                ]
            )
        );


    const names = [
        ...new Set(
            years.flatMap(
                year =>
                    Object.keys(
                        maps[
                        year
                        ]
                    )
            )
        )
    ];


    names.sort(
        (a, b) =>
            years.reduce(
                (
                    total,
                    year
                ) =>
                    total +
                    (
                        maps[
                            year
                        ][b]?.leads ||
                        0
                    ),
                0
            )
            -
            years.reduce(
                (
                    total,
                    year
                ) =>
                    total +
                    (
                        maps[
                            year
                        ][a]?.leads ||
                        0
                    ),
                0
            )
    );


    if (
        selectedYear === "all"
    ) {

        const header =
            years.map(
                year => `
                    <th
                        colspan="5"
                        class="
                            px-4
                            py-3
                            text-right
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        ${formatYear(
                    year
                )}
                    </th>
                `
            ).join("");


        const subHeader =
            years.map(
                () => `
                    <th>Leads</th>
                    <th>Applications</th>
                    <th>Admissions</th>
                    <th>Lead → App %</th>
                    <th>App → Admission %</th>
                `
            ).join("");


        const rows =
            names.map(
                state => {

                    return `

                        <tr
                            class="
                                border-t
                                border-slate-100
                                hover:bg-slate-50/70
                            "
                        >

                            <td
                                class="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    font-medium
                                    text-slate-800
                                "
                            >
                                ${escapeHtml(
                        state
                    )}
                            </td>

                            ${years.map(
                        year => {

                            const value =
                                maps[
                                year
                                ][
                                state
                                ] || {
                                    leads: 0,
                                    applications: 0,
                                    admissions: 0
                                };


                            return `

                                        <td>${formatNumber(
                                value.leads
                            )}</td>

                                        <td>${formatNumber(
                                value.applications
                            )}</td>

                                        <td>${formatNumber(
                                value.admissions
                            )}</td>

                                        <td>${formatPercent(
                                value.leads
                                    ? (
                                        value.applications /
                                        value.leads
                                    ) * 100
                                    : 0
                            )}</td>

                                        <td>${formatPercent(
                                value.applications
                                    ? (
                                        value.admissions /
                                        value.applications
                                    ) * 100
                                    : 0
                            )}</td>

                                    `;
                        }
                    ).join("")}

                        </tr>

                    `;
                }
            ).join("");


        container.innerHTML =
            renderTable(
                `
                    <tr>
                        <th rowspan="2">
                            State
                        </th>
                        ${header}
                    </tr>

                    <tr>
                        ${subHeader}
                    </tr>
                `,
                rows
            );

        return;
    }


    const year =
        years[0];


    const map =
        maps[
        year
        ] || {};


    const rows =
        names.map(
            state => {

                const value =
                    map[
                    state
                    ] || {
                        leads: 0,
                        applications: 0,
                        admissions: 0
                    };


                return `

                    <tr
                        class="
                            border-t
                            border-slate-100
                            hover:bg-slate-50/70
                        "
                    >

                        <td
                            class="
                                px-4
                                py-3
                                font-medium
                                text-slate-800
                            "
                        >
                            ${escapeHtml(
                    state
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    value.leads
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    value.applications
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    value.admissions
                )}
                        </td>

                        <td>
                            ${formatPercent(
                    value.leads
                        ? (
                            value.applications /
                            value.leads
                        ) * 100
                        : 0
                )}
                        </td>

                        <td>
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

                `;
            }
        ).join("");


    container.innerHTML =
        renderTable(
            `
                <tr>

                    <th>
                        State
                    </th>

                    <th>
                        Leads
                    </th>

                    <th>
                        Applications
                    </th>

                    <th>
                        Admissions
                    </th>

                    <th>
                        Lead → App %
                    </th>

                    <th>
                        App → Admission %
                    </th>

                </tr>
            `,
            rows
        );
}


// ============================================================
// City Table
// ============================================================

function renderCityTable(
    years
) {

    const container =
        document.getElementById(
            "cityTable"
        );

    if (!container) {
        return;
    }


    const maps =
        Object.fromEntries(
            years.map(
                year => [
                    year,
                    getCityMap(
                        year
                    )
                ]
            )
        );


    const names = [
        ...new Set(
            years.flatMap(
                year =>
                    Object.keys(
                        maps[
                        year
                        ]
                    )
            )
        )
    ];


    names.sort(
        (a, b) =>
            years.reduce(
                (
                    total,
                    year
                ) =>
                    total +
                    (
                        maps[
                            year
                        ][b]?.leads ||
                        0
                    ),
                0
            )
            -
            years.reduce(
                (
                    total,
                    year
                ) =>
                    total +
                    (
                        maps[
                            year
                        ][a]?.leads ||
                        0
                    ),
                0
            )
    );


    const year =
        years.length === 1
            ? years[0]
            : null;


    if (!year) {

        const rows =
            names.map(
                city => {

                    const cells =
                        years.map(
                            activeYear => {

                                const value =
                                    maps[
                                    activeYear
                                    ][
                                    city
                                    ] || {
                                        leads: 0,
                                        applications: 0,
                                        admissions: 0
                                    };


                                return `

                                    <td>
                                        ${formatNumber(
                                    value.leads
                                )}
                                    </td>

                                    <td>
                                        ${formatNumber(
                                    value.applications
                                )}
                                    </td>

                                    <td>
                                        ${formatNumber(
                                    value.admissions
                                )}
                                    </td>

                                `;
                            }
                        ).join("");


                    return `

                        <tr
                            class="
                                border-t
                                border-slate-100
                                hover:bg-slate-50/70
                            "
                        >

                            <td>
                                ${escapeHtml(
                        city
                    )}
                            </td>

                            ${cells}

                        </tr>

                    `;
                }
            ).join("");


        const headers =
            years.map(
                activeYear => `
                    <th
                        colspan="3"
                    >
                        ${formatYear(
                    activeYear
                )}
                    </th>
                `
            ).join("");


        const subHeaders =
            years.map(
                () => `
                    <th>Leads</th>
                    <th>Applications</th>
                    <th>Admissions</th>
                `
            ).join("");


        container.innerHTML =
            renderTable(
                `
                    <tr>
                        <th rowspan="2">
                            City
                        </th>
                        ${headers}
                    </tr>

                    <tr>
                        ${subHeaders}
                    </tr>
                `,
                rows
            );

        return;
    }


    const map =
        maps[
        year
        ] || {};


    const rows =
        names.map(
            city => {

                const value =
                    map[
                    city
                    ] || {
                        leads: 0,
                        applications: 0,
                        admissions: 0
                    };


                return `

                    <tr
                        class="
                            border-t
                            border-slate-100
                            hover:bg-slate-50/70
                        "
                    >

                        <td>
                            ${escapeHtml(
                    city
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    value.leads
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    value.applications
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    value.admissions
                )}
                        </td>

                    </tr>

                `;
            }
        ).join("");


    container.innerHTML =
        renderTable(
            `
                <tr>

                    <th>
                        City
                    </th>

                    <th>
                        Leads
                    </th>

                    <th>
                        Applications
                    </th>

                    <th>
                        Admissions
                    </th>

                </tr>
            `,
            rows
        );
}


// ============================================================
// State Traffic Comparison
// ============================================================

function renderStateTrafficComparison(
    pair
) {

    const container =
        document.getElementById(
            "stateTrafficComparison"
        );

    if (!container) {
        return;
    }


    if (!pair.previous) {

        container.innerHTML =
            renderEmpty(
                "No previous academic year is available for comparison."
            );

        return;
    }


    const names =
        getGeoNames(
            "states",
            pair.current,
            pair.previous
        );


    names.sort(
        (a, b) => {

            const aTotal =
                getGeoValue(
                    "states",
                    "organic",
                    pair.current,
                    a
                ) +
                getGeoValue(
                    "states",
                    "direct",
                    pair.current,
                    a
                );


            const bTotal =
                getGeoValue(
                    "states",
                    "organic",
                    pair.current,
                    b
                ) +
                getGeoValue(
                    "states",
                    "direct",
                    pair.current,
                    b
                );


            return bTotal - aTotal;
        }
    );


    const rows =
        names.map(
            state => {

                const currentOrganic =
                    getGeoValue(
                        "states",
                        "organic",
                        pair.current,
                        state
                    );

                const previousOrganic =
                    getGeoValue(
                        "states",
                        "organic",
                        pair.previous,
                        state
                    );

                const currentDirect =
                    getGeoValue(
                        "states",
                        "direct",
                        pair.current,
                        state
                    );

                const previousDirect =
                    getGeoValue(
                        "states",
                        "direct",
                        pair.previous,
                        state
                    );


                const currentTotal =
                    currentOrganic +
                    currentDirect;

                const previousTotal =
                    previousOrganic +
                    previousDirect;


                return `

                    <tr
                        class="
                            border-t
                            border-slate-100
                            hover:bg-slate-50/70
                        "
                    >

                        <td>
                            ${escapeHtml(
                    state
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    currentOrganic
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    previousOrganic
                )}
                        </td>

                        <td>
                            ${renderGrowth(
                    growth(
                        previousOrganic,
                        currentOrganic
                    )
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    currentDirect
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    previousDirect
                )}
                        </td>

                        <td>
                            ${renderGrowth(
                    growth(
                        previousDirect,
                        currentDirect
                    )
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    currentTotal
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    previousTotal
                )}
                        </td>

                        <td>
                            ${renderGrowth(
                    growth(
                        previousTotal,
                        currentTotal
                    )
                )}
                        </td>

                    </tr>

                `;
            }
        ).join("");


    container.innerHTML =
        renderTable(
            `
                <tr>

                    <th>
                        State
                    </th>

                    <th>
                        ${formatYear(
                pair.current
            )} Organic
                    </th>

                    <th>
                        ${formatYear(
                pair.previous
            )} Organic
                    </th>

                    <th>
                        Organic YoY %
                    </th>

                    <th>
                        ${formatYear(
                pair.current
            )} Direct
                    </th>

                    <th>
                        ${formatYear(
                pair.previous
            )} Direct
                    </th>

                    <th>
                        Direct YoY %
                    </th>

                    <th>
                        ${formatYear(
                pair.current
            )} Traffic
                    </th>

                    <th>
                        ${formatYear(
                pair.previous
            )} Traffic
                    </th>

                    <th>
                        Traffic YoY %
                    </th>

                </tr>
            `,
            rows
        );
}


// ============================================================
// City Traffic Comparison
// ============================================================

function renderCityTrafficComparison(
    pair
) {

    const container =
        document.getElementById(
            "cityTrafficComparison"
        );

    if (!container) {
        return;
    }


    if (!pair.previous) {

        container.innerHTML =
            renderEmpty(
                "No previous academic year is available for comparison."
            );

        return;
    }


    const names =
        getGeoNames(
            "cities",
            pair.current,
            pair.previous
        );


    names.sort(
        (a, b) => {

            const aTotal =
                getGeoValue(
                    "cities",
                    "organic",
                    pair.current,
                    a
                ) +
                getGeoValue(
                    "cities",
                    "direct",
                    pair.current,
                    a
                );


            const bTotal =
                getGeoValue(
                    "cities",
                    "organic",
                    pair.current,
                    b
                ) +
                getGeoValue(
                    "cities",
                    "direct",
                    pair.current,
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
            (city, index) => {

                const currentOrganic =
                    getGeoValue(
                        "cities",
                        "organic",
                        pair.current,
                        city
                    );

                const previousOrganic =
                    getGeoValue(
                        "cities",
                        "organic",
                        pair.previous,
                        city
                    );

                const currentDirect =
                    getGeoValue(
                        "cities",
                        "direct",
                        pair.current,
                        city
                    );

                const previousDirect =
                    getGeoValue(
                        "cities",
                        "direct",
                        pair.previous,
                        city
                    );


                const currentTotal =
                    currentOrganic +
                    currentDirect;

                const previousTotal =
                    previousOrganic +
                    previousDirect;


                return `

                    <tr
                        class="
                            border-t
                            border-slate-100
                            hover:bg-slate-50/70
                        "
                    >

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHtml(
                    city
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    currentOrganic
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    previousOrganic
                )}
                        </td>

                        <td>
                            ${renderGrowth(
                    growth(
                        previousOrganic,
                        currentOrganic
                    )
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    currentDirect
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    previousDirect
                )}
                        </td>

                        <td>
                            ${renderGrowth(
                    growth(
                        previousDirect,
                        currentDirect
                    )
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    currentTotal
                )}
                        </td>

                        <td>
                            ${formatNumber(
                    previousTotal
                )}
                        </td>

                        <td>
                            ${renderGrowth(
                    growth(
                        previousTotal,
                        currentTotal
                    )
                )}
                        </td>

                    </tr>

                `;
            }
        ).join("");


    container.innerHTML =
        renderTable(
            `
                <tr>

                    <th>
                        Rank
                    </th>

                    <th>
                        City
                    </th>

                    <th>
                        ${formatYear(
                pair.current
            )} Organic
                    </th>

                    <th>
                        ${formatYear(
                pair.previous
            )} Organic
                    </th>

                    <th>
                        Organic YoY %
                    </th>

                    <th>
                        ${formatYear(
                pair.current
            )} Direct
                    </th>

                    <th>
                        ${formatYear(
                pair.previous
            )} Direct
                    </th>

                    <th>
                        Direct YoY %
                    </th>

                    <th>
                        ${formatYear(
                pair.current
            )} Traffic
                    </th>

                    <th>
                        ${formatYear(
                pair.previous
            )} Traffic
                    </th>

                    <th>
                        Traffic YoY %
                    </th>

                </tr>
            `,
            rows
        );
}


// ============================================================
// Geographic Data
// ============================================================

function getGeoData(
    type,
    channel
) {

    if (
        geoCache[
        type
        ][
        channel
        ]
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
                ) === "total"
            ) {

                return;
            }


            const columns =
                Object.keys(
                    row
                );


            columns.forEach(
                (column, index) => {

                    const year =
                        findYearInText(
                            column
                        );


                    if (!year) {
                        return;
                    }


                    const value =
                        toNumber(
                            row[
                            column
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
                        year
                    ][
                        name
                    ] =
                        (
                            result[
                            year
                            ][
                            name
                            ] || 0
                        ) + value;
                }
            );

        }
    );


    /*
     * Fallback for the workbook layout where each
     * academic-year block occupies two columns and
     * starts at fixed offsets.
     */
    if (
        Object.values(
            result
        ).every(
            year =>
                Object.keys(
                    year
                ).length === 0
        )
    ) {

        parseGeoBlocks(
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
// Geo Block Parser
// ============================================================

function parseGeoBlocks(
    rows,
    result
) {

    const starts = {

        "2026-27": 0,

        "2025-26": 10,

        "2024-25": 20

    };


    Object.entries(
        starts
    ).forEach(
        ([year, start]) => {

            rows.forEach(
                row => {

                    const values =
                        Object.values(
                            row
                        );


                    const name =
                        String(
                            values[
                            start
                            ] ?? ""
                        ).trim();


                    if (
                        !name ||
                        normalize(
                            name
                        ) === "total"
                    ) {
                        return;
                    }


                    const value =
                        toNumber(
                            values[
                            start + 1
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
                        year
                    ][
                        name
                    ] =
                        (
                            result[
                            year
                            ][
                            name
                            ] || 0
                        ) + value;

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
                normalize(
                    name
                )
        );


    return match
        ? match[1]
        : 0;
}


// ============================================================
// Admission
// ============================================================

function isAdmission(
    record
) {

    const stage =
        normalize(
            record.stage
        );


    return [

        "full fee paid",

        "partial fee paid",

        "registered"

    ].includes(
        stage
    );
}


// ============================================================
// Table Renderer
// ============================================================

function renderTable(
    header,
    rows
) {

    if (!rows) {

        return renderEmpty(
            "No data available."
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

                ${header}

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

    `;
}


// ============================================================
// Empty State
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
    ) * 100;
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


    return `
        <span
            class="
                font-semibold
                ${value >= 0
            ? "text-emerald-600"
            : "text-red-500"
        }
            "
        >
            ${value >= 0
            ? "+"
            : ""
        }${value.toFixed(1)}%
        </span>
    `;
}


// ============================================================
// Helpers
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


function findYearInText(
    value
) {

    const text =
        String(
            value ?? ""
        );


    const match =
        text.match(
            /(2024-25|2025-26|2026-27)/
        );


    return match
        ? match[1]
        : null;
}


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
// Cache
// ============================================================

function invalidateCaches() {

    recordsCache =
        new Map();


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