export type ProductType =
  | "Digital Product"
  | "Service"
  | "Booking"
  | "Event"
  | "Course"
  | "Subscription"
  | "Physical Product"
  | "Other";

export const PRODUCT_TYPES: {
  type: ProductType;
  icon: string;
  blurb: string;
  emoji: string;
  digital: boolean;
}[] = [
  {
    type: "Digital Product",
    icon: "file",
    blurb: "Ebooks, templates, beats, design packs, PDFs.",
    emoji: "📁",
    digital: true,
  },
  {
    type: "Service",
    icon: "sparkles",
    blurb: "Design, repair, consultancy, delivery, tutoring.",
    emoji: "🛠️",
    digital: false,
  },
  {
    type: "Booking",
    icon: "calendar",
    blurb: "Salon slots, photoshoots, pitch, court hire.",
    emoji: "📅",
    digital: false,
  },
  {
    type: "Event",
    icon: "ticket",
    blurb: "Tickets, meetups, church & harambee drives.",
    emoji: "🎟️",
    digital: true,
  },
  {
    type: "Course",
    icon: "graduation",
    blurb: "Video lessons, cohorts, masterclasses.",
    emoji: "🎓",
    digital: true,
  },
  {
    type: "Subscription",
    icon: "refresh",
    blurb: "Memberships, newsletters, monthly care.",
    emoji: "🔁",
    digital: true,
  },
  {
    type: "Physical Product",
    icon: "package",
    blurb: "Sneakers, food, crafts, electronics, produce.",
    emoji: "📦",
    digital: false,
  },
  {
    type: "Other",
    icon: "link",
    blurb: "Donations, harambee, anything creative.",
    emoji: "✨",
    digital: false,
  },
];

export const CATEGORIES = [
  "Business & Money",
  "Design & Creative",
  "Education",
  "Beauty & Grooming",
  "Fashion",
  "Food & Drink",
  "Events & Entertainment",
  "Health & Fitness",
  "Electronics",
  "Home & Crafts",
  "Other",
];

export type Product = {
  code: string;
  name: string;
  seller: string;
  handle: string;
  sellerAvatarSeed: string;
  type: ProductType;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  delivery: string;
  rating: number;
  sales: number;
  badge?: string;
  instant?: boolean;
};

