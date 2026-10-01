// ============================================================
// Projection
// ============================================================

import {
    UI,
    initializeIcons,
    animatePageContent,
    formatNumber,
    formatPercent,
    escapeHtml
} from "../utils.js";

// ============================================================
// Projection Data
// ============================================================

const PROJECTION = [
    {
        month: "August",
        leads: 100,
        applications: 0
    },
    {
        month: "September",
        leads: 270,
        applications: 8
    },
    {
        month: "October",
        leads: 150,
        applications: 8
    },
    {
        month: "November",
        leads: 350,
        applications: 50
    },
    {
        month: "December",
        leads: 525,
        applications: 140
    },
    {
        month: "January",
        leads: 475,
        applications: 195
    },
    {
        month: "February",
        leads: 635,
        applications: 95
    },
    {
        month: "March",
        leads: 390,
        applications: 110
    },
    {
        month: "April",
        leads: 325,
        applications: 68
    },
    {
        month: "May",
        leads: 480,
        applications: 60
    },
    {
        month: "June",
        leads: 450,
        applications: 55
    },
    {
        month: "July",
        leads: 350,
        applications: 21
    }
];

const PROJECTION_TRAFFIC = {
    organic: 191000,
    direct: 130000,
    combined: 321000,

    organicGrowth:
        8.628269511855269,

    directGrowth:
        12.22278813217155,

    combinedGrowth:
        10.055885075599136
};

const PREVIOUS_TRAFFIC = {
    organic: 175829,
    direct: 115841,
    combined: 291670
};

// ============================================================
// Render Projection Page
// ============================================================

