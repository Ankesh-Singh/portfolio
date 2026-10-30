export type DesignTag = 'Hero' | 'Sections' | 'Waitlist' | 'All' ;

export interface Design {
    id: string;
    title: string;
    description: string;
    image?: string;
    category: string;
    variations?: Design[];
}