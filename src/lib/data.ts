/* =========================================================
   BOOK COVER IMAGES
   ========================================================= */

function bookCover(id: string) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
}

/* =========================================================
   BOOK TYPES
   ========================================================= */

export type ProductType = "Digital Product";

export const PRODUCT_TYPES = [
  {
    value: "Digital Product" as ProductType,
    label: "Digital Book",
    blurb: "PDF, ePub and other digital book formats",
  },
];

/* =========================================================
   BOOK CATEGORIES
   ========================================================= */

export const CATEGORIES = [
  "Fiction",
  "Business & Entrepreneurship",
  "Education & Self-Development",
  "Romance",
  "Faith & Spirituality",
  "Children & Young Readers",
  "Health & Wellness",
  "Biography & Memoir",
  "Personal Finance",
  "Technology",
  "Lifestyle",
  "Other",
];

/* =========================================================
   PRODUCT / BOOK MODEL
   Backend compatibility:
   - name = book title
   - seller = author
   - type = Digital Product
   ========================================================= */

export type Product = {
  code: string;
  name: string;
  seller: string;
  handle: string;
  sellerAvatarSeed: string;

  // Kept for backend compatibility.
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

/* =========================================================
   SAMPLE BOOKS
   ========================================================= */

export const PRODUCTS: Product[] = [
  {
    code: "kenyan-hustler-guide",
    name: "The Kenyan Hustler's Guide to Small Business",
    seller: "James Mwangi",
    handle: "jamesmwangi",
    sellerAvatarSeed: "JM",
    type: "Digital Product",
    category: "Business & Entrepreneurship",
    description:
      "A practical guide for starting, managing and growing a small business in Kenya.",
    longDescription:
      "Learn how to turn an idea into a sustainable small business. This practical guide covers planning, pricing, customers, marketing, record keeping and everyday business decisions for Kenyan entrepreneurs.",
    price: 350,
    image: bookCover("1544947950-fa07a98d237f"),
    delivery: "Digital book",
    rating: 4.8,
    sales: 126,
    badge: "Popular",
    instant: true,
  },

  {
    code: "starting-business-kenya",
    name: "Starting a Business in Kenya",
    seller: "Mercy Wanjiku",
    handle: "mercywanjiku",
    sellerAvatarSeed: "MW",
    type: "Digital Product",
    category: "Business & Entrepreneurship",
    description:
      "A beginner-friendly roadmap for turning your business idea into a real venture.",
    longDescription:
      "From choosing a business idea to understanding customers, setting prices and building a simple marketing strategy, this book provides practical steps for aspiring Kenyan entrepreneurs.",
    price: 300,
    image: bookCover("1512820790803-83ca734da794"),
    delivery: "Digital book",
    rating: 4.7,
    sales: 94,
    badge: "New",
    instant: true,
  },

  {
    code: "money-habits-young-kenyans",
    name: "Money Habits for Young Kenyans",
    seller: "Brian Otieno",
    handle: "brianotieno",
    sellerAvatarSeed: "BO",
    type: "Digital Product",
    category: "Personal Finance",
    description:
      "Simple lessons on saving, budgeting and building healthier money habits.",
    longDescription:
      "A practical introduction to personal finance for young adults. Learn how to create a budget, control unnecessary spending, build savings and make better financial decisions.",
    price: 250,
    image: bookCover("1455885666463-9e7d2a3d2f5a"),
    delivery: "Digital book",
    rating: 4.9,
    sales: 181,
    badge: "Bestseller",
    instant: true,
  },

  {
    code: "faith-everyday",
    name: "Faith in the Everyday",
    seller: "Grace Njeri",
    handle: "gracenjeri",
    sellerAvatarSeed: "GN",
    type: "Digital Product",
    category: "Faith & Spirituality",
    description:
      "Short reflections for finding faith, hope and purpose in everyday life.",
    longDescription:
      "A collection of practical reflections designed to encourage readers through ordinary seasons of life, work, relationships and personal growth.",
    price: 200,
    image: bookCover("1509021436665-8f07e3f0f39c"),
    delivery: "Digital book",
    rating: 4.9,
    sales: 73,
    instant: true,
  },

  {
    code: "nairobi-love-story",
    name: "The Nairobi Love Story",
    seller: "Ann Wambui",
    handle: "annwambui",
    sellerAvatarSeed: "AW",
    type: "Digital Product",
    category: "Romance",
    description:
      "A modern Nairobi romance about love, ambition and second chances.",
    longDescription:
      "Set against the energy of Nairobi, this contemporary romance follows two young professionals whose lives unexpectedly cross as they pursue their dreams.",
    price: 280,
    image: bookCover("1543002588-bfa74002ed7e"),
    delivery: "Digital book",
    rating: 4.6,
    sales: 112,
    badge: "Reader Favourite",
    instant: true,
  },

  {
    code: "digital-skills-beginners",
    name: "Digital Skills for Beginners",
    seller: "Kevin Kariuki",
    handle: "kevinkariuki",
    sellerAvatarSeed: "KK",
    type: "Digital Product",
    category: "Technology",
    description:
      "A practical introduction to computers, the internet and essential digital skills.",
    longDescription:
      "Designed for beginners who want confidence using modern technology. Topics include computer basics, internet safety, online communication, productivity tools and digital opportunities.",
    price: 300,
    image: bookCover("1516979187457-7f5c0f6c3d4a"),
    delivery: "Digital book",
    rating: 4.8,
    sales: 87,
    instant: true,
  },

  {
    code: "kenyan-family-recipes",
    name: "25 Kenyan Family Recipes",
    seller: "Lucy Akinyi",
    handle: "lucyakinnyi",
    sellerAvatarSeed: "LA",
    type: "Digital Product",
    category: "Lifestyle",
    description:
      "A collection of simple Kenyan recipes for everyday family meals.",
    longDescription:
      "Discover 25 practical recipes inspired by Kenyan home cooking, with simple ingredients and easy-to-follow preparation steps.",
    price: 180,
    image: bookCover("1495446815903-90c2f9a7a8d8"),
    delivery: "Digital book",
    rating: 4.7,
    sales: 143,
    badge: "Popular",
    instant: true,
  },

  {
    code: "children-dream-big",
    name: "Dream Big, Little One",
    seller: "Sarah Achieng",
    handle: "sarahachieng",
    sellerAvatarSeed: "SA",
    type: "Digital Product",
    category: "Children & Young Readers",
    description:
      "An uplifting children's story about courage, imagination and believing in yourself.",
    longDescription:
      "A colourful and encouraging story created to help young readers develop confidence, curiosity and the courage to dream about their future.",
    price: 150,
    image: bookCover("1544947950-fa07a98d237f"),
    delivery: "Digital book",
    rating: 4.9,
    sales: 65,
    instant: true,
  },

  {
    code: "self-growth-playbook",
    name: "The Personal Growth Playbook",
    seller: "Daniel Kimani",
    handle: "danielkimani",
    sellerAvatarSeed: "DK",
    type: "Digital Product",
    category: "Education & Self-Development",
    description:
      "Practical exercises for building discipline, confidence and better daily habits.",
    longDescription:
      "A hands-on guide for readers who want to build stronger habits, improve consistency, set meaningful goals and make steady personal progress.",
    price: 320,
    image: bookCover("1519682337058-a94d519337bc"),
    delivery: "Digital book",
    rating: 4.8,
    sales: 102,
    instant: true,
  },

  {
    code: "healthier-living",
    name: "A Simpler Guide to Healthier Living",
    seller: "Dr. Peter Kamau",
    handle: "peterkamau",
    sellerAvatarSeed: "PK",
    type: "Digital Product",
    category: "Health & Wellness",
    description:
      "Everyday wellness principles for building healthier routines and habits.",
    longDescription:
      "A general wellness guide covering everyday routines, movement, rest, nutrition principles and practical ways to build sustainable healthy habits.",
    price: 280,
    image: bookCover("1511108690759-3e1b1b4d4b3f"),
    delivery: "Digital book",
    rating: 4.6,
    sales: 58,
    instant: true,
  },

  {
    code: "from-campus-to-career",
    name: "From Campus to Career",
    seller: "Faith Muthoni",
    handle: "faithmuthoni",
    sellerAvatarSeed: "FM",
    type: "Digital Product",
    category: "Education & Self-Development",
    description:
      "A practical guide for students preparing for work and life after graduation.",
    longDescription:
      "Learn how to prepare for employment, build useful skills, present yourself professionally and navigate the transition from campus into the working world.",
    price: 250,
    image: bookCover("1455885666463-9e7d2a3d2f5a"),
    delivery: "Digital book",
    rating: 4.8,
    sales: 79,
    badge: "New",
    instant: true,
  },

  {
    code: "african-entrepreneur-mindset",
    name: "The African Entrepreneur Mindset",
    seller: "Samuel Kiplagat",
    handle: "samuelkiplagat",
    sellerAvatarSeed: "SK",
    type: "Digital Product",
    category: "Business & Entrepreneurship",
    description:
      "Lessons on resilience, creativity and opportunity for African entrepreneurs.",
    longDescription:
      "Explore practical ideas for identifying opportunities, solving local problems, building resilience and developing a sustainable entrepreneurial mindset.",
    price: 400,
    image: bookCover("undefined"),
    delivery: "Digital book",
    rating: 4.9,
    sales: 134,
    badge: "Featured",
    instant: true,
  },
];

/* =========================================================
   AUTHOR SELLING FLOW
   ========================================================= */

export const SELLER_STEPS = [
  {
    number: "01",
    title: "Create your author profile",
    text: "Set up your author account and tell readers who you are.",
  },
  {
    number: "02",
    title: "Add your book",
    text: "Upload your digital book, cover, description and category.",
  },
  {
    number: "03",
    title: "Set your price",
    text: "Choose the price readers will pay for your book.",
  },
  {
    number: "04",
    title: "Set your payment number",
    text: "Add the M-Pesa number where your author earnings will be settled.",
  },
  {
    number: "05",
    title: "Share your book link",
    text: "Share your unique book link on WhatsApp, social media or anywhere your readers are.",
  },
];

/* =========================================================
   READER FLOW
   ========================================================= */

export const BUYER_FLOW = [
  {
    number: "01",
    title: "Find a book",
    text: "Explore digital books published by independent authors.",
  },
  {
    number: "02",
    title: "Open the book page",
    text: "Read the description, check the price and learn about the author.",
  },
  {
    number: "03",
    title: "Pay with M-Pesa",
    text: "Enter your phone number and complete the M-Pesa payment.",
  },
  {
    number: "04",
    title: "Get access",
    text: "After payment confirmation, your digital book access is unlocked.",
  },
];

/* =========================================================
   AUTHOR JOURNEY
   ========================================================= */

export const SELLER_FLOW = [
  {
    number: "01",
    title: "Create an author account",
    text: "Join UzaLink and create your author profile.",
  },
  {
    number: "02",
    title: "Publish your book",
    text: "Add your book details, cover, price and digital file.",
  },
  {
    number: "03",
    title: "Share your link",
    text: "Give readers one simple link to discover and buy your book.",
  },
  {
    number: "04",
    title: "Receive your earnings",
    text: "You keep 95% of every completed book sale.",
  },
];

/* =========================================================
   COMMISSION
   ========================================================= */

export const COMMISSION = {
  rate: 0.05,
  authorRate: 0.95,
  label: "5% UzaLink commission",
  sellerLabel: "95% to the author",
};

/* =========================================================
   SETTLEMENT
   ========================================================= */

export const SETTLEMENT_NOTE =
  "Authors keep 95% of every completed book sale. UzaLink retains 5% to operate the platform and payment infrastructure.";

/* =========================================================
   DASHBOARD NAVIGATION
   *
   * Keys are intentionally preserved so existing dashboard
   * code does not break.
   * ========================================================= */

export const DASHBOARD_NAV = [
  {
    key: "overview",
    label: "Overview",
    icon: "grid",
  },
  {
    key: "earnings",
    label: "Earnings",
    icon: "wallet",
  },
  {
    key: "products",
    label: "Books",
    icon: "book",
  },
  {
    key: "magic-links",
    label: "Book Links",
    icon: "link",
  },
  {
    key: "customers",
    label: "Readers",
    icon: "users",
  },
  {
    key: "orders",
    label: "Book Sales",
    icon: "shoppingBag",
  },
  {
    key: "downloads",
    label: "Downloads",
    icon: "download",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: "chart",
  },
  {
    key: "settlements",
    label: "Settlements",
    icon: "wallet",
  },
  {
    key: "payment-settings",
    label: "Payment Settings",
    icon: "settings",
  },
];

/* =========================================================
   SAMPLE AUTHOR
   *
   * Kept as SELLER export for compatibility.
   * ========================================================= */

export const SELLER = {
  id: "author-demo",
  name: "Webazi Author",
  handle: "webaziauthor",
  avatarSeed: "WA",
  status: "FREE AUTHOR",
  paymentNumber: "",
  balance: 0,
  pending: 0,
  lifetime: 0,
};

/* =========================================================
   SAMPLE ORDERS
   *
   * Kept as ORDERS and product field for compatibility.
   * ========================================================= */

export const ORDERS = [
  {
    id: "ORD-1001",
    product: PRODUCTS[0],
    buyer: "Brian K.",
    amount: PRODUCTS[0].price,
    status: "PAID",
    date: "Today",
  },
  {
    id: "ORD-1002",
    product: PRODUCTS[2],
    buyer: "Mary W.",
    amount: PRODUCTS[2].price,
    status: "PAID",
    date: "Yesterday",
  },
  {
    id: "ORD-1003",
    product: PRODUCTS[6],
    buyer: "Kevin O.",
    amount: PRODUCTS[6].price,
    status: "PAID",
    date: "2 days ago",
  },
];

/* =========================================================
   SALES SERIES
   ========================================================= */

export const SALES_SERIES = [
  { label: "Mon", value: 0 },
  { label: "Tue", value: 0 },
  { label: "Wed", value: 0 },
  { label: "Thu", value: 0 },
  { label: "Fri", value: 0 },
  { label: "Sat", value: 0 },
  { label: "Sun", value: 0 },
];

/* =========================================================
   FORMATTING
   ========================================================= */

export function formatKsh(value: number) {
  return `KSh ${value.toLocaleString("en-KE")}`;
}

export function commissionOf(price: number) {
  return Math.round(price * COMMISSION.rate);
}

export function sellerOf(product: Product) {
  return product.seller;
}

/* =========================================================
   BOOK LOOKUP
   *
   * Function names are preserved for compatibility with
   * existing pages.
   * ========================================================= */

export function productByCode(code: string) {
  return PRODUCTS.find((product) => product.code === code);
}

export function findAnyProduct(code: string) {
  return productByCode(code) ?? PRODUCTS[0];
}

/* =========================================================
   MAGIC LINK
   ========================================================= */

export function magicLink(product: Product) {
  return `/magic/${product.code}`;
}

/* =========================================================
   SHARE CHANNELS
   ========================================================= */

export const SHARE_CHANNELS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "facebook",
  },
  {
    key: "x",
    label: "X",
    icon: "twitter",
  },
  {
    key: "copy",
    label: "Copy link",
    icon: "link",
  },
];
