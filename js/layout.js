// ============================================================
// Dashboard Layout
// ============================================================

import {
    initializeIcons
} from "./utils.js";


// ============================================================
// Sidebar Configuration
// ============================================================

export const sidebarItems = [

    {
        name: "Summary",
        page: "index.html",
        icon: "layout-dashboard"
    },

    {
        name: "Leads & Applications",
        page: "leads.html",
        icon: "users"
    },

    {
        name: "Traffic",
        page: "traffic.html",
        icon: "chart-line"
    },

    {
        name: "Year Comparison",
        page: "comparison.html",
        icon: "git-compare"
    },

    {
        name: "State Performance",
        page: "state.html",
        icon: "map"
    },

    {
        name: "Projection",
        page: "projection.html",
        icon: "chart-no-axes-combined"
    }
];


// ============================================================
// Render Layout
// ============================================================

export function renderLayout() {

    const app =
        document.getElementById("app");

    if (!app) {
        return;
    }

    app.innerHTML = `
        <div class="min-h-screen bg-slate-50">

            <div class="flex min-h-screen">

                ${renderSidebar()}

                ${renderMainContent()}

            </div>

        </div>
    `;

    setActiveSidebarItem();
    bindLayoutEvents();
    initializeIcons();
}


// ============================================================
// Sidebar
// ============================================================

function renderSidebar() {

    return `
        <aside
            id="sidebar"
            class="
                sticky top-0 z-30
        flex h-screen shrink-0
        w-64 flex-col
        overflow-hidden
        bg-slate-950
        text-white
        shadow-2xl
        transition-all duration-300 ease-out
            "
        >

            ${renderSidebarHeader()}

            ${renderSidebarNavigation()}

            ${renderSidebarFooter()}

        </aside>
    `;
}


// ============================================================
// Sidebar Header
// ============================================================

function renderSidebarHeader() {

    return `
        <div
            class="
                flex h-20 items-center
                border-b border-white/10
                px-4
            "
        >

            <div
                id="sidebarBrand"
                class="
                    flex min-w-0 flex-1
                    items-center
                    justify-center
                "
            >

                <div
                    id="sidebarFullLogoWrapper"
                    class="
                        rounded-lg
                        bg-white
                        px-3 py-2
                        shadow-sm
                    "
                >
                    <img
                        src="https://www.jaipuria.ac.in/wp-content/uploads/2025/07/Jaipuria-Logo.jpg"
                        alt="Jaipuria Logo"
                        class="h-9 w-auto object-contain"
                    >
                </div>

                <img
                    id="sidebarIconLogo"
                    src="https://www.jaipuria.ac.in/wp-content/uploads/2022/05/favicon.png"
                    alt="Jaipuria"
                    class="
                        hidden
                        h-10 w-10
                        object-contain
                    "
                >

            </div>


            <button
                id="sidebarToggle"
                type="button"
                class="
                    ml-2
                    flex h-9 w-9
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    text-slate-400
                    transition-all duration-200
                    hover:bg-white/10
                    hover:text-white
                    active:scale-95
                "
                title="Toggle Sidebar"
            >

                <i
                    id="sidebarToggleIcon"
                    data-lucide="panel-left-close"
                    class="h-5 w-5"
                ></i>

            </button>

        </div>
    `;
}


// ============================================================
// Sidebar Navigation
// ============================================================

function renderSidebarNavigation() {

    return `
        <nav class="flex-1 px-3 py-5">

            <div
                class="
                    mb-3 px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-slate-600
                "
            >
                Dashboard
            </div>

            <div class="space-y-1.5">
                ${renderSidebarItems()}
            </div>

        </nav>
    `;
}


// ============================================================
// Sidebar Items
// ============================================================

