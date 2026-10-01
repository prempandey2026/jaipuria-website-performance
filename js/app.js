// ============================================================
// Dashboard Application Entry
// ============================================================

import {
    loadDashboardData,
    getRequiredSheets
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

    const currentPage =
        getCurrentPage();

    const requiredSheets =
        getRequiredSheets(
            currentPage
        );

    try {

        await loadDashboardData(
            requiredSheets
        );

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
// Refresh Dashboard
// ============================================================

async function refreshDashboard() {

    if (isRefreshing) {
        return;
    }

    isRefreshing = true;

    setRefreshButtonState(true);

    try {

        const currentPage =
            getCurrentPage();

        const requiredSheets =
            getRequiredSheets(
                currentPage
            );

        await loadDashboardData(
            requiredSheets
        );

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