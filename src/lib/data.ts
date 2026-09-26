export type ProductType = "Digital Book";

export const PRODUCT_TYPES: {
  type: ProductType;
  icon: string;
  blurb: string;
  emoji: string;
  digital: boolean;
}[] = [
  {
    type: "Digital Book",
    icon: "book",
    blurb: "PDF, ePub and other digital books readers can buy online.",
    emoji: "📚",
    digital: true,
  },
];

export const CATEGORIES = [
  "Business & Entrepreneurship",
  "Education",
  "Personal Development",
  "Faith & Christian Living",
  "Fiction",
  "Romance",
  "Biography & Memoir",
  "Children & Young Readers",
  "Health & Wellness",
  "Finance & Money",
  "Leadership",
  "Lifestyle",
  "Agriculture",
  "Technology",
  "Other",
];

export type Product = {
  /**
   * `Product` is kept as the internal/backend-compatible type for now.
   * The public UI presents this as a Book.
   */
  code: string;

  /** Book title */
  name: string;

  /** Author display name */
  seller: string;

  /** Author handle */
  handle: string;

  /** Author avatar seed */
  sellerAvatarSeed: string;

  /** Backend-compatible type */
  type: ProductType;

  /** Book category */
  category: string;

  /** Short book description */
  description: string;

  /** Full book description */
  longDescription: string;

  /** Book price in KSh */
  price: number;

  /** Book cover */
  image: string;

  /** Delivery/access information */
  delivery: string;

  /** Book rating */
  rating: number;

  /** Number of purchases */
  sales: number;

  /** Optional promotional badge */
  badge?: string;

  /** Digital book is available immediately after verified payment */
  instant?: boolean;
};

const px = (id: string, w = 760, h = 760) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

/**
 * Sample books used by the current frontend.
 *
 * These are presentation/demo records only.
 * The live backend remains responsible for real books, authors,
 * orders and payment verification.
 */
