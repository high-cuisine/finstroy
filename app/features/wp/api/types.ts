export type WpPageEnvelope<TAcf extends Record<string, unknown> = Record<string, unknown>> = {
  success: boolean;
  status: number;
  version: string;
  resource: { kind: string; subtype: string };
  request: { path: string; method: string; url: string };
  data: {
    entity: {
      id: number;
      type: string;
      status: string;
      slug: string;
      title: string;
      excerpt: string;
      date_gmt: string;
      modified_gmt: string;
      permalink: string;
      template: string | null;
      menu_order: number;
      parent_id: number;
      content: string;
      featured_image: unknown;
      taxonomies: unknown[];
      acf: TAcf;
      seo?: unknown;
    };
  };
  meta?: unknown;
  errors?: unknown[];
};

export type GlavnayaAcf = {
  hero_block_years: string;
  hero_block_product_names: string;
  hero_block_annual_turnover: string;
  hero_block_city_map: string;
  hero_block_video: boolean;
  hero_block_text_of_link: string;
  "unit-city": string;
  unit_phone_number: string;
  office_address: string;
  work_schedule: string;
  unit_email: string;
  news_annotation: string;
  about_us_information: string;
  about_us_image: boolean;
  "to-suppliers_title": string;
  "to-suppliers_text": string;
  hero_block_description: string;
  our_advantages_description: string;
  list_of_our_advantages: { advantages_image: boolean; advantages_description: string }[];
  company_office_description: string;
  list_of_company_offices: {
    company_office_city: string;
    company_office_name: string;
    company_office_info: string;
  }[];
  clients_description: string;
  list_of_clients: { client_name: string; client_description: string; client_logo: boolean }[];
  questions_answers: { "title-question": string; answer: string }[];
};

