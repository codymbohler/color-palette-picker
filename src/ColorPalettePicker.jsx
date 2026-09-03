import React, { useState, useMemo } from "react";
import {
  Sun,
  Moon,
  Palette as PaletteIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Star,
  Download,
  MoreHorizontal,
} from "lucide-react";

/* ----------------------------------------------------------------
   Color data & math
   ---------------------------------------------------------------- */

// Authoritative CSS4 extended color keywords (name, hex), trimmed of
// duplicate spellings (grey/gray) and used to find a colloquial name
// for any generated color.
const NAMED_COLORS = [
  ["Alice Blue", "#F0F8FF"], ["Antique White", "#FAEBD7"], ["Aqua", "#00FFFF"],
  ["Aquamarine", "#7FFFD4"], ["Azure", "#F0FFFF"], ["Beige", "#F5F5DC"],
  ["Bisque", "#FFE4C4"], ["Black", "#000000"], ["Blanched Almond", "#FFEBCD"],
  ["Blue", "#0000FF"], ["Blue Violet", "#8A2BE2"], ["Brown", "#A52A2A"],
  ["Burlywood", "#DEB887"], ["Cadet Blue", "#5F9EA0"], ["Chartreuse", "#7FFF00"],
  ["Chocolate", "#D2691E"], ["Coral", "#FF7F50"], ["Cornflower Blue", "#6495ED"],
  ["Cornsilk", "#FFF8DC"], ["Crimson", "#DC143C"], ["Dark Blue", "#00008B"],
  ["Dark Cyan", "#008B8B"], ["Dark Goldenrod", "#B8860B"], ["Dark Gray", "#A9A9A9"],
  ["Dark Green", "#006400"], ["Dark Khaki", "#BDB76B"], ["Dark Magenta", "#8B008B"],
  ["Dark Olive Green", "#556B2F"], ["Dark Orange", "#FF8C00"], ["Dark Orchid", "#9932CC"],
  ["Dark Red", "#8B0000"], ["Dark Salmon", "#E9967A"], ["Dark Sea Green", "#8FBC8F"],
  ["Dark Slate Blue", "#483D8B"], ["Dark Slate Gray", "#2F4F4F"], ["Dark Turquoise", "#00CED1"],
  ["Dark Violet", "#9400D3"], ["Deep Pink", "#FF1493"], ["Deep Sky Blue", "#00BFFF"],
  ["Dim Gray", "#696969"], ["Dodger Blue", "#1E90FF"], ["Firebrick", "#B22222"],
  ["Floral White", "#FFFAF0"], ["Forest Green", "#228B22"], ["Fuchsia", "#FF00FF"],
  ["Gainsboro", "#DCDCDC"], ["Ghost White", "#F8F8FF"], ["Gold", "#FFD700"],
  ["Goldenrod", "#DAA520"], ["Gray", "#808080"], ["Green", "#008000"],
  ["Green Yellow", "#ADFF2F"], ["Honeydew", "#F0FFF0"], ["Hot Pink", "#FF69B4"],
  ["Indian Red", "#CD5C5C"], ["Indigo", "#4B0082"], ["Ivory", "#FFFFF0"],
  ["Khaki", "#F0E68C"], ["Lavender", "#E6E6FA"], ["Lavender Blush", "#FFF0F5"],
  ["Lawn Green", "#7CFC00"], ["Lemon Chiffon", "#FFFACD"], ["Light Blue", "#ADD8E6"],
  ["Light Coral", "#F08080"], ["Light Cyan", "#E0FFFF"], ["Light Goldenrod Yellow", "#FAFAD2"],
  ["Light Gray", "#D3D3D3"], ["Light Green", "#90EE90"], ["Light Pink", "#FFB6C1"],
  ["Light Salmon", "#FFA07A"], ["Light Sea Green", "#20B2AA"], ["Light Sky Blue", "#87CEFA"],
  ["Light Slate Gray", "#778899"], ["Light Steel Blue", "#B0C4DE"], ["Light Yellow", "#FFFFE0"],
  ["Lime", "#00FF00"], ["Lime Green", "#32CD32"], ["Linen", "#FAF0E6"],
  ["Magenta", "#FF00FF"], ["Maroon", "#800000"], ["Medium Aquamarine", "#66CDAA"],
  ["Medium Blue", "#0000CD"], ["Medium Orchid", "#BA55D3"], ["Medium Purple", "#9370DB"],
  ["Medium Sea Green", "#3CB371"], ["Medium Slate Blue", "#7B68EE"], ["Medium Spring Green", "#00FA9A"],
  ["Medium Turquoise", "#48D1CC"], ["Medium Violet Red", "#C71585"], ["Midnight Blue", "#191970"],
  ["Mint Cream", "#F5FFFA"], ["Misty Rose", "#FFE4E1"], ["Moccasin", "#FFE4B5"],
  ["Navajo White", "#FFDEAD"], ["Navy", "#000080"], ["Old Lace", "#FDF5E6"],
  ["Olive", "#808000"], ["Olive Drab", "#6B8E23"], ["Orange", "#FFA500"],
  ["Orange Red", "#FF4500"], ["Orchid", "#DA70D6"], ["Pale Goldenrod", "#EEE8AA"],
  ["Pale Green", "#98FB98"], ["Pale Turquoise", "#AFEEEE"], ["Pale Violet Red", "#DB7093"],
  ["Papaya Whip", "#FFEFD5"], ["Peach Puff", "#FFDAB9"], ["Peru", "#CD853F"],
  ["Pink", "#FFC0CB"], ["Plum", "#DDA0DD"], ["Powder Blue", "#B0E0E6"],
  ["Purple", "#800080"], ["Rebecca Purple", "#663399"], ["Red", "#FF0000"],
  ["Rosy Brown", "#BC8F8F"], ["Royal Blue", "#4169E1"], ["Saddle Brown", "#8B4513"],
  ["Salmon", "#FA8072"], ["Sandy Brown", "#F4A460"], ["Sea Green", "#2E8B57"],
  ["Seashell", "#FFF5EE"], ["Sienna", "#A0522D"], ["Silver", "#C0C0C0"],
  ["Sky Blue", "#87CEEB"], ["Slate Blue", "#6A5ACD"], ["Slate Gray", "#708090"],
  ["Snow", "#FFFAFA"], ["Spring Green", "#00FF7F"], ["Steel Blue", "#4682B4"],
  ["Tan", "#D2B48C"], ["Teal", "#008080"], ["Thistle", "#D8BFD8"],
  ["Tomato", "#FF6347"], ["Turquoise", "#40E0D0"], ["Violet", "#EE82EE"],
  ["Wheat", "#F5DEB3"], ["White", "#FFFFFF"], ["White Smoke", "#F5F5F5"],
  ["Yellow", "#FFFF00"], ["Yellow Green", "#9ACD32"],
].map(([name, hex]) => ({ name, hex }));

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function nearestColorName(hex) {
  const { r, g, b } = hexToRgb(hex);
  let best = NAMED_COLORS[0];
  let bestDist = Infinity;
  for (const entry of NAMED_COLORS) {
    const c = hexToRgb(entry.hex);
    const dist = (r - c.r) ** 2 + (g - c.g) ** 2 + (b - c.b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = entry;
    }
  }
  return best.name;
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastText(hex) {
  return relativeLuminance(hex) > 0.45 ? "#16181D" : "#FFFFFF";
}

/* ----------------------------------------------------------------
   Palette harmony generators
   ---------------------------------------------------------------- */

const GENERATORS = {
  monochromatic: (h) => ({
    primary: hslToHex(h, 62, 38),
    secondary: hslToHex(h, 30, 68),
    accent: hslToHex(h, 72, 55),
    background: hslToHex(h, 25, 97),
    surface: hslToHex(h, 28, 92),
    text: hslToHex(h, 30, 15),
  }),
  analogous: (h) => ({
    primary: hslToHex(h, 55, 42),
    secondary: hslToHex(h - 30, 40, 55),
    accent: hslToHex(h + 30, 65, 55),
    background: hslToHex(h, 22, 97),
    surface: hslToHex(h - 30, 25, 93),
    text: hslToHex(h, 25, 15),
  }),
  complementary: (h) => ({
    primary: hslToHex(h, 55, 40),
    secondary: hslToHex(h, 28, 68),
    accent: hslToHex(h + 180, 65, 50),
    background: hslToHex(h, 20, 97),
    surface: hslToHex(h + 180, 22, 94),
    text: hslToHex(h, 25, 14),
  }),
  splitComplementary: (h) => ({
    primary: hslToHex(h, 55, 40),
    secondary: hslToHex(h + 150, 45, 52),
    accent: hslToHex(h + 210, 60, 55),
    background: hslToHex(h, 20, 97),
    surface: hslToHex(h, 18, 93),
    text: hslToHex(h, 25, 14),
  }),
  triadic: (h) => ({
    primary: hslToHex(h, 55, 42),
    secondary: hslToHex(h + 120, 40, 48),
    accent: hslToHex(h + 240, 55, 52),
    background: hslToHex(h, 18, 97),
    surface: hslToHex(h, 18, 93),
    text: hslToHex(h, 25, 14),
  }),
};

const PALETTE_TYPES = [
  { key: "monochromatic", label: "Monochromatic", hues: [216, 158, 275, 8, 42] },
  { key: "analogous", label: "Analogous", hues: [205, 25, 305, 145] },
  { key: "complementary", label: "Complementary", hues: [216, 30, 260, 100] },
  { key: "splitComplementary", label: "Split-Complementary", hues: [190, 340, 55, 250] },
  { key: "triadic", label: "Triadic", hues: [220, 15, 270, 130] },
];

const ROLE_ORDER = ["primary", "secondary", "accent", "background", "surface", "text"];
const ROLE_INFO = {
  primary: { label: "Primary", usage: "main buttons, links and headings" },
  secondary: { label: "Secondary", usage: "secondary buttons and supporting text" },
  accent: { label: "Accent", usage: "highlights and call-to-action moments" },
  background: { label: "Background", usage: "the page background" },
  surface: { label: "Surface", usage: "cards, nav bars and panels" },
  text: { label: "Text", usage: "body copy and headings" },
};

function buildPalette(typeKey, hue) {
  const raw = GENERATORS[typeKey](hue);
  const roles = {};
  for (const key of ROLE_ORDER) {
    roles[key] = { hex: raw[key], name: nearestColorName(raw[key]) };
  }
  return roles;
}

/* ----------------------------------------------------------------
   Small UI pieces
   ---------------------------------------------------------------- */

function ModeButton({ Icon, active, onClick, chrome, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        backgroundColor: active ? chrome.accent : "transparent",
        color: active ? chrome.accentText : chrome.textSecondary,
        boxShadow: active ? "inset 0 2px 5px rgba(0,0,0,0.32)" : "none",
      }}
    >
      <Icon size={16} strokeWidth={2.25} />
    </button>
  );
}