function renderSidebarItems() {

    return sidebarItems
        .map(item => `

            <a
                href="${item.page}"
                class="
                    sidebar-item group
                    flex items-center gap-3
                    rounded-xl
                    px-3 py-3
                    text-sm font-medium
                    text-slate-400
                    transition-all duration-200
                    hover:translate-x-0.5
                    hover:bg-white/[0.07]
                    hover:text-white
                "
                data-page="${item.page}"
                title="${item.name}"
            >

                <span
                    class="
                        sidebar-icon-wrap
                        flex h-9 w-9
                        shrink-0
                        items-center justify-center
                        rounded-lg
                        bg-white/[0.03]
                        transition-all duration-200
                        group-hover:bg-white/10
                    "
                >

                    <i
                        data-lucide="${item.icon}"
                        class="sidebar-icon h-5 w-5"
                    ></i>

                </span>

                <span class="sidebar-label whitespace-nowrap">
                    ${item.name}
                </span>

            </a>

        `)
        .join("");
}


// ============================================================
// Sidebar Footer
// ============================================================

function renderSidebarFooter() {

    return `
        <div
            id="sidebarFooter"
            class="
                border-t
                border-white/10
                p-4
            "
        >

            <div
                class="
                    text-center
                    text-[11px]
                    font-medium
                    tracking-wide
                    text-slate-600
                "
            >
                Management Dashboard
            </div>

        </div>
    `;
}


// ============================================================
// Main Content
// ============================================================

function renderMainContent() {

    return `
        <main
            id="mainContent"
            class="
                min-h-screen
                min-w-0
                flex-1
                bg-slate-50
            "
        >

            ${renderPageWrapper()}

        </main>
    `;
}


// ============================================================
// Page Wrapper
// ============================================================

function renderPageWrapper() {

    return `
        <div class="min-h-screen">

            ${renderTopHeader()}

            <section
                class="
                    p-4
                    sm:p-6
                    lg:p-8
                "
            >

                <div
                    id="pageContent"
                    class="
                        transition-all
                        duration-500
                        ease-out
                    "
                ></div>

            </section>

        </div>
    `;
}


// ============================================================
// Top Header
// ============================================================

function renderTopHeader() {

    return `
        <header
            class="
                sticky top-0 z-20
                flex h-20
                items-center
                justify-between
                border-b
                border-slate-200/80
                bg-white/90
                px-4
                shadow-sm
                backdrop-blur-xl
                sm:px-6
                lg:px-8
            "
        >

            ${renderPageTitle()}

            ${renderHeaderActions()}

        </header>
    `;
}


// ============================================================
// Page Title
// ============================================================

function renderPageTitle() {

    return `
        <div class="min-w-0">

            <h1
                id="pageTitle"
                class="
                    truncate
                    text-lg
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-xl
                "
            >
                Summary
            </h1>

            <p
                id="pageSubtitle"
                class="
                    mt-0.5
                    truncate
                    text-xs
                    text-slate-500
                    sm:text-sm
                "
            >
                Management Performance Dashboard
            </p>

        </div>
    `;
}


// ============================================================
// Header Actions
// ============================================================

function renderHeaderActions() {

    return `
        <div class="flex items-center gap-2 sm:gap-3">

            <button
                id="refreshButton"
                type="button"
                class="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-3.5 py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all duration-200
                    hover:-translate-y-0.5
                    hover:bg-slate-800
                    hover:shadow-lg
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            >

                <i
                    data-lucide="refresh-cw"
                    class="h-4 w-4"
                ></i>

                <span>Refresh</span>

            </button>

        </div>
    `;
}


// ============================================================
// Page Information
// ============================================================

export function setPageInfo() {

    const currentPage =
        getCurrentPage();

    const pageInfo = {

        "index.html": {
            title: "Summary",
            subtitle: "Management Performance Dashboard"
        },

        "leads.html": {
            title: "Leads & Applications",
            subtitle:
                "Lead, application and admission performance"
        },

        "traffic.html": {
            title: "Traffic",
            subtitle:
                "Website traffic performance"
        },

        "comparison.html": {
            title: "Year Comparison",
            subtitle:
                "Academic year performance comparison"
        },

        "state.html": {
            title: "State Performance",
            subtitle:
                "State and city performance"
        },

        "projection.html": {
            title: "Projection",
            subtitle:
                "Performance projections"
        }
    };

    const currentPageInfo =
        pageInfo[currentPage];

    if (!currentPageInfo) {
        return;
    }

    const pageTitle =
        document.getElementById("pageTitle");

    const pageSubtitle =
        document.getElementById("pageSubtitle");

    if (pageTitle) {
        pageTitle.textContent =
            currentPageInfo.title;
    }

    if (pageSubtitle) {
        pageSubtitle.textContent =
            currentPageInfo.subtitle;
    }
}


