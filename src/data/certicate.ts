export interface Certificate {
  Issued: string;
  href: string;
  title: string;
  logoUrl: string;
  date: string;
  description: string;
}

export const certificates: Certificate[] = [
  {
    Issued: "Microsoft",
    href: "https://learn.microsoft.com/api/credentials/share/en-us/AshirwadSingh-3190/60BFF932AC3A75A7?sharingId=5D47604387455FF7",
    title: "Microsoft Certified: Azure Fundamentals",
    logoUrl: "https://learn.microsoft.com/media/learn/certification/badges/microsoft-certified-fundamentals-badge.svg",
    date: "2025",
    description: "Validates foundational knowledge of cloud concepts, core Azure services, security, privacy, compliance, and trust. Suitable for both technical and non-technical professionals working with Microsoft Azure."
  },
  {
    Issued: "Oracle Cloud",
    href: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=53916C63D6D95CDA8844D6F4D45BA3BF012996FFC4AE266488BF9A691C60A401",
    title: "Oracle Certified Foundations Associate",
    logoUrl: "/logo/oracle_Foundations.png",
    date: "August 2025",
    description: "It validates core Oracle Cloud Infrastructure knowledge. Relevant for technical and non-technical roles, including development, procurement, and management."
  },
  {
    Issued: "MongoDB Database",
    href: "https://www.credly.com/badges/da73279c-138f-4954-bf2f-5aeba4dd5875",
    title: "MongoDB Certified Associate Database Administrator",
    logoUrl: "/logo/monogodb.png",
    date: "June 2025",
    description: "MongoDB database implementation, configuration, and administration skills including CRUD operations and replication."
  },
  {
    Issued: "MongoDB Atlas",
    href: "https://www.credly.com/badges/da73279c-138f-4954-bf2f-5aeba4dd5875",
    title: "MongoDB Certified Associate Atlas Administrator",
    logoUrl: "/logo/monogodb.png",
    date: "June 2025",
    description: "MongoDB Atlas cloud deployment management, security best practices, and performance optimization."
  },
];