export const PRODUCTS: Product[] = [
  {
    code: "abc123",
    name: "The African Entrepreneur's Playbook",
    seller: "Achieng Digital Studio",
    handle: "@achiengdigital",
    sellerAvatarSeed: "AD",
    type: "Digital Book",
    category: "Business & Entrepreneurship",
    description:
      "A practical guide to starting, growing and managing a small business in Africa.",
    longDescription:
      "A practical digital book for aspiring and existing entrepreneurs. It covers choosing a viable business idea, understanding customers, pricing, marketing, managing cash flow and building sustainable business systems. Written with African entrepreneurs and small businesses in mind.",
    price: 1200,
    image: px("19537356"),
    delivery: "Instant access • Digital book",
    rating: 4.9,
    sales: 312,
    badge: "Popular",
    instant: true,
  },
  {
    code: "kit7xz",
    name: "Mastering Your Money",
    seller: "Wanjiru Trainers",
    handle: "@wanjirutrainers",
    sellerAvatarSeed: "WT",
    type: "Digital Book",
    category: "Finance & Money",
    description:
      "A simple guide to budgeting, saving and building better financial habits.",
    longDescription:
      "Learn practical ways to manage personal income, create a realistic budget, control unnecessary spending and build a consistent saving habit. The book uses simple examples and practical exercises that readers can apply to everyday financial decisions.",
    price: 850,
    image: px("20432872", 900, 620),
    delivery: "Instant access • Digital book",
    rating: 4.8,
    sales: 189,
    badge: "Top rated",
    instant: true,
  },
  {
    code: "call55",
    name: "Building Confidence One Day at a Time",
    seller: "Brian Otieno",
    handle: "@brianotieno",
    sellerAvatarSeed: "BO",
    type: "Digital Book",
    category: "Personal Development",
    description:
      "A practical guide for building confidence, discipline and positive daily habits.",
    longDescription:
      "A practical personal-development book focused on confidence, discipline, consistency and personal growth. Each chapter includes simple reflections and actions readers can use to develop stronger habits and a healthier mindset.",
    price: 650,
    image: px("8312669"),
    delivery: "Instant access • Digital book",
    rating: 4.8,
    sales: 96,
    instant: true,
  },
  {
    code: "glam99",
    name: "Starting Your Beauty Business",
    seller: "Glam House Kenya",
    handle: "@glamhouseke",
    sellerAvatarSeed: "GH",
    type: "Digital Book",
    category: "Beauty & Grooming",
    description:
      "A beginner-friendly guide to starting and growing a profitable beauty business.",
    longDescription:
      "Learn how to turn beauty skills into a sustainable business. The book covers choosing services, setting prices, attracting clients, managing appointments, building a strong brand and using social media to grow your customer base.",
    price: 1000,
    image: px("13430270"),
    delivery: "Instant access • Digital book",
    rating: 4.7,
    sales: 140,
    badge: "Popular",
    instant: true,
  },
  {
    code: "afro22",
    name: "Stories From Nairobi",
    seller: "Sauti Collective",
    handle: "@sauticollective",
    sellerAvatarSeed: "SC",
    type: "Digital Book",
    category: "Fiction",
    description:
      "A collection of contemporary stories inspired by life, people and places in Nairobi.",
    longDescription:
      "A collection of fictional stories exploring friendship, ambition, family, love and everyday life in Nairobi. The stories move through different neighbourhoods and perspectives while capturing the energy of a changing city.",
    price: 800,
    image: px("13230484", 900, 620),
    delivery: "Instant access • Digital book",
    rating: 4.6,
    sales: 284,
    badge: "Reader favourite",
    instant: true,
  },
  {
    code: "sub3mth",
    name: "The Small Business Growth Guide",
    seller: "Matara Media",
    handle: "@mataramedia",
    sellerAvatarSeed: "MM",
    type: "Digital Book",
    category: "Business & Entrepreneurship",
    description:
      "Practical lessons for small-business owners who want to grow sustainably.",
    longDescription:
      "A practical guide covering customer acquisition, pricing, marketing, record keeping, cash-flow management and repeat business. Designed for entrepreneurs who want straightforward strategies they can apply immediately.",
    price: 700,
    image: px("5704728", 900, 620),
    delivery: "Instant access • Digital book",
    rating: 4.5,
    sales: 421,
    instant: true,
  },
  {
    code: "pod450",
    name: "Understanding Technology for Everyday Life",
    seller: "SoundPlug Nairobi",
    handle: "@soundplug254",
    sellerAvatarSeed: "SP",
    type: "Digital Book",
    category: "Technology",
    description:
      "An easy-to-understand guide to modern technology, online safety and digital tools.",
    longDescription:
      "A beginner-friendly introduction to everyday technology. Learn about smartphones, online accounts, digital payments, cloud services, online privacy, cybersecurity basics and practical digital tools for work and business.",
    price: 900,
    image: px("3394650"),
    delivery: "Instant access • Digital book",
    rating: 4.4,
    sales: 77,
    instant: true,
  },
  {
    code: "bead80",
    name: "The Artisan's Business Guide",
    seller: "Naserian Crafts",
    handle: "@naseriancrafts",
    sellerAvatarSeed: "NC",
    type: "Digital Book",
    category: "Business & Entrepreneurship",
    description:
      "How creative makers can turn handmade skills into a sustainable business.",
    longDescription:
      "A guide for artisans and creatives who want to build a business around their skills. Topics include product development, pricing handmade products, branding, photography, social-media marketing, customer service and managing orders.",
    price: 950,
    image: px("1212048"),
    delivery: "Instant access • Digital book",
    rating: 4.9,
    sales: 268,
    badge: "Popular",
    instant: true,
  },
  {
    code: "logo77",
    name: "Branding Your Small Business",
    seller: "Achieng Digital Studio",
    handle: "@achiengdigital",
    sellerAvatarSeed: "AD",
    type: "Digital Book",
    category: "Design & Creative",
    description:
      "A practical guide to creating a memorable brand for your small business.",
    longDescription:
      "Learn the foundations of small-business branding, including choosing a brand identity, colours, typography, messaging, social-media presentation and consistent customer experiences. Includes practical branding exercises.",
    price: 700,
    image: px("4959935", 900, 620),
    delivery: "Instant access • Digital book",
    rating: 4.7,
    sales: 233,
    instant: true,
  },
  {
    code: "fit12",
    name: "Your Four-Week Wellness Reset",
    seller: "Coach Kamau Fitness",
    handle: "@coachkamau",
    sellerAvatarSeed: "CK",
    type: "Digital Book",
    category: "Health & Wellness",
    description:
      "A simple four-week guide to healthier routines, movement and everyday wellbeing.",
    longDescription:
      "A practical four-week wellness guide covering movement, rest, hydration, everyday nutrition and habit building. It is designed to help readers create realistic routines that fit around work and family life.",
    price: 750,
    image: px("5908766", 900, 620),
    delivery: "Instant access • Digital book",
    rating: 4.8,
    sales: 141,
    instant: true,
  },
  {
    code: "food12",
    name: "25 Kenyan Family Recipes",
    seller: "Mama Njeri Kitchen",
    handle: "@mamanjerike",
    sellerAvatarSeed: "MN",
    type: "Digital Book",
    category: "Lifestyle",
    description:
      "Traditional and modern Kenyan recipes with simple ingredients and practical instructions.",
    longDescription:
      "A collection of 25 family-friendly Kenyan recipes, from pilau and chapati to mahamri and everyday vegetable dishes. Includes ingredient lists, preparation steps, serving ideas and practical shopping tips.",
    price: 450,
    image: px("12194523"),
    delivery: "Instant access • PDF digital book",
    rating: 4.9,
    sales: 612,
    badge: "Under KSh 500",
    instant: true,
  },
  {
    code: "shoot40",
    name: "The Creator's Guide to Better Photos",
    seller: "Lens by Mumbi",
    handle: "@lensbymumbi",
    sellerAvatarSeed: "LM",
    type: "Digital Book",
    category: "Design & Creative",
    description:
      "Learn practical photography techniques for portraits, brands and everyday content.",
    longDescription:
      "A practical photography guide covering composition, lighting, phone photography, portraits, product photography and social-media content. Created for beginners, entrepreneurs and content creators who want better images without expensive equipment.",
    price: 1100,
    image: px("9741840"),
    delivery: "Instant access • Digital book",
    rating: 5,
    sales: 88,
    instant: true,
  },
  {
    code: "craft21",
    name: "The Handmade Business Handbook",
    seller: "Naserian Crafts",
    handle: "@naseriancrafts",
    sellerAvatarSeed: "NC",
    type: "Digital Book",
    category: "Lifestyle",
    description:
      "Build a profitable handmade brand from your creative skills.",
    longDescription:
      "This handbook helps makers turn creative skills into a structured business. It covers product planning, pricing, packaging, photography, marketing, customer relationships and creating repeatable sales processes.",
    price: 850,
    image: px("4053188"),
    delivery: "Instant access • Digital book",
    rating: 4.6,
    sales: 64,
    instant: true,
  },
  {
    code: "ebook9",
    name: "25 Kenyan Family Recipes — Ebook",
    seller: "Mama Njeri Kitchen",
    handle: "@mamanjerike",
    sellerAvatarSeed: "MN",
    type: "Digital Book",
    category: "Lifestyle",
    description:
      "A practical collection of Kenyan family recipes with shopping lists and meal ideas.",
    longDescription:
      "Twenty-five tested family recipes with practical ingredient lists, preparation instructions and budget-friendly alternatives. Includes a seven-day family meal plan and ideas for children's lunchboxes.",
    price: 450,
    image: px("9557122"),
    delivery: "Instant access • PDF digital book",
    rating: 4.8,
    sales: 905,
    badge: "Under KSh 500",
    instant: true,
  },
];