// ============================================================
// Current Page
// ============================================================

export function getCurrentPage() {

    return (
        window.location.pathname
            .split("/")
            .pop() ||
        "index.html"
    );
}


// ============================================================
// Active Sidebar Item
// ============================================================

function setActiveSidebarItem() {

    const currentPage =
        getCurrentPage();

    document
        .querySelectorAll(".sidebar-item")
        .forEach(item => {

            const isActive =
                item.dataset.page === currentPage;

            item.classList.toggle(
                "bg-blue-600",
                isActive
            );

            item.classList.toggle(
                "text-white",
                isActive
            );

            item.classList.toggle(
                "shadow-lg",
                isActive
            );

            item.classList.toggle(
                "shadow-blue-900/20",
                isActive
            );

            const iconWrap =
                item.querySelector(
                    ".sidebar-icon-wrap"
                );

            iconWrap?.classList.toggle(
                "bg-white/10",
                isActive
            );
        });
}


// ============================================================
// Sidebar Toggle
// ============================================================

function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (!sidebar) {
        return;
    }

    const fullLogoWrapper =
        document.getElementById(
            "sidebarFullLogoWrapper"
        );

    const iconLogo =
        document.getElementById(
            "sidebarIconLogo"
        );

    const sidebarLabels =
        document.querySelectorAll(
            ".sidebar-label"
        );

    const sidebarItems =
        document.querySelectorAll(
            ".sidebar-item"
        );

    const toggleIcon =
        document.getElementById(
            "sidebarToggleIcon"
        );

    const isCollapsed =
        sidebar.classList.contains("w-20");


    if (isCollapsed) {

        sidebar.classList.remove("w-20");
        sidebar.classList.add("w-64");

        fullLogoWrapper?.classList.remove(
            "hidden"
        );

        iconLogo?.classList.add(
            "hidden"
        );

        sidebarLabels.forEach(label => {

            label.classList.remove(
                "hidden"
            );
        });

        sidebarItems.forEach(item => {

            item.classList.remove(
                "justify-center"
            );

            item.classList.add(
                "gap-3"
            );
        });

        toggleIcon?.setAttribute(
            "data-lucide",
            "panel-left-close"
        );

    } else {

        sidebar.classList.remove("w-64");
        sidebar.classList.add("w-20");

        fullLogoWrapper?.classList.add(
            "hidden"
        );

        iconLogo?.classList.remove(
            "hidden"
        );

        sidebarLabels.forEach(label => {

            label.classList.add(
                "hidden"
            );
        });

        sidebarItems.forEach(item => {

            item.classList.remove(
                "gap-3"
            );

            item.classList.add(
                "justify-center"
            );
        });

        toggleIcon?.setAttribute(
            "data-lucide",
            "panel-left-open"
        );
    }

    initializeIcons();
}


// ============================================================
// Event Binding
// ============================================================

function bindLayoutEvents() {

    document
        .getElementById("sidebarToggle")
        ?.addEventListener(
            "click",
            toggleSidebar
        );
}


// ============================================================
// Refresh Button State
// ============================================================

export function setRefreshButtonState(
    isLoading
) {

    const button =
        document.getElementById(
            "refreshButton"
        );

    if (!button) {
        return;
    }

    const icon =
        button.querySelector("svg");

    const text =
        button.querySelector("span");

    button.disabled =
        isLoading;

    icon?.classList.toggle(
        "animate-spin",
        isLoading
    );

    if (text) {

        text.textContent =
            isLoading
                ? "Refreshing..."
                : "Refresh";
    }
}