// ============================================================
// Dashboard Application Entry
// ============================================================

import {
    loadDashboardData,
    hasCachedDashboardData
} from "./data.js";

import {
    renderLayout,
    setPageInfo,
    getCurrentPage,
    setRefreshButtonState
} from "./layout.js";

import {
    renderSummaryPage
} from "./pages/summary.js";

import {
    renderLeadsPage
} from "./pages/leads.js";

import {
    renderTrafficPage
} from "./pages/traffic.js";

import {
    renderComparisonPage
} from "./pages/comparison.js";

import {
    renderStatePage
} from "./pages/state.js";

import {
    renderProjectionPage
} from "./pages/projection.js";

import {
    initializeIcons
} from "./utils.js";


// ============================================================
// State
// ============================================================

let isRefreshing = false;


// ============================================================
// Application Start
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);


// ============================================================
// Initialize
// ============================================================

async function initDashboard() {

    renderLayout();
    setPageInfo();

    const hasCache =
        hasCachedDashboardData();


    // --------------------------------------------------------
    // Cached data available
    // --------------------------------------------------------

    if (hasCache) {

        try {

            await loadDashboardData();

            renderCurrentPage();

        } catch (error) {

            console.error(
                "Cached dashboard load failed:",
                error
            );

            showDashboardError();

            return;
        }


        // ----------------------------------------------------
        // Fetch latest data in background
        // ----------------------------------------------------

        refreshDashboardInBackground();

        return;
    }


    // --------------------------------------------------------
    // First visit
    // --------------------------------------------------------

    showDashboardLoading();

    try {

        await loadDashboardData({
            forceRefresh: true
        });

        renderCurrentPage();

    } catch (error) {

        console.error(
            "Dashboard initialization failed:",
            error
        );

        showDashboardError();
    }
}


// ============================================================
// Current Page
// ============================================================

function renderCurrentPage() {

    const currentPage =
        getCurrentPage();

    switch (currentPage) {

        case "index.html":

            renderSummaryPage();

            break;


        case "leads.html":

            renderLeadsPage();

            break;


        case "traffic.html":

            renderTrafficPage();

            break;


        case "comparison.html":

            renderComparisonPage();

            break;


        case "state.html":

            renderStatePage();

            break;


        case "projection.html":

            renderProjectionPage();

            break;


        default:

            renderSummaryPage();
    }
}


// ============================================================
// Background Refresh
// ============================================================

async function refreshDashboardInBackground() {

    try {

        await loadDashboardData({
            forceRefresh: true
        });

        renderCurrentPage();

        console.log(
            "Dashboard data updated in background."
        );

    } catch (error) {

        console.error(
            "Background dashboard refresh failed:",
            error
        );

        // Existing page remains visible.
    }
}


// ============================================================
// Manual Refresh
// ============================================================

async function refreshDashboard() {

    if (isRefreshing) {
        return;
    }

    isRefreshing = true;

    setRefreshButtonState(true);

    try {

        await loadDashboardData({
            forceRefresh: true
        });

        renderCurrentPage();

        console.log(
            "Dashboard data refreshed."
        );

    } catch (error) {

        console.error(
            "Dashboard refresh failed:",
            error
        );

        showDashboardError(
            "Failed to refresh dashboard data."
        );

    } finally {

        isRefreshing = false;

        setRefreshButtonState(false);
    }
}


// ============================================================
// Refresh Event
// ============================================================

document.addEventListener(
    "click",
    event => {

        const refreshButton =
            event.target.closest(
                "#refreshButton"
            );

        if (!refreshButton) {
            return;
        }

        refreshDashboard();
    }
);


// ============================================================
// Loading State
// ============================================================

function showDashboardLoading() {

    const pageContent =
        document.getElementById(
            "pageContent"
        );

    if (!pageContent) {
        return;
    }

    pageContent.innerHTML = `
        <div
            class="
                min-h-[60vh]
                space-y-6
                animate-pulse
            "
        >

            <!-- Hero Skeleton -->

            <div
                class="
                    h-40
                    rounded-3xl
                    bg-slate-200
                "
            ></div>


            <!-- KPI Skeleton -->

            <div
                class="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >

                ${Array.from(
        { length: 4 },
        () => `
                        <div
                            class="
                                h-32
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                            "
                        ></div>
                    `
    ).join("")}

            </div>


            <!-- Content Skeleton -->

            <div
                class="
                    h-72
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            ></div>

        </div>
    `;
}


// ============================================================
// Error State
// ============================================================

function showDashboardError(
    message = "Unable to load dashboard data."
) {

    const pageContent =
        document.getElementById(
            "pageContent"
        );

    if (!pageContent) {
        return;
    }

    pageContent.innerHTML = `
        <div
            class="
                flex
                min-h-[50vh]
                items-center
                justify-center
            "
        >

            <div
                class="
                    max-w-md
                    rounded-2xl
                    border
                    border-red-200
                    bg-white
                    p-6
                    text-center
                    shadow-sm
                "
            >

                <div
                    class="
                        mx-auto
                        mb-4
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-red-500
                    "
                >

                    <i
                        data-lucide="alert-triangle"
                        class="h-6 w-6"
                    ></i>

                </div>


                <h2
                    class="
                        text-base
                        font-bold
                        text-slate-900
                    "
                >
                    Dashboard unavailable
                </h2>


                <p
                    class="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    ${message}
                </p>

            </div>

        </div>
    `;

    initializeIcons();
}