/**
 * Author publishing steps.
 *
 * Kept as SELLER_STEPS for compatibility with existing components.
 */
export const SELLER_STEPS = [
  { id: 1, label: "Book Details", icon: "book" },
  { id: 2, label: "Book Files", icon: "image" },
  { id: 3, label: "Price", icon: "tag" },
  { id: 4, label: "Payment Number", icon: "lock" },
  { id: 5, label: "Magic Link", icon: "link" },
];

export const BUYER_FLOW = [
  {
    title: "Open the Book Link",
    text: "Open the author's link from WhatsApp, TikTok, SMS, Instagram or a QR code.",
    icon: "link",
  },
  {
    title: "Discover the Book",
    text: "Read the description, check the price and see what the book contains.",
    icon: "eye",
  },
  {
    title: "Buy the Book",
    text: "Choose the book and continue to secure checkout.",
    icon: "cart",
  },
  {
    title: "Pay with M-Pesa",
    text: "Pay securely using an M-Pesa STK push or supported payment flow.",
    icon: "phone",
  },
  {
    title: "Payment Verification",
    text: "UzaLink verifies the payment before releasing book access.",
    icon: "shield",
  },
  {
    title: "Access Your Book",
    text: "Once payment is confirmed, your digital book becomes available.",
    icon: "download",
  },
  {
    title: "Digital Receipt",
    text: "Keep your purchase details as proof of payment.",
    icon: "receipt",
  },
];