export function renderProjectionPage() {

    const pageContent =
        document.getElementById(
            "pageContent"
        );

    if (!pageContent) {
        return;
    }


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
                    Planning outlook
                </div>

                <h1
                    class="
                        text-2xl
                        font-bold
                        tracking-tight
                        sm:text-3xl
                    "
                >
                    2026–27 projection.
                </h1>

                <p
                    class="
                        mt-2
                        max-w-3xl
                        text-sm
                        leading-6
                        text-slate-300
                    "
                >
                    Projection view uses the values supplied
                    in the workbook. Traffic projection is annual.
                </p>

            </div>

        </section>


        <!-- ================================================== -->
        <!-- KPI Cards -->
        <!-- ================================================== -->

        <section
            id="projectionKpis"
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
        <!-- Leads vs Applications -->
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
                    Projected Leads vs Applications
                </h2>

            </div>


            <div class="px-5 pb-5">

                <div
                    id="projectionChart"
                    class="
                        flex
                        h-72
                        items-end
                        gap-2
                        overflow-x-auto
                        border-b
                        border-slate-200
                        pb-2
                    "
                ></div>

                <div
                    id="projectionLabels"
                    class="
                        mt-3
                        grid
                        grid-cols-12
                        gap-2
                        text-center
                        text-[10px]
                        font-medium
                        text-slate-500
                    "
                ></div>


                <div
                    class="
                        mt-5
                        flex
                        flex-wrap
                        gap-x-6
                        gap-y-2
                        text-xs
                        text-slate-500
                    "
                >

                    <span
                        class="
                            inline-flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            class="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-blue-500
                            "
                        ></span>

                        Projected Leads
                    </span>


                    <span
                        class="
                            inline-flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            class="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-emerald-500
                            "
                        ></span>

                        Projected Applications
                    </span>

                </div>

            </div>

        </section>


        <!-- ================================================== -->
        <!-- Projected Traffic -->
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
                    Projected Traffic
                </h2>

            </div>


            <div
                id="projectionTrafficTable"
                class="overflow-x-auto"
            ></div>


            <p
                class="
                    px-5
                    pb-5
                    text-xs
                    leading-5
                    text-slate-500
                "
            >
                The workbook provides annual 2026–27 traffic
                projections, not monthly projected traffic.
                Monthly actual traffic and YoY comparisons are
                available on the Traffic tab.
            </p>

        </section>


        <!-- ================================================== -->
        <!-- Monthly Projection -->
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
                    Monthly Projection
                </h2>

            </div>


            <div
                id="projectionTable"
                class="overflow-x-auto"
            ></div>

        </section>

    `;


    renderProjectionData();

    initializeIcons();
    animatePageContent();
}


// ============================================================
// Render All Projection Data
// ============================================================

function renderProjectionData() {

    const totals =
        getProjectionTotals();


    renderKpis(
        totals
    );


    renderProjectionChart();

    renderTrafficTable();

    renderMonthlyTable();

    initializeIcons();
}


// ============================================================
// Projection Totals
// ============================================================

function getProjectionTotals() {

    const leads =
        PROJECTION.reduce(
            (total, item) =>
                total + item.leads,
            0
        );


    const applications =
        PROJECTION.reduce(
            (total, item) =>
                total + item.applications,
            0
        );


    const conversion =
        leads
            ? (
                applications /
                leads
            ) * 100
            : 0;


    return {

        leads,

        applications,

        conversion,

        combinedTraffic:
            PROJECTION_TRAFFIC.combined

    };
}


// ============================================================
// KPI Cards
// ============================================================

function renderKpis(
    totals
) {

    const container =
        document.getElementById(
            "projectionKpis"
        );

    if (!container) {
        return;
    }


    container.innerHTML = [

        renderKpi(
            "Projected Leads",
            formatNumber(
                totals.leads
            ),
            "users"
        ),

        renderKpi(
            "Projected Applications",
            formatNumber(
                totals.applications
            ),
            "file-check-2"
        ),

        renderKpi(
            "Projected Conversion",
            formatPercent(
                totals.conversion
            ),
            "percent"
        ),

        renderKpi(
            "Projected Organic + Direct",
            formatNumber(
                totals.combinedTraffic
            ),
            "globe-2"
        )

    ].join("");
}


// ============================================================
// KPI
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
// Projection Chart
// ============================================================

function renderProjectionChart() {

    const chart =
        document.getElementById(
            "projectionChart"
        );

    const labels =
        document.getElementById(
            "projectionLabels"
        );


    if (
        !chart ||
        !labels
    ) {
        return;
    }


    const maxValue =
        Math.max(
            ...PROJECTION.flatMap(
                item => [
                    item.leads,
                    item.applications
                ]
            ),
            1
        );


    chart.innerHTML =
        PROJECTION.map(
            item => {

                const leadHeight =
                    Math.max(
                        1,
                        (
                            item.leads /
                            maxValue
                        ) * 100
                    );


                const applicationHeight =
                    Math.max(
                        1,
                        (
                            item.applications /
                            maxValue
                        ) * 100
                    );


                return `

                    <div
                        class="
                            flex
                            min-w-16
                            flex-1
                            items-end
                            justify-center
                            gap-1
                            self-stretch
                        "
                    >

                        <div
                            class="
                                flex
                                h-full
                                w-5
                                flex-col
                                items-center
                                justify-end
                                gap-1
                            "
                        >

                            <span
                                class="
                                    text-[9px]
                                    font-semibold
                                    text-slate-500
                                "
                            >
                                ${formatNumber(
                    item.leads
                )}
                            </span>

                            <div
                                class="
                                    w-full
                                    rounded-t-lg
                                    bg-blue-500
                                    transition-all
                                    duration-500
                                    hover:opacity-80
                                "
                                style="
                                    height:${leadHeight}%
                                "
                                title="${escapeHtml(
                    item.month
                )}: ${formatNumber(
                    item.leads
                )} leads"
                            ></div>

                        </div>


                        <div
                            class="
                                flex
                                h-full
                                w-5
                                flex-col
                                items-center
                                justify-end
                                gap-1
                            "
                        >

                            <span
                                class="
                                    text-[9px]
                                    font-semibold
                                    text-slate-500
                                "
                            >
                                ${formatNumber(
                    item.applications
                )}
                            </span>

                            <div
                                class="
                                    w-full
                                    rounded-t-lg
                                    bg-emerald-500
                                    transition-all
                                    duration-500
                                    hover:opacity-80
                                "
                                style="
                                    height:${applicationHeight}%
                                "
                                title="${escapeHtml(
                    item.month
                )}: ${formatNumber(
                    item.applications
                )} applications"
                            ></div>

                        </div>

                    </div>

                `;
            }
        ).join("");


    labels.innerHTML =
        PROJECTION.map(
            item => `
                <span>
                    ${escapeHtml(
                item.month.slice(
                    0,
                    3
                )
            )}
                </span>
            `
        ).join("");
}


// ============================================================
// Traffic Table
// ============================================================

function renderTrafficTable() {

    const container =
        document.getElementById(
            "projectionTrafficTable"
        );

    if (!container) {
        return;
    }


    const rows = [

        {
            channel:
                "Organic Traffic",

            previous:
                PREVIOUS_TRAFFIC.organic,

            projection:
                PROJECTION_TRAFFIC.organic,

            growth:
                PROJECTION_TRAFFIC
                    .organicGrowth
        },

        {
            channel:
                "Direct Traffic",

            previous:
                PREVIOUS_TRAFFIC.direct,

            projection:
                PROJECTION_TRAFFIC.direct,

            growth:
                PROJECTION_TRAFFIC
                    .directGrowth
        },

        {
            channel:
                "Organic + Direct Traffic",

            previous:
                PREVIOUS_TRAFFIC.combined,

            projection:
                PROJECTION_TRAFFIC.combined,

            growth:
                PROJECTION_TRAFFIC
                    .combinedGrowth
        }

    ];


    container.innerHTML = `

        <table
            class="
                min-w-full
                text-sm
            "
        >

            <thead
                class="bg-slate-50"
            >

                <tr>

                    <th
                        class="
                            px-4
                            py-3
                            text-left
                        "
                    >
                        Traffic Channel
                    </th>

                    <th
                        class="
                            px-4
                            py-3
                            text-right
                        "
                    >
                        2025–26
                    </th>

                    <th
                        class="
                            px-4
                            py-3
                            text-right
                        "
                    >
                        2026–27 Projection
                    </th>

                    <th
                        class="
                            px-4
                            py-3
                            text-right
                        "
                    >
                        Annual Growth %
                    </th>

                </tr>

            </thead>


            <tbody
                class="
                    divide-y
                    divide-slate-100
                "
            >

                ${rows.map(
        row => `

                        <tr
                            class="
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
            row.channel
        )}
                            </td>

                            <td
                                class="
                                    px-4
                                    py-3
                                    text-right
                                    text-slate-600
                                "
                            >
                                ${formatNumber(
            row.previous
        )}
                            </td>

                            <td
                                class="
                                    px-4
                                    py-3
                                    text-right
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                ${formatNumber(
            row.projection
        )}
                            </td>

                            <td
                                class="
                                    px-4
                                    py-3
                                    text-right
                                    font-semibold
                                    text-emerald-600
                                "
                            >
                                +${row.growth.toFixed(
            2
        )}%
                            </td>

                        </tr>

                    `
    ).join("")}

            </tbody>

        </table>

    `;
}


// ============================================================
// Monthly Projection Table
// ============================================================

function renderMonthlyTable() {

    const container =
        document.getElementById(
            "projectionTable"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <table
            class="
                min-w-full
                text-sm
            "
        >

            <thead
                class="bg-slate-50"
            >

                <tr>

                    <th
                        class="
                            px-4
                            py-3
                            text-left
                        "
                    >
                        Month
                    </th>

                    <th
                        class="
                            px-4
                            py-3
                            text-right
                        "
                    >
                        Projected Leads
                    </th>

                    <th
                        class="
                            px-4
                            py-3
                            text-right
                        "
                    >
                        Applications
                    </th>

                    <th
                        class="
                            px-4
                            py-3
                            text-right
                        "
                    >
                        Lead → Application %
                    </th>

                </tr>

            </thead>


            <tbody
                class="
                    divide-y
                    divide-slate-100
                "
            >

                ${PROJECTION.map(
        item => {

            const conversion =
                item.leads
                    ? (
                        item.applications /
                        item.leads
                    ) * 100
                    : 0;


            return `

                            <tr
                                class="
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
                item.month
            )}
                                </td>

                                <td
                                    class="
                                        px-4
                                        py-3
                                        text-right
                                    "
                                >
                                    ${formatNumber(
                item.leads
            )}
                                </td>

                                <td
                                    class="
                                        px-4
                                        py-3
                                        text-right
                                    "
                                >
                                    ${formatNumber(
                item.applications
            )}
                                </td>

                                <td
                                    class="
                                        px-4
                                        py-3
                                        text-right
                                        font-semibold
                                        text-slate-700
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