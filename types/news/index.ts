export interface NewsItem {
  id: number;
  title: string;
  introtext: string;
  cover: string;
  category: string;
  content: string;
  created_at: string;
  updated_at: string;
  available: number;
  site_button_color: string | null;
  site_button_link: string | null;
  site_button_text: string | null;
  site_cover: string | null;
  site_title_color: string | null;
} 

export interface NewsResponse {
  data: NewsItem[];
  total: number;
  page: number;
  limit: number;
} 