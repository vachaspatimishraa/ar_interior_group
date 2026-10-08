import { contact } from "./company-profile";

export type OfficeEntry = {
  id: string;
  name: string;
  badge: string;
  city: string;
  state: string;
  addressNotice: string;
  phone: string;
  phoneHref: string;
  email: string;
  directionsUrl: string;
  hoursNotice: string;
};

export const verifiedOffices: OfficeEntry[] = [
  {
    id: "office-primary",
    name: "Corporate & Project Operations",
    badge: "Primary Office",
    city: "National Operations",
    state: "Delhi NCR & Pan-India",
    addressNotice: "Postal street address confirmation pending from client",
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    email: contact.email,
    directionsUrl: contact.googleBusiness,
    hoursNotice: "Business hours confirmation pending from client",
  },
  {
    id: "office-regional",
    name: "Regional Operations & Enquiries",
    badge: "Regional Office",
    city: "Regional Presence",
    state: "South & West Regions",
    addressNotice: "Postal street address confirmation pending from client",
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    email: contact.secondaryEmail,
    directionsUrl: contact.googleBusiness,
    hoursNotice: "Business hours confirmation pending from client",
  },
];

export const presenceCities = [
  { name: "Delhi", region: "North", highlight: "Operational Hub" },
  { name: "Gurgaon", region: "North", highlight: "Completed Work & Amenity Projects" },
  { name: "Pune", region: "West", highlight: "Workplace & Fit-Out Projects" },
  { name: "Hyderabad", region: "South", highlight: "Micro-Market & Fit-Out Projects" },
  { name: "Bengaluru", region: "South", highlight: "Tech Parks & Workplace Amenities" },
] as const;