const px = (id: string, w = 760, h = 760) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const PRODUCTS: Product[] = [
  {
    code: "abc123",
    name: "Social Media Growth Kit for Kenyan Brands",
    seller: "Achieng Digital Studio",
    handle: "@achiengdigital",
    sellerAvatarSeed: "AD",
    type: "Digital Product",
    category: "Business & Money",
    description: "90 content templates, caption bank and a 30-day posting calendar.",
    longDescription:
      "Everything a small Kenyan brand needs to post consistently: 90 editable Canva templates, a 200-line caption bank in English & Sheng', a 30-day posting calendar and a hook swipe file. Instant download after payment verification.",
    price: 1200,
    image: px("19537356"),
    delivery: "Instant download • PDF + Canva links (18 MB)",
    rating: 4.9,
    sales: 312,
    badge: "Best seller",
    instant: true,
  },
  {
    code: "kit7xz",
    name: "M-Pesa Bookkeeping for Small Business — Course",
    seller: "Wanjiru Trainers",
    handle: "@wanjirutrainers",
    sellerAvatarSeed: "WT",
    type: "Course",
    category: "Education",
    description: "6 video lessons that turn your till and M-Pesa records into clean books.",
    longDescription:
      "Six practical video lessons (Kiswahili + English subtitles) covering daily till reconciliation, M-Pesa statements, simple P&L and how to price for profit. Lifetime access, certificate of completion, private WhatsApp group.",
    price: 2500,
    image: px("20432872", 900, 620),
    delivery: "Instant access • 6 video lessons (3h 20m)",
    rating: 4.8,
    sales: 189,
    badge: "Top rated",
    instant: true,
  },
  {
    code: "call55",
    name: "1-on-1 Brand Strategy Call — 45 Minutes",
    seller: "Brian Otieno Consulting",
    handle: "@brianstrategy",
    sellerAvatarSeed: "BO",
    type: "Service",
    category: "Business & Money",
    description: "A focused call to sharpen your offer, pricing and go-to-market.",
    longDescription:
      "We audit your product, pricing and channels, then leave you with a one-page action plan. You will receive a booking confirmation instantly and a calendar link to pick your slot.",
    price: 1500,
    image: px("8312669"),
    delivery: "Booking confirmed • Google Meet / Phone call",
    rating: 5,
    sales: 96,
    instant: false,
  },
  {
    code: "glam99",
    name: "Salon Braiding Appointment — Nairobi CBD",
    seller: "Glam House Kenya",
    handle: "@glamhouseke",
    sellerAvatarSeed: "GH",
    type: "Booking",
    category: "Beauty & Grooming",
    description: "Knotless, cornrows or twist. Secure your chair with a deposit.",
    longDescription:
      "Reserve your stylist for knotless braids, cornrows or twists. Price shown is the booking deposit; balance is settled at the salon. Free touch-up within 7 days.",
    price: 2000,
    image: px("13430270"),
    delivery: "Appointment • Mon–Sat, 8:00am – 7:00pm",
    rating: 4.7,
    sales: 540,
    badge: "Fast booking",
    instant: false,
  },
  {
    code: "afro22",
    name: "Afro Futures Night — General Admission",
    seller: "Sauti Collective",
    handle: "@sauticollective",
    sellerAvatarSeed: "SC",
    type: "Event",
    category: "Events & Entertainment",
    description: "Live band, DJs and street food. Sarakasi Dome, Nairobi.",
    longDescription:
      "One night, four live acts and three DJs. Doors open 6:00pm, show starts 8:00pm. Your digital ticket carries a QR code that is scanned at the gate. Strictly 18+.",
    price: 800,
    image: px("13230484", 900, 620),
    delivery: "Digital ticket with QR • Sat 8:00pm, Sarakasi Dome",
    rating: 4.6,
    sales: 1284,
    badge: "Selling fast",
    instant: true,
  },
  {
    code: "sub3mth",
    name: "Hustle Insights Newsletter — 3 Months",
    seller: "Matara Media",
    handle: "@mataramedia",
    sellerAvatarSeed: "MM",
    type: "Subscription",
    category: "Business & Money",
    description: "Weekly money-making intel for Kenyan micro-businesses.",
    longDescription:
      "Every Tuesday: supplier leads, price-watch on fast-moving goods, tender alerts and one growth tactic you can apply the same day. Delivered by email and WhatsApp.",
    price: 300,
    image: px("5704728", 900, 620),
    delivery: "Email + WhatsApp • Every Tuesday",
    rating: 4.5,
    sales: 421,
    instant: true,
  },
  {
    code: "pod450",
    name: "Studio Wireless Headphones (Refurb A-Grade)",
    seller: "SoundPlug Nairobi",
    handle: "@soundplug254",
    sellerAvatarSeed: "SP",
    type: "Physical Product",
    category: "Electronics",
    description: "40h battery, noise cancelling, 6-month seller warranty.",
    longDescription:
      "A-grade refurbished studio headphones, fully tested with 40-hour battery life and active noise cancelling. Includes carry case and USB-C cable. Same-day delivery within Nairobi, countrywide courier in 1–3 days.",
    price: 4500,
    image: px("3394650"),
    delivery: "Courier • Nairobi same-day, countrywide 1–3 days",
    rating: 4.4,
    sales: 77,
    instant: false,
  },
  {
    code: "bead80",
    name: "Handmade Maasai Beaded Bracelet",
    seller: "Naserian Crafts",
    handle: "@naseriancrafts",
    sellerAvatarSeed: "NC",
    type: "Physical Product",
    category: "Home & Crafts",
    description: "Hand-beaded in Kajiado. Adjustable, unisex, gift ready.",
    longDescription:
      "Each bracelet is hand-beaded by women artisans in Kajiado using glass beads and strong waxed thread. Adjustable to fit most wrists and comes gift-wrapped in a kiondo pouch.",
    price: 950,
    image: px("1212048"),
    delivery: "Courier • Padded envelope, countrywide",
    rating: 4.9,
    sales: 268,
    badge: "Artisan made",
    instant: false,
  },
  {
    code: "logo77",
    name: "Logo Starter Pack — 20 Editable Templates",
    seller: "Achieng Digital Studio",
    handle: "@achiengdigital",
    sellerAvatarSeed: "AD",
    type: "Digital Product",
    category: "Design & Creative",
    description: "Editable logo templates plus a brand colour and font cheat sheet.",
    longDescription:
      "Twenty fully editable logo templates (Canva + Illustrator), 8 badge variations, a brand colour cheat sheet and a font pairing guide. Swap the name, export, done.",
    price: 700,
    image: px("4959935", 900, 620),
    delivery: "Instant download • Canva + AI files (34 MB)",
    rating: 4.7,
    sales: 233,
    instant: true,
  },
  {
    code: "fit12",
    name: "Home Fitness Coaching Plan — 4 Weeks",
    seller: "Coach Kamau Fitness",
    handle: "@coachkamau",
    sellerAvatarSeed: "CK",
    type: "Subscription",
    category: "Health & Fitness",
    description: "Daily workouts, weekly check-ins, no gym required.",
    longDescription:
      "A four-week bodyweight programme delivered daily on WhatsApp with short demo videos, a simple meal guide using local food and a weekly check-in call.",
    price: 3000,
    image: px("5908766", 900, 620),
    delivery: "WhatsApp programme • Starts every Monday",
    rating: 4.8,
    sales: 141,
    instant: false,
  },
  {
    code: "food12",
    name: "Sunday Chapati & Ndengu Pack (Serves 4)",
    seller: "Mama Njeri Kitchen",
    handle: "@mamanjerike",
    sellerAvatarSeed: "MN",
    type: "Physical Product",
    category: "Food & Drink",
    description: "Fresh, hot and delivered. Order before 10am for Sunday lunch.",
    longDescription:
      "Eight soft chapatis with ndengu stew, kachumbari and fresh juice, packed hot. Delivered within Ruiru, Juja and Kiambu town. Orders close at 10:00am on Sunday.",
    price: 1250,
    image: px("12194523"),
    delivery: "Local delivery • Sun 11:00am – 2:00pm",
    rating: 4.9,
    sales: 612,
    badge: "Weekend only",
    instant: false,
  },
  {
    code: "shoot40",
    name: "Outdoor Photoshoot — 1 Hour, 15 Edited Photos",
    seller: "Lens by Mumbi",
    handle: "@lensbymumbi",
    sellerAvatarSeed: "LM",
    type: "Booking",
    category: "Design & Creative",
    description: "Portraits, brands and graduations around Nairobi.",
    longDescription:
      "One hour on location with a pro photographer. You get 15 fully edited high-resolution photos in 72 hours plus 3 reels-ready vertical clips. Travel within Nairobi included.",
    price: 6000,
    image: px("9741840"),
    delivery: "Appointment • Edited photos in 72 hours",
    rating: 5,
    sales: 88,
    instant: false,
  },
  {
    code: "craft21",
    name: "Sisal Storage Basket — Large",
    seller: "Naserian Crafts",
    handle: "@naseriancrafts",
    sellerAvatarSeed: "NC",
    type: "Physical Product",
    category: "Home & Crafts",
    description: "Handwoven sisal basket, 40cm tall. Perfect for laundry or toys.",
    longDescription:
      "Handwoven from sisal and recycled twins by a weaving cooperative in Machakos. Sturdy enough for laundry, stylish enough for the living room. Colours vary slightly, which is the beauty of handmade.",
    price: 1800,
    image: px("4053188"),
    delivery: "Courier • 1–3 days countrywide",
    rating: 4.6,
    sales: 64,
    instant: false,
  },
  {
    code: "ebook9",
    name: "25 Kenyan Family Recipes — Ebook",
    seller: "Mama Njeri Kitchen",
    handle: "@mamanjerike",
    sellerAvatarSeed: "MN",
    type: "Digital Product",
    category: "Food & Drink",
    description: "From pilau to mahamri, with shopping lists for each recipe.",
    longDescription:
      "Twenty-five tested family recipes with step photos, local shopping lists and budget swaps. Includes a seven-day family meal plan and a kids' lunchbox guide.",
    price: 450,
    image: px("9557122"),
    delivery: "Instant download • PDF, 62 pages",
    rating: 4.8,
    sales: 905,
    badge: "Under 500",
    instant: true,
  },
];

