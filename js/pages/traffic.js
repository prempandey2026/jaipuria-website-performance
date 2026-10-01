// ============================================================
// Traffic
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

const TRAFFIC_SHEETS = {
    all: "Jaipuria - All Traffic",
    organic: "Jaipuria - Organic Traffic",
    direct: "Jaipuria - Direct Traffic"
};

const TRAFFIC_CHANNELS = [
    ["Total Traffic", "all"],
    ["Organic", "organic"],
    ["Direct", "direct"],
    ["AI Assistant", "ai"]
];

// ============================================================
// State
// ============================================================

let selectedChannel = "all";

let trafficCache = {
    all: null,
    organic: null,
    direct: null
};

let metricCache = {
    organic: null,
    direct: null
};

// ============================================================
// Page Render
// ============================================================

export function renderTrafficPage() {

    const pageContent =
        document.getElementById(
            "pageContent"
        );

    if (!pageContent) {
        return;
    }

    selectedChannel = "all";

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
                        Website acquisition
                    </div>

                    <h1
                        class="
                            text-2xl
                            font-bold
                            tracking-tight
                            sm:text-3xl
                        "
                    >
                        Traffic performance and trends.
                    </h1>

                    <p
                        id="trafficScope"
                        class="
                            mt-2
                            text-sm
                            text-slate-300
                        "
                    >
                        All Academic Years
                    </p>

                </div>

                <div
                    class="
                        flex
                        flex-wrap
                        gap-2
                    "
                    id="trafficTabs"
                >

                    ${renderChannelTab(
        "all",
        "All Traffic",
        "globe-2",
        true
    )}

                    ${renderChannelTab(
        "organic",
        "Organic",
        "search",
        false
    )}

                    ${renderChannelTab(
        "direct",
        "Direct",
        "mouse-pointer-2",
        false
    )}

                    ${renderChannelTab(
        "ai",
        "AI Assistant",
        "bot",
        false
    )}

                </div>

            </div>

        </section>


        <!-- ================================================== -->
        <!-- Filters -->
        <!-- ================================================== -->

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
                    grid
                    gap-4
                    md:grid-cols-2
                    lg:grid-cols-[1fr_1fr_auto]
                    lg:items-end
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
                            text-slate-500
                        "
                    >
                        Academic Year
                    </label>

                    <select
                        id="trafficYear"
                        class="${UI.select}"
                    >
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
                            text-slate-500
                        "
                    >
                        Month
                    </label>

                    <select
                        id="trafficMonth"
                        class="${UI.select}"
                    >
                    </select>
                </div>


                <button
                    id="trafficReset"
                    type="button"
                    class="
                        ${UI.button}
                        ${UI.secondaryButton}
                        h-[46px]
                    "
                >
                    <i
                        data-lucide="rotate-ccw"
                        class="h-4 w-4"
                    ></i>

                    Reset
                </button>

            </div>

        </section>


        <!-- ================================================== -->
        <!-- Main Content -->
        <!-- ================================================== -->

        <div id="trafficContent">

            <!-- KPI -->
            <section
                id="trafficKpis"
                class="
                    mb-6
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-5
                "
            ></section>


            <!-- Growth KPI -->
            <section
                id="trafficGrowthKpis"
                class="
                    mb-6
                    hidden
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                "
            ></section>


            <!-- Traffic Trend -->
            <section
                class="
                    ${UI.cardStatic}
                    mb-6
                    p-5
                "
            >

                <div
                    class="
                        mb-5
                        flex
                        flex-col
                        gap-1
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div>

                        <h2
                            class="${UI.sectionTitle}"
                        >
                            Traffic Trend
                        </h2>

                        <p
                            class="
                                mt-1
                                text-xs
                                text-slate-500
                            "
                        >
                            Monthly Traffic (Sessions)
                            <span
                                id="trafficChartTitle"
                            ></span>
                        </p>

                    </div>

                </div>


                <div
                    class="
                        mb-4
                        flex
                        flex-wrap
                        gap-4
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

                        Current Academic Year
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
                                bg-slate-300
                            "
                        ></span>

                        Previous Academic Year
                    </span>

                </div>


                <div
                    id="trafficChart"
                    class="
                        overflow-x-auto
                    "
                ></div>


                <div
                    id="trafficLabels"
                    class="
                        mt-2
                        grid
                        grid-cols-12
                        gap-1
                        text-center
                        text-[10px]
                        text-slate-400
                    "
                ></div>


                <div
                    class="
                        mt-8
                        mb-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-500
                    "
                >
                    Same-Month YoY Growth %
                </div>


                <div
                    id="trafficGrowthChart"
                    class="
                        overflow-x-auto
                    "
                ></div>


                <div
                    id="trafficGrowthLabels"
                    class="
                        mt-2
                        grid
                        grid-cols-12
                        gap-1
                        text-center
                        text-[10px]
                        text-slate-400
                    "
                ></div>

            </section>


            <!-- Year-on-Year -->
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
                        Year-on-Year Traffic Comparison
                    </h2>

                </div>

                <div
                    id="trafficYoY"
                    class="overflow-x-auto"
                ></div>

            </section>


            <!-- Direct vs Organic -->
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
                        Direct vs Organic Comparison
                    </h2>

                </div>

                <div
                    id="directOrganicTable"
                    class="overflow-x-auto"
                ></div>

            </section>


            <!-- Exact Month Values -->
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
                        Exact Month-wise Traffic Values
                    </h2>

                </div>

                <div
                    id="trafficExactTable"
                    class="overflow-x-auto"
                ></div>

            </section>

        </div>

    `;

    initializeTrafficFilters();
    initializeTrafficTabs();
    renderTrafficData();

    initializeIcons();
    animatePageContent();
}


// ============================================================
// Channel Tab
// ============================================================

function renderChannelTab(
    channel,
    label,
    icon,
    active
) {

    return `
        <button
            type="button"
            class="
                traffic-channel-tab
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                px-3.5
                py-2
                text-xs
                font-semibold
                transition-all
                duration-200

                ${active
            ? "border-white bg-white text-slate-900 shadow-sm"
            : "border-white/15 bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
        }
            "
            data-channel="${channel}"
        >

            <i
                data-lucide="${icon}"
                class="h-4 w-4"
            ></i>

            ${label}

        </button>
    `;
}


// ============================================================
// Filters
// ============================================================

function initializeTrafficFilters() {

    const yearSelect =
        document.getElementById(
            "trafficYear"
        );

    const monthSelect =
        document.getElementById(
            "trafficMonth"
        );

    if (yearSelect) {

        yearSelect.innerHTML = `
            <option value="all">
                All Academic Years
            </option>

            ${YEARS.map(year => `
                <option value="${year}">
                    ${year.replace("-", "–")}
                </option>
            `).join("")}
        `;

        yearSelect.value = "all";

        yearSelect.addEventListener(
            "change",
            renderTrafficData
        );
    }

    if (monthSelect) {

        monthSelect.innerHTML = `
            <option value="all">
                All Months
            </option>

            ${MONTHS.map(month => `
                <option value="${month}">
                    ${month}
                </option>
            `).join("")}
        `;

        monthSelect.value = "all";

        monthSelect.addEventListener(
            "change",
            renderTrafficData
        );
    }

    const resetButton =
        document.getElementById(
            "trafficReset"
        );

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                yearSelect.value = "all";
                monthSelect.value = "all";

                selectedChannel = "all";

                updateTrafficTabs();

                renderTrafficData();
            }
        );
    }
}


// ============================================================
// Channel Tabs
// ============================================================

function initializeTrafficTabs() {

    document
        .querySelectorAll(
            ".traffic-channel-tab"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedChannel =
                        button.dataset.channel ||
                        "all";

                    updateTrafficTabs();

                    renderTrafficData();
                }
            );
        });
}


function updateTrafficTabs() {

    document
        .querySelectorAll(
            ".traffic-channel-tab"
        )
        .forEach(button => {

            const active =
                button.dataset.channel ===
                selectedChannel;

            button.classList.toggle(
                "border-white",
                active
            );

            button.classList.toggle(
                "bg-white",
                active
            );

            button.classList.toggle(
                "text-slate-900",
                active
            );

            button.classList.toggle(
                "shadow-sm",
                active
            );

            button.classList.toggle(
                "border-white/15",
                !active
            );

            button.classList.toggle(
                "bg-white/10",
                !active
            );

            button.classList.toggle(
                "text-slate-300",
                !active
            );
        });
}


// ============================================================
// Main Renderer
// ============================================================

function renderTrafficData() {

    const filters =
        getTrafficFilters();

    const years =
        getActiveYears(
            filters.year
        );

    const months =
        filters.month === "all"
            ? MONTHS
            : [filters.month];

    const currentYear =
        getComparisonYear(
            filters.year
        );

    const previousYear =
        getPreviousYear(
            currentYear
        );

    const scope =
        filters.year === "all"
            ? "All Academic Years"
            : filters.year.replace("-", "–");

    document.getElementById(
        "trafficScope"
    ).textContent =
        `${scope}${filters.month === "all" ? "" : ` · ${filters.month}`}`;

    renderTrafficKpis(
        years,
        months,
        filters.month
    );

    renderGrowthKpis(
        currentYear,
        previousYear,
        filters.month
    );

    renderTrafficTrend(
        currentYear,
        previousYear,
        months
    );

    renderTrafficYoY(
        currentYear,
        previousYear,
        years,
        months
    );

    renderDirectOrganic(
        years,
        months
    );

    renderExactTraffic(
        currentYear,
        months
    );

    initializeIcons();
}


// ============================================================
// Filters State
// ============================================================

function getTrafficFilters() {

    return {

        year:
            document.getElementById(
                "trafficYear"
            )?.value || "all",

        month:
            document.getElementById(
                "trafficMonth"
            )?.value || "all"
    };
}


// ============================================================
// Active Years
// ============================================================

function getActiveYears(
    selectedYear
) {

    return selectedYear === "all"
        ? [...YEARS]
        : [selectedYear];
}


// ============================================================
// Comparison Pair
// ============================================================

function getComparisonYear(
    selectedYear
) {

    if (
        selectedYear &&
        selectedYear !== "all"
    ) {
        return selectedYear;
    }

    return YEARS[
        YEARS.length - 1
    ];
}


function getPreviousYear(
    currentYear
) {

    const index =
        YEARS.indexOf(
            currentYear
        );

    return index > 0
        ? YEARS[index - 1]
        : null;
}


// ============================================================
// KPI Rendering
// ============================================================

function renderTrafficKpis(
    years,
    months,
    selectedMonth
) {

    const container =
        document.getElementById(
            "trafficKpis"
        );

    if (!container) {
        return;
    }

    const annualMode =
        selectedMonth === "all";

    const total =
        trafficAggregate(
            "all",
            years,
            months,
            annualMode
        );

    const organic =
        trafficAggregate(
            "organic",
            years,
            months,
            annualMode
        );

    const direct =
        trafficAggregate(
            "direct",
            years,
            months,
            annualMode
        );

    const ai =
        trafficAggregate(
            "ai",
            years,
            months,
            annualMode
        );


    if (selectedChannel === "all") {

        container.innerHTML = [

            renderKpiCard(
                "Total Traffic (Sessions)",
                total,
                "globe-2"
            ),

            renderKpiCard(
                "Organic",
                organic,
                "search"
            ),

            renderKpiCard(
                "Direct",
                direct,
                "mouse-pointer-2"
            ),

            renderKpiCard(
                "AI Assistant",
                ai,
                "bot"
            ),

            renderKpiCard(
                "Organic + Direct + AI",
                organic + direct + ai,
                "layers-3"
            )

        ].join("");

        return;
    }


    if (selectedChannel === "ai") {

        container.innerHTML =
            renderKpiCard(
                "AI Assistant (Sessions)",
                ai,
                "bot"
            );

        return;
    }


    const sessions =
        metricAggregate(
            selectedChannel,
            "sessions",
            years,
            months
        );

    const users =
        metricAggregate(
            selectedChannel,
            "users",
            years,
            months
        );

    const newUsers =
        metricAggregate(
            selectedChannel,
            "new",
            years,
            months
        );

    const bounce =
        metricAggregate(
            selectedChannel,
            "bounce",
            years,
            months
        );

    const views =
        metricAggregate(
            selectedChannel,
            "views",
            years,
            months
        );


    container.innerHTML = [

        renderKpiCard(
            "Sessions",
            sessions,
            "activity"
        ),

        renderKpiCard(
            "New Users",
            newUsers,
            "user-plus"
        ),

        renderKpiCard(
            "Total Users",
            users,
            "users"
        ),

        renderKpiCard(
            "Bounce Rate",
            formatBounceRate(
                bounce
            ),
            "percent"
        ),

        renderKpiCard(
            "Views / Session",
            Number(views || 0)
                .toFixed(2),
            "eye"
        )

    ].join("");
}


// ============================================================
// KPI Card
// ============================================================

function renderKpiCard(
    label,
    value,
    icon
) {

    const displayValue =
        typeof value === "number"
            ? formatNumber(value)
            : value;

    return `
        <div
            class="${UI.kpiCard}"
        >

            <div
                class="
                    flex
                    items-center
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
                    ${escapeHtml(label)}
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
                        text-slate-500
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
                ${escapeHtml(
        String(displayValue)
    )}
            </div>

        </div>
    `;
}


// ============================================================
// Growth KPIs
// ============================================================

function renderGrowthKpis(
    currentYear,
    previousYear,
    selectedMonth
) {

    const container =
        document.getElementById(
            "trafficGrowthKpis"
        );

    if (!container) {
        return;
    }

    if (
        selectedMonth === "all"
    ) {
        container.innerHTML = "";
        container.classList.add(
            "hidden"
        );
        return;
    }

    container.classList.remove(
        "hidden"
    );

    const channels = [
        ["Total Traffic", "all"],
        ["Organic", "organic"],
        ["Direct", "direct"],
        ["AI Assistant", "ai"]
    ];

    container.innerHTML =
        channels
            .map(
                ([label, key]) => {

                    const current =
                        trafficValue(
                            key,
                            currentYear,
                            selectedMonth
                        );

                    const previousMonth =
                        getPreviousMonth(
                            selectedMonth
                        );

                    const previousMonthValue =
                        previousMonth
                            ? trafficValue(
                                key,
                                currentYear,
                                previousMonth
                            )
                            : 0;

                    const previousYearValue =
                        previousYear
                            ? trafficValue(
                                key,
                                previousYear,
                                selectedMonth
                            )
                            : 0;

                    const mom =
                        growthPercent(
                            previousMonthValue,
                            current
                        );

                    const yoy =
                        growthPercent(
                            previousYearValue,
                            current
                        );

                    return `
                        <div
                            class="
                                ${UI.kpiCard}
                                p-4
                            "
                        >

                            <div
                                class="
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                ${escapeHtml(label)}
                                ·
                                ${escapeHtml(selectedMonth)}
                            </div>

                            <div
                                class="
                                    mt-2
                                    text-xl
                                    font-bold
                                    text-slate-900
                                "
                            >
                                ${formatNumber(current)}
                            </div>

                            <div
                                class="
                                    mt-3
                                    grid
                                    grid-cols-2
                                    gap-3
                                "
                            >

                                ${renderGrowthValue(
                        "MoM Growth",
                        mom
                    )}

                                ${renderGrowthValue(
                        "YoY Growth",
                        yoy
                    )}

                            </div>

                        </div>
                    `;
                }
            )
            .join("");
}


function renderGrowthValue(
    label,
    value
) {

    return `
        <div>

            <div
                class="
                    text-[10px]
                    font-medium
                    text-slate-400
                "
            >
                ${label}
            </div>

            <div
                class="
                    mt-0.5
                    text-sm
                    font-semibold
                    ${growthTextClass(value)}
                "
            >
                ${formatGrowth(value)}
            </div>

        </div>
    `;
}


// ============================================================
// Traffic Trend
// ============================================================

function renderTrafficTrend(
    currentYear,
    previousYear,
    months
) {

    const chart =
        document.getElementById(
            "trafficChart"
        );

    const labels =
        document.getElementById(
            "trafficLabels"
        );

    const growthChart =
        document.getElementById(
            "trafficGrowthChart"
        );

    const growthLabels =
        document.getElementById(
            "trafficGrowthLabels"
        );

    const title =
        document.getElementById(
            "trafficChartTitle"
        );

    if (
        !chart ||
        !labels ||
        !growthChart ||
        !growthLabels
    ) {
        return;
    }


    const currentValues =
        months.map(
            month =>
                trafficValue(
                    selectedChannel,
                    currentYear,
                    month
                )
        );

    const previousValues =
        previousYear
            ? months.map(
                month =>
                    trafficValue(
                        selectedChannel,
                        previousYear,
                        month
                    )
            )
            : [];


    const channelLabel =
        getChannelLabel(
            selectedChannel
        );


    if (title) {

        title.textContent =
            `· ${channelLabel} · ${currentYear.replace("-", "–")}` +
            (
                previousYear
                    ? ` vs ${previousYear.replace("-", "–")}`
                    : ""
            );
    }


    const max =
        Math.max(
            ...currentValues,
            ...previousValues,
            1
        );


    chart.innerHTML = `
        <div
            class="
                flex
                h-64
                min-w-[700px]
                items-end
                gap-2
                rounded-xl
                bg-slate-50
                px-3
                pb-4
                pt-6
            "
        >

            ${months
            .map(
                (month, index) => {

                    const current =
                        currentValues[index] || 0;

                    const previous =
                        previousValues[index] || 0;

                    const currentHeight =
                        max > 0
                            ? Math.max(
                                2,
                                (current / max) * 100
                            )
                            : 2;

                    const previousHeight =
                        max > 0
                            ? Math.max(
                                2,
                                (previous / max) * 100
                            )
                            : 2;

                    return `
                            <div
                                class="
                                    flex
                                    h-full
                                    min-w-[48px]
                                    flex-1
                                    items-end
                                    justify-center
                                    gap-1
                                "
                                title="${escapeHtml(month)}"
                            >

                                <div
                                    class="
                                        w-3
                                        rounded-t-md
                                        bg-blue-500
                                        transition-all
                                        duration-300
                                    "
                                    style="
                                        height:${currentHeight}%;
                                    "
                                ></div>

                                <div
                                    class="
                                        w-3
                                        rounded-t-md
                                        bg-slate-300
                                        transition-all
                                        duration-300
                                    "
                                    style="
                                        height:${previousHeight}%;
                                    "
                                ></div>

                            </div>
                        `;
                }
            )
            .join("")}

        </div>
    `;


    labels.innerHTML =
        months
            .map(
                month => `
                    <span>
                        ${escapeHtml(
                    month.slice(0, 3)
                )}
                    </span>
                `
            )
            .join("");


    const growthValues =
        months.map(
            month => {

                const current =
                    trafficValue(
                        selectedChannel,
                        currentYear,
                        month
                    );

                const previous =
                    previousYear
                        ? trafficValue(
                            selectedChannel,
                            previousYear,
                            month
                        )
                        : 0;

                return previousYear
                    ? growthPercent(
                        previous,
                        current
                    )
                    : null;
            }
        );


    const growthMax =
        Math.max(
            ...growthValues
                .filter(
                    value =>
                        Number.isFinite(value)
                )
                .map(
                    value =>
                        Math.abs(value)
                ),
            10
        );


    growthChart.innerHTML = `
        <div
            class="
                flex
                h-32
                min-w-[700px]
                items-center
                gap-2
                rounded-xl
                bg-slate-50
                px-3
            "
        >

            ${growthValues
            .map(
                value => {

                    if (
                        value === null ||
                        !Number.isFinite(value)
                    ) {

                        return `
                                <div
                                    class="
                                        flex-1
                                        text-center
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    —
                                </div>
                            `;
                    }

                    const width =
                        Math.min(
                            100,
                            Math.abs(
                                value
                            ) /
                            growthMax *
                            100
                        );

                    const positive =
                        value >= 0;

                    return `
                            <div
                                class="
                                    flex
                                    h-full
                                    min-w-[48px]
                                    flex-1
                                    items-center
                                    justify-center
                                "
                            >

                                <div
                                    class="
                                        relative
                                        h-[${Math.max(
                        4,
                        width
                    )}%]
                                        w-4
                                        rounded-md
                                        ${positive
                            ? "bg-emerald-500"
                            : "bg-red-400"
                        }
                                    "
                                    title="${formatGrowth(value)}"
                                ></div>

                            </div>
                        `;
                }
            )
            .join("")}

        </div>
    `;


    growthLabels.innerHTML =
        months
            .map(
                month => `
                    <span>
                        ${escapeHtml(
                    month.slice(0, 3)
                )}
                    </span>
                `
            )
            .join("");
}


// ============================================================
// YoY Table
// ============================================================

function renderTrafficYoY(
    currentYear,
    previousYear,
    years,
    months
) {

    const container =
        document.getElementById(
            "trafficYoY"
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


    const current = {
        all:
            trafficAggregate(
                "all",
                [currentYear],
                MONTHS,
                true
            ),

        organic:
            trafficAggregate(
                "organic",
                [currentYear],
                MONTHS,
                true
            ),

        direct:
            trafficAggregate(
                "direct",
                [currentYear],
                MONTHS,
                true
            ),

        ai:
            trafficAggregate(
                "ai",
                [currentYear],
                MONTHS,
                true
            )
    };


    const previous = {
        all:
            trafficAggregate(
                "all",
                [previousYear],
                MONTHS,
                true
            ),

        organic:
            trafficAggregate(
                "organic",
                [previousYear],
                MONTHS,
                true
            ),

        direct:
            trafficAggregate(
                "direct",
                [previousYear],
                MONTHS,
                true
            ),

        ai:
            trafficAggregate(
                "ai",
                [previousYear],
                MONTHS,
                true
            )
    };


    const combinedCurrent =
        current.organic +
        current.direct +
        current.ai;

    const combinedPrevious =
        previous.organic +
        previous.direct +
        previous.ai;


    const rows = [
        [
            "Total Traffic",
            current.all,
            previous.all
        ],
        [
            "Organic",
            current.organic,
            previous.organic
        ],
        [
            "Direct",
            current.direct,
            previous.direct
        ],
        [
            "AI Assistant",
            current.ai,
            previous.ai
        ],
        [
            "Organic + Direct + AI",
            combinedCurrent,
            combinedPrevious
        ]
    ];


    container.innerHTML =
        renderTable(
            [
                "Channel",
                currentYear,
                previousYear,
                "YoY Growth %"
            ],
            rows.map(
                row => [
                    row[0],
                    formatNumber(row[1]),
                    formatNumber(row[2]),
                    renderGrowthCell(
                        growthPercent(
                            row[2],
                            row[1]
                        )
                    )
                ]
            )
        );
}


// ============================================================
// Direct vs Organic
// ============================================================

function renderDirectOrganic(
    years,
    months
) {

    const container =
        document.getElementById(
            "directOrganicTable"
        );

    if (!container) {
        return;
    }


    const rows =
        months.map(
            month => {

                const organic =
                    metricSnapshot(
                        "organic",
                        years,
                        month
                    );

                const direct =
                    metricSnapshot(
                        "direct",
                        years,
                        month
                    );

                return [
                    month,

                    formatNumber(
                        organic.sessions
                    ),

                    formatNumber(
                        direct.sessions
                    ),

                    formatNumber(
                        organic.users
                    ),

                    formatNumber(
                        direct.users
                    ),

                    formatNumber(
                        organic.newUsers
                    ),

                    formatNumber(
                        direct.newUsers
                    ),

                    formatBounceRate(
                        organic.bounce
                    ),

                    formatBounceRate(
                        direct.bounce
                    )
                ];
            }
        );


    container.innerHTML =
        renderTable(
            [
                "Month",
                "Organic Sessions",
                "Direct Sessions",
                "Organic Users",
                "Direct Users",
                "Organic New Users",
                "Direct New Users",
                "Organic Bounce",
                "Direct Bounce"
            ],
            rows
        );
}


// ============================================================
// Exact Traffic Table
// ============================================================

function renderExactTraffic(
    currentYear,
    months
) {

    const container =
        document.getElementById(
            "trafficExactTable"
        );

    if (!container) {
        return;
    }


    const rows =
        months.map(
            month => {

                const total =
                    trafficValue(
                        "all",
                        currentYear,
                        month
                    );

                const organic =
                    trafficValue(
                        "organic",
                        currentYear,
                        month
                    );

                const direct =
                    trafficValue(
                        "direct",
                        currentYear,
                        month
                    );

                const ai =
                    trafficValue(
                        "ai",
                        currentYear,
                        month
                    );

                return [
                    month,
                    formatNumber(total),
                    formatNumber(organic),
                    formatNumber(direct),
                    formatNumber(ai),
                    formatNumber(
                        organic +
                        direct +
                        ai
                    )
                ];
            }
        );


    container.innerHTML =
        renderTable(
            [
                "Month",
                "Total",
                "Organic",
                "Direct",
                "AI Assistant",
                "Organic + Direct + AI"
            ],
            rows
        );
}


// ============================================================
// Traffic Aggregation
// ============================================================

function trafficAggregate(
    channel,
    years,
    months,
    annualMode = false
) {

    return years.reduce(
        (
            total,
            year
        ) => {

            const rows =
                getTrafficRows(
                    year
                );

            return (
                total +
                rows.reduce(
                    (
                        sum,
                        row
                    ) => {

                        if (
                            annualMode ||
                            months.includes(
                                row.month
                            )
                        ) {

                            return (
                                sum +
                                toNumber(
                                    row[channel]
                                )
                            );
                        }

                        return sum;
                    },
                    0
                )
            );
        },
        0
    );
}


// ============================================================
// Single Traffic Value
// ============================================================

function trafficValue(
    channel,
    year,
    month
) {

    const rows =
        getTrafficRows(
            year
        );

    const row =
        rows.find(
            item =>
                item.month ===
                month
        );

    return row
        ? toNumber(
            row[channel]
        )
        : 0;
}


// ============================================================
// Traffic Rows
// ============================================================

function getTrafficRows(
    year
) {

    if (
        trafficCache.all &&
        trafficCache.all[year]
    ) {
        return trafficCache.all[year];
    }


    const rows =
        dashboardData[
        TRAFFIC_SHEETS.all
        ] || [];


    if (!rows.length) {
        return [];
    }


    const result = [];


    const headers =
        Object.keys(
            rows[0]
        );


    const monthColumns =
        headers.filter(
            header =>
                /^[A-Za-z]{3}'?\d{2}$/
                    .test(
                        String(
                            header
                        ).trim()
                    )
        );


    if (
        monthColumns.length
    ) {

        monthColumns.forEach(
            column => {

                const parsed =
                    parseTrafficHeader(
                        column
                    );

                if (
                    !parsed ||
                    parsed.academicYear !==
                    year
                ) {
                    return;
                }


                result.push({

                    month:
                        parsed.month,

                    all:
                        findTrafficMetric(
                            rows,
                            [
                                "Total",
                                "Total Traffic"
                            ],
                            column
                        ),

                    organic:
                        findTrafficMetric(
                            rows,
                            [
                                "Organic Search",
                                "Organic Traffic",
                                "Organic"
                            ],
                            column
                        ),

                    direct:
                        findTrafficMetric(
                            rows,
                            [
                                "Direct",
                                "Direct Traffic"
                            ],
                            column
                        ),

                    ai:
                        findTrafficMetric(
                            rows,
                            [
                                "AI Assistant",
                                "AI"
                            ],
                            column
                        )
                });
            }
        );

    } else {

        parseTrafficFallback(
            rows,
            year,
            result
        );
    }


    if (!trafficCache.all) {
        trafficCache.all = {};
    }

    trafficCache.all[year] =
        result;

    return result;
}


// ============================================================
// Traffic Header Parser
// ============================================================

function parseTrafficHeader(
    header
) {

    const value =
        String(
            header ?? ""
        )
            .trim()
            .replace(
                /'/g,
                ""
            );

    const match =
        value.match(
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


    const academicYear =
        MONTHS.indexOf(
            month
        ) <= 4
            ? `${calendarYear - 1}-${String(calendarYear).slice(-2)}`
            : `${calendarYear}-${String(calendarYear + 1).slice(-2)}`;


    return {
        month,
        academicYear
    };
}


// ============================================================
// Traffic Fallback Parser
// ============================================================

function parseTrafficFallback(
    rows,
    year,
    result
) {

    rows.forEach(
        row => {

            Object.keys(
                row
            ).forEach(
                key => {

                    const parsed =
                        parseTrafficHeader(
                            key
                        );

                    if (
                        !parsed ||
                        parsed.academicYear !==
                        year
                    ) {
                        return;
                    }


                    let item =
                        result.find(
                            value =>
                                value.month ===
                                parsed.month
                        );


                    if (!item) {

                        item = {

                            month:
                                parsed.month,

                            all: 0,
                            organic: 0,
                            direct: 0,
                            ai: 0

                        };

                        result.push(
                            item
                        );
                    }


                    const label =
                        normalize(
                            Object.values(
                                row
                            )[0]
                        );

                    const value =
                        toNumber(
                            row[key]
                        );


                    if (
                        [
                            "total",
                            "total traffic"
                        ].includes(
                            label
                        )
                    ) {

                        item.all =
                            value;

                    } else if (
                        [
                            "organic",
                            "organic search",
                            "organic traffic"
                        ].includes(
                            label
                        )
                    ) {

                        item.organic =
                            value;

                    } else if (
                        [
                            "direct",
                            "direct traffic"
                        ].includes(
                            label
                        )
                    ) {

                        item.direct =
                            value;

                    } else if (
                        [
                            "ai",
                            "ai assistant"
                        ].includes(
                            label
                        )
                    ) {

                        item.ai =
                            value;
                    }

                }
            );
        }
    );
}


// ============================================================
// Organic / Direct Metrics
// ============================================================

function metricSnapshot(
    channel,
    years,
    month
) {

    let sessions = 0;
    let users = 0;
    let newUsers = 0;

    let bounceWeighted = 0;
    let viewsWeighted = 0;
    let weight = 0;


    years.forEach(
        year => {

            const metric =
                getMetricRows(
                    channel,
                    year
                ).find(
                    row =>
                        row.month ===
                        month
                );

            if (!metric) {
                return;
            }


            sessions +=
                metric.sessions;

            users +=
                metric.users;

            newUsers +=
                metric.newUsers;


            if (
                metric.sessions > 0
            ) {

                bounceWeighted +=
                    metric.bounce *
                    metric.sessions;

                viewsWeighted +=
                    metric.views *
                    metric.sessions;

                weight +=
                    metric.sessions;
            }
        }
    );


    return {

        sessions,

        users,

        newUsers,

        bounce:
            weight
                ? bounceWeighted /
                weight
                : 0,

        views:
            weight
                ? viewsWeighted /
                weight
                : 0
    };
}


function metricAggregate(
    channel,
    key,
    years,
    months
) {

    let total = 0;

    let weightedTotal = 0;
    let weight = 0;


    years.forEach(
        year => {

            const rows =
                getMetricRows(
                    channel,
                    year
                );


            months.forEach(
                month => {

                    const row =
                        rows.find(
                            item =>
                                item.month ===
                                month
                        );

                    if (!row) {
                        return;
                    }


                    if (
                        key ===
                        "bounce" ||
                        key ===
                        "views"
                    ) {

                        if (
                            row.sessions >
                            0
                        ) {

                            weightedTotal +=
                                row[key] *
                                row.sessions;

                            weight +=
                                row.sessions;
                        }

                    } else {

                        total +=
                            row[key] || 0;
                    }
                }
            );
        }
    );


    if (
        key === "bounce" ||
        key === "views"
    ) {

        return weight
            ? weightedTotal /
            weight
            : 0;
    }


    return total;
}


// ============================================================
// Metric Sheet Parser
// ============================================================

function getMetricRows(
    channel,
    year
) {

    if (
        metricCache[channel]?.[year]
    ) {

        return metricCache[
            channel
        ][year];
    }


    const sheetName =
        TRAFFIC_SHEETS[
        channel
        ];

    const rows =
        dashboardData[
        sheetName
        ] || [];


    if (!rows.length) {
        return [];
    }


    const result =
        parseMetricRows(
            rows,
            year
        );


    if (!metricCache[channel]) {
        metricCache[channel] = {};
    }

    metricCache[channel][year] =
        result;

    return result;
}


function parseMetricRows(
    rows,
    year
) {

    const result = [];


    // --------------------------------------------------------
    // Format 1:
    // Month + Academic Year + metric columns
    // --------------------------------------------------------

    rows.forEach(
        row => {

            const normalized =
                normalizeObject(
                    row
                );


            const month =
                findMonthValue(
                    normalized
                );

            if (!month) {
                return;
            }


            const rowYear =
                findAcademicYear(
                    normalized,
                    month
                );


            if (
                rowYear &&
                rowYear !== year
            ) {
                return;
            }


            const sessions =
                findMetricValue(
                    normalized,
                    [
                        "sessions",
                        "session"
                    ]
                );

            const users =
                findMetricValue(
                    normalized,
                    [
                        "users",
                        "total users",
                        "total user"
                    ]
                );

            const newUsers =
                findMetricValue(
                    normalized,
                    [
                        "new users",
                        "new user"
                    ]
                );

            const bounce =
                findMetricValue(
                    normalized,
                    [
                        "bounce rate",
                        "bounce"
                    ]
                );

            const views =
                findMetricValue(
                    normalized,
                    [
                        "views / session",
                        "views per session",
                        "views/session",
                        "views"
                    ]
                );


            if (
                sessions !== null ||
                users !== null ||
                newUsers !== null ||
                bounce !== null ||
                views !== null
            ) {

                result.push({

                    month,

                    sessions:
                        sessions || 0,

                    users:
                        users || 0,

                    newUsers:
                        newUsers || 0,

                    bounce:
                        bounce || 0,

                    views:
                        views || 0

                });
            }
        }
    );


    if (result.length) {
        return result;
    }


    // --------------------------------------------------------
    // Format 2:
    // Metrics are rows and months are columns
    // --------------------------------------------------------

    return parseMetricColumnFormat(
        rows,
        year
    );
}


// ============================================================
// Metric Column Format
// ============================================================

function parseMetricColumnFormat(
    rows,
    year
) {

    const headers =
        Object.keys(
            rows[0] || {}
        );


    const monthColumns =
        headers
            .map(
                header => {

                    const parsed =
                        parseTrafficHeader(
                            header
                        );

                    if (
                        parsed &&
                        parsed.academicYear ===
                        year
                    ) {

                        return {
                            header,
                            month:
                                parsed.month
                        };
                    }

                    return null;
                }
            )
            .filter(Boolean);


    if (!monthColumns.length) {
        return [];
    }


    const result = [];


    monthColumns.forEach(
        column => {

            const sessions =
                findMetricRowValue(
                    rows,
                    [
                        "sessions",
                        "session"
                    ],
                    column.header
                );

            const users =
                findMetricRowValue(
                    rows,
                    [
                        "users",
                        "total users",
                        "total user"
                    ],
                    column.header
                );

            const newUsers =
                findMetricRowValue(
                    rows,
                    [
                        "new users",
                        "new user"
                    ],
                    column.header
                );

            const bounce =
                findMetricRowValue(
                    rows,
                    [
                        "bounce rate",
                        "bounce"
                    ],
                    column.header
                );

            const views =
                findMetricRowValue(
                    rows,
                    [
                        "views / session",
                        "views per session",
                        "views/session",
                        "views"
                    ],
                    column.header
                );


            result.push({

                month:
                    column.month,

                sessions:
                    sessions || 0,

                users:
                    users || 0,

                newUsers:
                    newUsers || 0,

                bounce:
                    bounce || 0,

                views:
                    views || 0

            });
        }
    );


    return result;
}


// ============================================================
// Metric Helpers
// ============================================================

function findMonthValue(
    object
) {

    const value =
        object.month ||
        object.monthname ||
        object.period;

    if (
        value &&
        MONTHS.includes(
            String(value)
                .trim()
        )
    ) {

        return String(
            value
        ).trim();
    }


    return null;
}


function findAcademicYear(
    object,
    month
) {

    const candidates = [

        object.academicyear,

        object.year,

        object.fiscalyear

    ];


    for (
        const candidate
        of candidates
    ) {

        if (!candidate) {
            continue;
        }

        const value =
            String(
                candidate
            ).trim();


        if (
            YEARS.includes(
                value
            )
        ) {

            return value;
        }
    }


    return null;
}


function findMetricValue(
    object,
    labels
) {

    for (
        const key
        of Object.keys(
            object
        )
    ) {

        const normalizedKey =
            normalize(
                key
            );

        if (
            labels.some(
                label =>
                    normalizedKey ===
                    normalize(label)
            )
        ) {

            const number =
                toNumber(
                    object[key]
                );

            return number;
        }
    }


    return null;
}


function findMetricRowValue(
    rows,
    labels,
    column
) {

    const row =
        rows.find(
            item => {

                const firstValue =
                    Object.values(
                        item
                    )[0];

                const normalized =
                    normalize(
                        firstValue
                    );

                return labels.some(
                    label =>
                        normalized ===
                        normalize(label)
                );
            }
        );


    if (!row) {
        return 0;
    }


    return toNumber(
        row[column]
    );
}


// ============================================================
// Traffic Metric Helpers
// ============================================================

function findTrafficMetric(
    rows,
    labels,
    column
) {

    const row =
        rows.find(
            item => {

                const firstValue =
                    Object.values(
                        item
                    )[0];

                const normalized =
                    normalize(
                        firstValue
                    );

                return labels.some(
                    label =>
                        normalized ===
                        normalize(label)
                );
            }
        );


    if (!row) {
        return 0;
    }


    return toNumber(
        row[column]
    );
}


// ============================================================
// Previous Month
// ============================================================

function getPreviousMonth(
    month
) {

    const index =
        MONTHS.indexOf(
            month
        );

    return index > 0
        ? MONTHS[index - 1]
        : null;
}


// ============================================================
// Growth
// ============================================================

function growthPercent(
    previous,
    current
) {

    const oldValue =
        Number(previous) || 0;

    const newValue =
        Number(current) || 0;


    if (
        oldValue === 0
    ) {

        return newValue === 0
            ? 0
            : null;
    }


    return (
        (newValue - oldValue) /
        oldValue
    ) *
        100;
}


function formatGrowth(
    value
) {

    if (
        value === null ||
        !Number.isFinite(
            value
        )
    ) {
        return "—";
    }


    return `${value >= 0
            ? "+"
            : ""
        }${value.toFixed(1)}%`;
}


function growthTextClass(
    value
) {

    if (
        value === null ||
        !Number.isFinite(
            value
        )
    ) {
        return "text-slate-400";
    }


    return value >= 0
        ? "text-emerald-600"
        : "text-red-500";
}


function renderGrowthCell(
    value
) {

    return `
        <span
            class="
                font-semibold
                ${growthTextClass(value)}
            "
        >
            ${formatGrowth(value)}
        </span>
    `;
}


// ============================================================
// Number Helpers
// ============================================================

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


    const cleaned =
        String(value)
            .replace(
                /,/g,
                ""
            )
            .replace(
                /%/g,
                ""
            )
            .trim();


    const number =
        Number(
            cleaned
        );


    return Number.isFinite(
        number
    )
        ? number
        : 0;
}


// ============================================================
// Bounce Rate
// ============================================================

function formatBounceRate(
    value
) {

    const number =
        Number(value) || 0;


    if (
        number <= 1 &&
        number > 0
    ) {

        return `${(
            number * 100
        ).toFixed(1)}%`;
    }


    return `${number.toFixed(1)}%`;
}


// ============================================================
// Table Renderer
// ============================================================

function renderTable(
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
                (header, index) => `
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
                                                    text-slate-700
                                                    ${index > 0
                                    ? "text-right"
                                    : ""
                                }
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
                class="text-center"
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
// Cache
// ============================================================

function invalidateCaches() {

    trafficCache = {
        all: null,
        organic: null,
        direct: null
    };

    metricCache = {
        organic: null,
        direct: null
    };
}


// ============================================================
// Generic Helpers
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


function normalizeObject(
    row
) {

    const output = {};

    Object.entries(
        row
    ).forEach(
        ([key, value]) => {

            output[
                normalize(
                    key
                ).replace(
                    /\s/g,
                    ""
                )
            ] = value;
        }
    );

    return output;
}


function formatScopeYear(
    year
) {

    return String(
        year
    ).replace(
        "-",
        "–"
    );
}


function getChannelLabel(
    channel
) {

    const match =
        TRAFFIC_CHANNELS.find(
            item =>
                item[1] ===
                channel
        );

    return match
        ? match[0]
        : "Total Traffic";
}