export const SELLER_FLOW = [
  {
    title: "Create Your Author Account",
    text: "Set up your author profile and prepare to publish your book.",
    icon: "users",
  },
  {
    title: "Add Your Book",
    text: "Add the title, description, category, cover and digital book file.",
    icon: "book",
  },
  {
    title: "Set Your Price",
    text: "Choose how much readers will pay for your book in KSh.",
    icon: "tag",
  },
  {
    title: "Set Your Payment Number",
    text: "Choose where your verified author earnings will be settled.",
    icon: "lock",
  },
  {
    title: "Generate Your Book Link",
    text: "UzaLink gives your book a unique link that you can share.",
    icon: "link",
  },
  {
    title: "Share With Readers",
    text: "Share your book link through WhatsApp, Instagram, TikTok, SMS or QR.",
    icon: "share",
  },
  {
    title: "Receive Verified Sales",
    text: "UzaLink verifies reader payments before releasing access.",
    icon: "shield",
  },
  {
    title: "Receive Your Author Earnings",
    text: "You keep 95% of each verified book sale.",
    icon: "wallet",
  },
];

export const COMMISSION = {
  rate: 0.05,
  example: 1000,
};

export const SETTLEMENT_NOTE =
  "95% of a verified book sale goes to the author, subject to successful payment verification and applicable payment processing.";

export const DASHBOARD_NAV = [
  { key: "overview", label: "Overview", icon: "grid" },
  { key: "earnings", label: "Author Earnings", icon: "wallet" },
  { key: "sales", label: "Book Sales", icon: "trend" },
  { key: "products", label: "My Books", icon: "book" },
  { key: "magic", label: "Book Links", icon: "link" },
  { key: "customers", label: "Readers", icon: "users" },
  { key: "orders", label: "Book Orders", icon: "cart" },
  { key: "downloads", label: "Book Access", icon: "download" },
  { key: "analytics", label: "Book Analytics", icon: "chart" },
  { key: "settlements", label: "Settlements", icon: "bank" },
  { key: "payment", label: "Payment Settings", icon: "lock" },
] as const;

export type DashboardKey = (typeof DASHBOARD_NAV)[number]["key"];

/**
 * Demo author data.
 *
 * Kept for compatibility with existing dashboard components.
 * Real dashboard data comes from the backend.
 */
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

/**
 * Demo book orders.
 *
 * Kept as ORDERS for compatibility with existing components.
 */
export const ORDERS = [
  {
    ref: "UZL-9F41C",
    product: "The African Entrepreneur's Playbook",
    buyer: "Kevin M.",
    amount: 1200,
    status: "Verified",
    when: "Today, 09:12",
    type: "Digital Book",
  },
  {
    ref: "UZL-7B22D",
    product: "Branding Your Small Business",
    buyer: "Faith W.",
    amount: 700,
    status: "Verified",
    when: "Today, 08:41",
    type: "Digital Book",
  },
  {
    ref: "UZL-5C18A",
    product: "Building Confidence One Day at a Time",
    buyer: "Otieno J.",
    amount: 650,
    status: "Settled",
    when: "Yesterday, 18:03",
    type: "Digital Book",
  },
  {
    ref: "UZL-3A77E",
    product: "The African Entrepreneur's Playbook",
    buyer: "Njeri S.",
    amount: 1200,
    status: "Settled",
    when: "Yesterday, 15:26",
    type: "Digital Book",
  },
  {
    ref: "UZL-2D90B",
    product: "Branding Your Small Business",
    buyer: "Ali H.",
    amount: 700,
    status: "Pending verification",
    when: "Yesterday, 13:11",
    type: "Digital Book",
  },
  {
    ref: "UZL-1E63F",
    product: "The African Entrepreneur's Playbook",
    buyer: "Wanjiku P.",
    amount: 1200,
    status: "Settled",
    when: "Mon, 11:47",
    type: "Digital Book",
  },
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
  `KSh ${n.toLocaleString("en-KE", {
    maximumFractionDigits: 0,
  })}`;

export const commissionOf = (amount: number) =>
  Math.round(amount * COMMISSION.rate);

export const sellerOf = (amount: number) =>
  amount - commissionOf(amount);

export const productByCode = (code: string) =>
  PRODUCTS.find(
    (p) => p.code.toLowerCase() === code.toLowerCase()
  );

/**
 * Compatibility helper.
 * Publicly this is now referred to as a Book Link.
 */
export const magicLink = (code: string) =>
  `uzalink.co.ke/magic/${code}`;

export const SHARE_CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    color: "#25D366",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "facebook",
    color: "#1877F2",
  },
  {
    key: "tiktok",
    label: "TikTok",
    icon: "tiktok",
    color: "#111111",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "instagram",
    color: "#E1306C",
  },
  {
    key: "sms",
    label: "SMS",
    icon: "sms",
    color: "#0e8c46",
  },
  {
    key: "copy",
    label: "Copy Book Link",
    icon: "copy",
    color: "#0a4a2c",
  },
  {
    key: "qr",
    label: "QR Code",
    icon: "qr",
    color: "#04281a",
  },
];