export const SELLER_STEPS = [
  { id: 1, label: "Product Type", icon: "grid" },
  { id: 2, label: "Details", icon: "image" },
  { id: 3, label: "Price", icon: "tag" },
  { id: 4, label: "Payment Number", icon: "lock" },
  { id: 5, label: "Magic Link", icon: "link" },
];

export const BUYER_FLOW = [
  { title: "Open Seller's Magic Link", text: "From WhatsApp, TikTok, SMS or a QR code.", icon: "link" },
  { title: "View Product", text: "Photos, price, delivery info — no sign up.", icon: "eye" },
  { title: "Click Buy Now", text: "One big button. No account, no forms.", icon: "cart" },
  { title: "Pay", text: "M-Pesa STK push or paybill prompt.", icon: "phone" },
  { title: "Payment Verification", text: "UZALINK confirms the payment server-side.", icon: "shield" },
  { title: "Receive Product", text: "Download, access, ticket or delivery.", icon: "download" },
  { title: "Digital Receipt", text: "Proof of purchase sent to you.", icon: "receipt" },
];

export const SELLER_FLOW = [
  { title: "Create Product", text: "Pick what you are selling.", icon: "grid" },
  { title: "Add Details", text: "Name, description, image, file.", icon: "image" },
  { title: "Set Price", text: "Your price in KSh.", icon: "tag" },
  { title: "Set Payment Number", text: "Where settlements land. Locked after setup.", icon: "lock" },
  { title: "Generate Magic Link", text: "One unique UZALINK link.", icon: "link" },
  { title: "Share Link", text: "WhatsApp, TikTok, IG, SMS, QR.", icon: "share" },
  { title: "Receive Verified Sales", text: "Payments verified automatically.", icon: "shield" },
  { title: "Get Seller Settlement", text: "95% paid out fast.", icon: "wallet" },
];