function ArrowButton({ Icon, onClick, chrome, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-150 hover:scale-105"
      style={{ backgroundColor: chrome.surface, border: `1px solid ${chrome.border}`, color: chrome.text }}
    >
      <Icon size={18} />
    </button>
  );
}

function TypeButton({ type, active, isOpen, previewPalette, onClick, chrome }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-3 rounded-3xl p-4 sm:p-5 text-left transition-colors duration-150"
      style={{
        backgroundColor: active ? chrome.accent : chrome.surface,
        border: `1px solid ${active ? chrome.accent : chrome.border}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {["primary", "secondary", "accent", "background"].map((k) => (
            <span
              key={k}
              className="w-5 h-5 rounded-full"
              style={{
                backgroundColor: previewPalette[k].hex,
                border: `2px solid ${active ? chrome.accent : chrome.surface}`,
              }}
            />
          ))}
        </div>
        <ChevronDown
          size={16}
          style={{
            color: active ? chrome.accentText : chrome.textSecondary,
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform 200ms",
          }}
        />
      </div>
      <span className="text-sm font-semibold" style={{ color: active ? chrome.accentText : chrome.text }}>
        {type.label}
      </span>
    </button>
  );
}

function BrowserFrame({ chrome, siteLabel, children }) {
  return (
    <div
      className="w-full max-w-3xl rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${chrome.border}`, boxShadow: "0 24px 48px -24px rgba(0,0,0,0.28)" }}
    >
      <div
        className="flex items-center gap-3 px-4 py-2.5"
        style={{ backgroundColor: chrome.surface, borderBottom: `1px solid ${chrome.border}` }}
      >
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <ArrowLeft size={14} style={{ color: chrome.textSecondary }} />
          <RefreshCw size={13} style={{ color: chrome.textSecondary }} />
        </div>
        <div
          className="flex-1 rounded-full px-3 py-1 text-xs text-left truncate"
          style={{ backgroundColor: chrome.bg, color: chrome.textSecondary }}
        >
          https://{siteLabel}
        </div>
        <Star size={14} className="flex-shrink-0" style={{ color: chrome.textSecondary }} />
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Download size={14} style={{ color: chrome.textSecondary }} />
          <MoreHorizontal size={14} style={{ color: chrome.textSecondary }} />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Mock website templates (each takes the active palette)
   ---------------------------------------------------------------- */

function SaasSite({ palette: c }) {
  const features = [
    ["Shared calendars", "Everyone sees the plan."],
    ["Smart reminders", "Nothing gets missed."],
    ["Simple reports", "Progress at a glance."],
  ];
  return (
    <div style={{ backgroundColor: c.background.hex, minHeight: "460px" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: c.surface.hex }}>
        <span className="font-bold text-sm" style={{ color: c.text.hex }}>Nova</span>
        <div className="hidden sm:flex items-center gap-5 text-xs" style={{ color: c.text.hex, opacity: 0.7 }}>
          <span>Product</span>
          <span>Pricing</span>
          <span>About</span>
        </div>
        <button
          className="text-xs font-semibold px-4 py-2 rounded-full"
          style={{ backgroundColor: c.primary.hex, color: contrastText(c.primary.hex) }}
        >
          Get started
        </button>
      </div>
      <div className="px-6 sm:px-10 py-10 sm:py-14 text-center flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl font-bold max-w-md" style={{ color: c.text.hex }}>
          Plan your week without the chaos
        </h1>
        <p className="text-xs sm:text-sm mt-3 max-w-sm" style={{ color: c.text.hex, opacity: 0.65 }}>
          Nova keeps a team's tasks, docs and deadlines in one calm, shared view.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            className="text-xs font-semibold px-5 py-2.5 rounded-full"
            style={{ backgroundColor: c.primary.hex, color: contrastText(c.primary.hex) }}
          >
            Start free trial
          </button>
          <button
            className="text-xs font-semibold px-5 py-2.5 rounded-full"
            style={{ border: `1px solid ${c.secondary.hex}`, color: c.text.hex }}
          >
            Watch demo
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 sm:px-10 pb-10">
        {features.map(([title, desc]) => (
          <div key={title} className="rounded-xl p-4" style={{ backgroundColor: c.surface.hex }}>
            <div className="w-7 h-7 rounded-full mb-3" style={{ backgroundColor: c.accent.hex }} />
            <div className="text-xs font-semibold" style={{ color: c.text.hex }}>{title}</div>
            <div className="text-xs mt-1" style={{ color: c.text.hex, opacity: 0.6 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioSite({ palette: c }) {
  const projects = [
    ["Fintech dashboard redesign", "UX"],
    ["Onboarding flow for a health app", "Mobile"],
    ["Design system for a logistics startup", "Systems"],
  ];
  const tagColor = (tag) => (tag === "UX" ? c.primary.hex : tag === "Mobile" ? c.secondary.hex : c.accent.hex);
  return (
    <div style={{ backgroundColor: c.background.hex, minHeight: "460px" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: c.surface.hex }}>
        <span className="font-bold text-sm" style={{ color: c.text.hex }}>J. Rivera</span>
        <div className="flex items-center gap-5 text-xs" style={{ color: c.text.hex, opacity: 0.7 }}>
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="px-6 sm:px-10 py-10">
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{ backgroundColor: c.accent.hex, color: contrastText(c.accent.hex) }}
        >
          Available for work
        </span>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: c.text.hex }}>Jordan Rivera</h1>
        <p className="text-xs sm:text-sm mt-2 max-w-sm" style={{ color: c.text.hex, opacity: 0.65 }}>
          Product designer focused on clear, usable interfaces for small teams.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 sm:px-10 pb-10">
        {projects.map(([title, tag]) => (
          <div key={title} className="rounded-xl overflow-hidden" style={{ backgroundColor: c.surface.hex }}>
            <div className="h-20" style={{ backgroundColor: tagColor(tag) }} />
            <div className="p-3">
              <span className="text-xs font-semibold" style={{ color: c.primary.hex }}>{tag}</span>
              <div className="text-xs mt-1" style={{ color: c.text.hex }}>{title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopSite({ palette: c }) {
  const products = [
    ["Canvas tote", "$38"],
    ["Wool scarf", "$54"],
    ["Leather notebook", "$29"],
  ];
  return (
    <div style={{ backgroundColor: c.background.hex, minHeight: "460px" }}>
      <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: c.surface.hex }}>
        <span className="font-bold text-sm" style={{ color: c.text.hex }}>Fernweg</span>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: c.primary.hex, color: contrastText(c.primary.hex) }}
        >
          <ShoppingBag size={14} />
        </button>
      </div>
      <div
        className="px-6 sm:px-10 py-3 text-center text-xs font-semibold"
        style={{ backgroundColor: c.accent.hex, color: contrastText(c.accent.hex) }}
      >
        End of season sale: 20% off everything
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 sm:px-10 py-8">
        {products.map(([name, price]) => (
          <div key={name} className="rounded-xl overflow-hidden" style={{ backgroundColor: c.surface.hex }}>
            <div className="h-24" style={{ backgroundColor: c.secondary.hex, opacity: 0.55 }} />
            <div className="p-3">
              <div className="text-xs font-semibold" style={{ color: c.text.hex }}>{name}</div>
              <div className="text-xs mt-0.5" style={{ color: c.text.hex, opacity: 0.6 }}>{price}</div>
              <button
                className="text-xs font-semibold mt-2 px-3 py-1.5 rounded-full w-full"
                style={{ backgroundColor: c.primary.hex, color: contrastText(c.primary.hex) }}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogSite({ palette: c }) {
  const posts = [
    ["Food", "What a Lisbon market taught me about patience"],
    ["Culture", "Why small libraries still matter"],
  ];
  return (
    <div style={{ backgroundColor: c.background.hex, minHeight: "460px" }}>
      <div className="flex items-center px-6 py-4" style={{ backgroundColor: c.surface.hex }}>
        <span className="font-bold text-sm" style={{ color: c.text.hex }}>The Long Read</span>
      </div>
      <div className="px-6 sm:px-10 py-8">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: c.accent.hex, color: contrastText(c.accent.hex) }}
        >
          Travel
        </span>
        <h1 className="text-lg sm:text-xl font-bold mt-3 max-w-sm" style={{ color: c.text.hex }}>
          Slow mornings in a small coastal town
        </h1>
        <p className="text-xs mt-2" style={{ color: c.text.hex, opacity: 0.6 }}>By Elena Cho, 6 minute read</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 sm:px-10 pb-10">
        {posts.map(([tag, title]) => (
          <div key={title} className="rounded-xl p-4" style={{ backgroundColor: c.surface.hex }}>
            <span className="text-xs font-semibold" style={{ color: c.primary.hex }}>{tag}</span>
            <div className="text-xs sm:text-sm mt-1 font-semibold" style={{ color: c.text.hex }}>{title}</div>
            <span className="text-xs mt-2 inline-block font-semibold" style={{ color: c.secondary.hex }}>
              Read more
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCK_SITES = [
  { label: "nova.app", name: "SaaS landing page", Component: SaasSite },
  { label: "jrivera.design", name: "Portfolio", Component: PortfolioSite },
  { label: "fernweg.shop", name: "Online shop", Component: ShopSite },
  { label: "thelongread.co", name: "Editorial blog", Component: BlogSite },
];

/* ----------------------------------------------------------------
   Main app
   ---------------------------------------------------------------- */

export default function ColorPalettePicker() {
  const [typeKey, setTypeKey] = useState("monochromatic");
  const [hueIndexByType, setHueIndexByType] = useState({
    monochromatic: 0,
    analogous: 0,
    complementary: 0,
    splitComplementary: 0,
    triadic: 0,
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [appTheme, setAppTheme] = useState("light");
  const [mockIndex, setMockIndex] = useState(0);

  const activeType = PALETTE_TYPES.find((t) => t.key === typeKey);
  const activeHue = activeType.hues[hueIndexByType[typeKey]];
  const palette = useMemo(() => buildPalette(typeKey, activeHue), [typeKey, activeHue]);

  const chrome = useMemo(() => {
    if (appTheme === "dark") {
      return {
        bg: "#0F1115",
        surface: "#171A20",
        border: hexToRgba("#FFFFFF", 0.1),
        text: "#F2F3F5",
        textSecondary: "#9AA0AC",
        accent: "#F2F3F5",
        accentText: "#0F1115",
      };
    }
    if (appTheme === "palette") {
      return {
        bg: palette.background.hex,
        surface: palette.surface.hex,
        border: hexToRgba(palette.text.hex, 0.16),
        text: palette.text.hex,
        textSecondary: palette.secondary.hex,
        accent: palette.primary.hex,
        accentText: contrastText(palette.primary.hex),
      };
    }
    return {
      bg: "#F4F5F7",
      surface: "#FFFFFF",
      border: hexToRgba("#15171C", 0.1),
      text: "#15171C",
      textSecondary: "#6B7280",
      accent: "#15171C",
      accentText: "#FFFFFF",
    };
  }, [appTheme, palette]);

  const getPreview = (t) => buildPalette(t.key, t.hues[hueIndexByType[t.key]]);
  const CurrentSite = MOCK_SITES[mockIndex].Component;

  return (
    <div
      className="min-h-screen w-full font-sans"
      style={{ backgroundColor: chrome.bg, color: chrome.text, transition: "background-color 250ms, color 250ms" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div
            className="flex flex-col font-black text-2xl sm:text-4xl md:text-5xl tracking-tight"
            style={{ color: chrome.text, lineHeight: 0.92 }}
          >
            <span>COLOR</span>
            <span>PALETTE</span>
            <span>PICKER</span>
          </div>
          <div
            className="flex items-center gap-1 p-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: chrome.surface, border: `1px solid ${chrome.border}` }}
          >
            <ModeButton Icon={Sun} active={appTheme === "light"} onClick={() => setAppTheme("light")} chrome={chrome} label="Light mode" />
            <ModeButton Icon={Moon} active={appTheme === "dark"} onClick={() => setAppTheme("dark")} chrome={chrome} label="Dark mode" />
            <ModeButton Icon={PaletteIcon} active={appTheme === "palette"} onClick={() => setAppTheme("palette")} chrome={chrome} label="Palette mode" />
          </div>
        </div>

        {/* Palette type buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PALETTE_TYPES.map((t) => (
            <TypeButton
              key={t.key}
              type={t}
              active={t.key === typeKey}
              isOpen={openDropdown === t.key}
              previewPalette={getPreview(t)}
              onClick={() => setOpenDropdown(openDropdown === t.key ? null : t.key)}
              chrome={chrome}
            />
          ))}
        </div>

        {/* Dropdown panel */}
        <div style={{ maxHeight: openDropdown ? "640px" : "0px", overflow: "hidden", transition: "max-height 300ms ease" }}>
          {openDropdown &&
            (() => {
              const t = PALETTE_TYPES.find((x) => x.key === openDropdown);
              return (
                <div className="mt-3 rounded-2xl p-4 sm:p-5" style={{ backgroundColor: chrome.surface, border: `1px solid ${chrome.border}` }}>
                  <div className="text-sm font-semibold mb-3" style={{ color: chrome.text }}>{t.label} palettes</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {t.hues.map((h, i) => {
                      const p = buildPalette(t.key, h);
                      const selected = t.key === typeKey && i === hueIndexByType[t.key];
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setTypeKey(t.key);
                            setHueIndexByType((prev) => ({ ...prev, [t.key]: i }));
                            setOpenDropdown(null);
                          }}
                          className="rounded-xl p-3 text-left transition-colors duration-150"
                          style={{
                            backgroundColor: selected ? chrome.accent : chrome.bg,
                            border: `1px solid ${selected ? chrome.accent : chrome.border}`,
                          }}
                        >
                          <div className="flex gap-1 mb-2">
                            {ROLE_ORDER.filter((k) => k !== "text").map((k) => (
                              <span key={k} className="flex-1 h-6 rounded" style={{ backgroundColor: p[k].hex }} />
                            ))}
                          </div>
                          <div className="text-xs font-semibold" style={{ color: selected ? chrome.accentText : chrome.text }}>
                            {p.primary.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
        </div>

        {/* Mock website preview */}
        <div className="mt-10">
          <div className="text-center text-xs font-medium mb-3" style={{ color: chrome.textSecondary }}>
            Palette Preview
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <ArrowButton
              Icon={ChevronLeft}
              chrome={chrome}
              label="Previous example"
              onClick={() => setMockIndex((mockIndex - 1 + MOCK_SITES.length) % MOCK_SITES.length)}
            />
            <BrowserFrame chrome={chrome} siteLabel={MOCK_SITES[mockIndex].label}>
              <CurrentSite palette={palette} />
            </BrowserFrame>
            <ArrowButton
              Icon={ChevronRight}
              chrome={chrome}
              label="Next example"
              onClick={() => setMockIndex((mockIndex + 1) % MOCK_SITES.length)}
            />
          </div>
          <div className="text-center mt-3 text-xs font-medium" style={{ color: chrome.textSecondary }}>
            {MOCK_SITES[mockIndex].name}
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            {MOCK_SITES.map((site, i) => (
              <button
                key={site.label}
                onClick={() => setMockIndex(i)}
                aria-label={`Show ${site.name} example`}
                aria-current={i === mockIndex}
                className="w-2 h-2 rounded-full transition-colors duration-150"
                style={{ backgroundColor: i === mockIndex ? chrome.accent : chrome.border }}
              />
            ))}
          </div>
        </div>

        {/* Palette breakdown */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4" style={{ color: chrome.text }}>Palette breakdown</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLE_ORDER.map((roleKey) => {
              const info = ROLE_INFO[roleKey];
              const c = palette[roleKey];
              return (
                <div
                  key={roleKey}
                  className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ backgroundColor: chrome.surface, border: `1px solid ${chrome.border}` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: c.hex, border: `1px solid ${hexToRgba("#000000", 0.08)}` }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: chrome.text }}>{c.name}</span>
                      <span className="font-mono text-xs" style={{ color: chrome.textSecondary }}>{c.hex}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: chrome.textSecondary }}>
                      {info.label}: {info.usage}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
