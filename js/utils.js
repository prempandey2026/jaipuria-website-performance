// ============================================================
// Common Utilities
// ============================================================


// ============================================================
// Number Helpers
// ============================================================

export function toNumber(value) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


export function formatNumber(value) {

    return toNumber(value)
        .toLocaleString("en-IN");
}


export function formatPercent(
    value,
    decimals = 1
) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0%";
    }

    return `${number.toFixed(decimals)}%`;
}


// ============================================================
// HTML Escape
// ============================================================

export function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ============================================================
// UI Classes
// ============================================================

export const UI = {

    card:
        "group relative overflow-hidden rounded-2xl " +
        "border border-slate-200/80 bg-white shadow-sm " +
        "transition-all duration-300 ease-out " +
        "hover:-translate-y-0.5 hover:shadow-lg",

    cardStatic:
        "rounded-2xl border border-slate-200/80 " +
        "bg-white shadow-sm",

    sectionTitle:
        "text-lg font-semibold tracking-tight text-slate-900",

    muted:
        "text-sm text-slate-500",

    select:
        "w-full rounded-xl border border-slate-200 " +
        "bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 " +
        "outline-none transition-all duration-200 " +
        "hover:border-slate-300 " +
        "focus:border-blue-500 focus:bg-white " +
        "focus:ring-4 focus:ring-blue-500/10",

    button:
        "inline-flex items-center justify-center gap-2 " +
        "rounded-xl px-4 py-2.5 text-sm font-medium " +
        "transition-all duration-200 " +
        "active:scale-[0.98]",

    primaryButton:
        "bg-slate-900 text-white shadow-sm " +
        "hover:-translate-y-0.5 hover:bg-slate-800 " +
        "hover:shadow-md",

    secondaryButton:
        "border border-slate-200 bg-white text-slate-700 " +
        "hover:-translate-y-0.5 hover:bg-slate-50 " +
        "hover:shadow-sm",

    kpiCard:
        "group relative overflow-hidden rounded-2xl " +
        "border border-slate-200/80 bg-white p-5 shadow-sm " +
        "transition-all duration-300 ease-out " +
        "hover:-translate-y-1 hover:shadow-xl",

    kpiValue:
        "mt-2 text-2xl font-bold tracking-tight text-slate-900"
};


// ============================================================
// Page Animation
// ============================================================

export function animatePageContent() {

    const pageContent =
        document.getElementById("pageContent");

    if (!pageContent) {
        return;
    }

    pageContent.classList.remove(
        "opacity-0",
        "translate-y-2"
    );

    pageContent.classList.add(
        "opacity-100",
        "translate-y-0"
    );
}


// ============================================================
// Lucide Icons
// ============================================================

export function initializeIcons() {

    if (
        typeof lucide !== "undefined" &&
        typeof lucide.createIcons === "function"
    ) {
        lucide.createIcons();
    }
}


// ============================================================
// Empty State
// ============================================================

export function renderEmptyState(
    message = "No data available."
) {

    return `
        <div
            class="
                flex min-h-32
                items-center
                justify-center
            "
        >

            <div class="text-center">

                <div
                    class="
                        mx-auto mb-2
                        flex h-10 w-10
                        items-center justify-center
                        rounded-full
                        bg-slate-100
                    "
                >
                    <i
                        data-lucide="inbox"
                        class="h-5 w-5 text-slate-400"
                    ></i>
                </div>

                <p class="text-sm text-slate-500">
                    ${escapeHtml(message)}
                </p>

            </div>

        </div>
    `;
}