export const COMMISSION = { rate: 0.05, example: 1000 };

export const SETTLEMENT_NOTE =
  "95% seller balance is sent within 6 business working hours of the same day, subject to successful payment verification and applicable payment processing.";

export const DASHBOARD_NAV = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "earnings", label: "Earnings", icon: "wallet" },
  { key: "sales", label: "Sales", icon: "trend" },
  { key: "products", label: "Products", icon: "package" },
  { key: "magic", label: "Magic Links", icon: "link" },
  { key: "customers", label: "Customers", icon: "users" },
  { key: "orders", label: "Orders", icon: "cart" },
  { key: "downloads", label: "Downloads", icon: "download" },
  { key: "analytics", label: "Analytics", icon: "chart" },
  { key: "settlements", label: "Settlements", icon: "bank" },
  { key: "payment", label: "Payment Settings", icon: "lock" },
] as const;

export type DashboardKey = (typeof DASHBOARD_NAV)[number]["key"];

export const SELLER = {
  name: "Achieng Digital Studio",
  handle: "@achiengdigital",
  plan: "Premium",
  planPrice: 1000,
  paymentNumber: "0712 345 678",
  paymentNumberRaw: "0712345678",
  paymentLocked: true,
  verifiedSince: "12 Jan 2026",
  totalSales: 1284,
  revenue: 1_940_300,
  availableBalance: 84_650,
  pendingSettlement: 21_400,
  commissionPaid: 97_015,
  conversion: 18.4,
  avgOrder: 1_511,
  views: 10_540,
};

export const ORDERS = [
  { ref: "UZL-9F41C", product: "Social Media Growth Kit", buyer: "Kevin M.", amount: 1200, status: "Verified", when: "Today, 09:12", type: "Digital" },
  { ref: "UZL-7B22D", product: "Logo Starter Pack", buyer: "Faith W.", amount: 700, status: "Verified", when: "Today, 08:41", type: "Digital" },
  { ref: "UZL-5C18A", product: "1-on-1 Brand Strategy Call", buyer: "Otieno J.", amount: 1500, status: "Settled", when: "Yesterday, 18:03", type: "Service" },
  { ref: "UZL-3A77E", product: "Social Media Growth Kit", buyer: "Njeri S.", amount: 1200, status: "Settled", when: "Yesterday, 15:26", type: "Digital" },
  { ref: "UZL-2D90B", product: "Logo Starter Pack", buyer: "Ali H.", amount: 700, status: "Pending verification", when: "Yesterday, 13:11", type: "Digital" },
  { ref: "UZL-1E63F", product: "Social Media Growth Kit", buyer: "Wanjiku P.", amount: 1200, status: "Settled", when: "Mon, 11:47", type: "Digital" },
];

export const SALES_SERIES = [
  { day: "Mon", value: 4200 },
  { day: "Tue", value: 6100 },
  { day: "Wed", value: 5400 },
  { day: "Thu", value: 8900 },
  { day: "Fri", value: 12400 },
  { day: "Sat", value: 15700 },
  { day: "Sun", value: 9800 },
];

export const formatKsh = (n: number) =>
  `KSh ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

export const commissionOf = (amount: number) => Math.round(amount * COMMISSION.rate);
export const sellerOf = (amount: number) => amount - commissionOf(amount);

export const productByCode = (code: string) =>
  PRODUCTS.find((p) => p.code.toLowerCase() === code.toLowerCase());

export const magicLink = (code: string) => `uzalink.co.ke/magic/${code}`;

export const SHARE_CHANNELS = [
  { key: "whatsapp", label: "WhatsApp", icon: "whatsapp", color: "#25D366" },
  { key: "facebook", label: "Facebook", icon: "facebook", color: "#1877F2" },
  { key: "tiktok", label: "TikTok", icon: "tiktok", color: "#111111" },
  { key: "instagram", label: "Instagram", icon: "instagram", color: "#E1306C" },
  { key: "sms", label: "SMS", icon: "sms", color: "#0e8c46" },
  { key: "copy", label: "Copy Link", icon: "copy", color: "#0a4a2c" },
  { key: "qr", label: "QR Code", icon: "qr", color: "#04281a" },
];
