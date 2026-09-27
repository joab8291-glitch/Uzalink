export type ProductType = "Digital Product" | "Service" | "Booking" | "Event" | "Course" | "Subscription" | "Physical Product" | "Other";

export const PRODUCT_TYPES = [
 {value:"Digital Product" as ProductType,label:"Digital Product",blurb:"Files, downloads and digital resources"},
 {value:"Service" as ProductType,label:"Service",blurb:"Professional or personal services"},
 {value:"Booking" as ProductType,label:"Booking",blurb:"Appointments, sessions and reservations"},
 {value:"Event" as ProductType,label:"Event",blurb:"Tickets and event access"},
 {value:"Course" as ProductType,label:"Course",blurb:"Lessons, training and learning programs"},
 {value:"Subscription" as ProductType,label:"Subscription",blurb:"Recurring access or membership"},
 {value:"Physical Product" as ProductType,label:"Physical Product",blurb:"Goods delivered to customers"},
 {value:"Other" as ProductType,label:"Other",blurb:"Any other offer you want to sell"},
];

export const CATEGORIES = ["Business & Money","Design & Creative","Education","Beauty & Grooming","Fashion","Food & Drink","Events & Entertainment","Health & Fitness","Electronics","Home & Crafts","Professional Services","Technology","Other"];

export type Product = {code:string;name:string;seller:string;handle:string;sellerAvatarSeed:string;type:ProductType;category:string;description:string;longDescription:string;price:number;image:string;delivery:string;rating:number;sales:number;badge?:string;instant?:boolean};

export const PRODUCTS:Product[]=[];
export const SELLER_STEPS=[{number:"01",title:"Create your seller profile",text:"Set up your seller details and payment number."},{number:"02",title:"Add your product or offer",text:"Choose what you sell and add its details."},{number:"03",title:"Set your price",text:"Choose the price customers will pay."},{number:"04",title:"Set your payment number",text:"Add the M-Pesa number for seller settlement."},{number:"05",title:"Share your Magic Link",text:"Share one link through WhatsApp, SMS or social media."}];
export const BUYER_FLOW=[{number:"01",title:"Find an offer",text:"Explore products and services from independent sellers."},{number:"02",title:"Open the offer page",text:"Review the details, price and seller information."},{number:"03",title:"Pay with M-Pesa",text:"Complete payment securely through M-Pesa."},{number:"04",title:"Get your offer",text:"After payment confirmation, receive the product or fulfillment details."}];
export const SELLER_FLOW=[{number:"01",title:"Create a seller account",text:"Join UzaLink and set up your seller details."},{number:"02",title:"Create your offer",text:"Add your product, service, booking or other offer."},{number:"03",title:"Share your Magic Link",text:"Give customers one simple link to discover and buy."},{number:"04",title:"Receive your earnings",text:"You keep 95% of every completed sale."}];
export const COMMISSION={rate:.05,authorRate:.95,label:"5% UzaLink commission",sellerLabel:"95% to the seller"};
export const SETTLEMENT_NOTE="Sellers keep 95% of every completed sale. UzaLink retains 5% to operate the platform and payment infrastructure.";
export const DASHBOARD_NAV=[{key:"overview",label:"Overview",icon:"grid"},{key:"earnings",label:"Earnings",icon:"wallet"},{key:"products",label:"Products",icon:"package"},{key:"magic-links",label:"Magic Links",icon:"link"},{key:"customers",label:"Customers",icon:"users"},{key:"orders",label:"Sales",icon:"shoppingBag"},{key:"downloads",label:"Downloads",icon:"download"},{key:"analytics",label:"Analytics",icon:"chart"},{key:"settlements",label:"Settlements",icon:"wallet"},{key:"payment-settings",label:"Payment Settings",icon:"settings"}];
export const SELLER={id:"seller-demo",name:"Webazi Seller",handle:"webaziseller",avatarSeed:"WS",status:"SELLER",paymentNumber:"",balance:0,pending:0,lifetime:0};
export const ORDERS:any[]=[];
export const SALES_SERIES=[{label:"Mon",value:0},{label:"Tue",value:0},{label:"Wed",value:0},{label:"Thu",value:0},{label:"Fri",value:0},{label:"Sat",value:0},{label:"Sun",value:0}];
export function formatKsh(value:number){return `KSh ${value.toLocaleString("en-KE")}`;}
export function commissionOf(price:number){return Math.round(price*COMMISSION.rate);}
export function sellerOf(product:Product){return product.seller;}
export function productByCode(code:string){return PRODUCTS.find(product=>product.code===code);}
export function findAnyProduct(code:string){return productByCode(code);}
export function magicLink(product:Product){return `/magic/${product.code}`;}
export const SHARE_CHANNELS=[{key:"whatsapp",label:"WhatsApp",icon:"whatsapp"},{key:"facebook",label:"Facebook",icon:"facebook"},{key:"x",label:"X",icon:"twitter"},{key:"copy",label:"Copy link",icon:"link"}];
