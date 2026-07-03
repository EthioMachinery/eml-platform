import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MachineryHero from '@/components/machinery/MachineryHero';
import InquiryForm from '@/components/InquiryForm';

interface Props {
  params: { id: string };
}

/**
 * DYNAMIC METADATA GENERATOR
 * This is the secret to #1 rankings. It creates a unique title/desc for every machine.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: machine } = await supabaseAdmin
    .from('machinery')
    .select('title, category, city, brand, price')
    .eq('id', params.id)
    .single();

  if (!machine) return { title: 'Machine Not Found' };

  const amharicTitle = `${machine.brand} ${machine.category} ለሽያጭ/ኪራይ በ${machine.city}`;
  const englishTitle = `${machine.brand} ${machine.title} for Sale/Rent in ${machine.city}`;

  return {
    title: `${machine.title} | ${machine.city}`,
    description: `Buy or Rent this ${machine.brand} ${machine.category} in ${machine.city}, Ethiopia. Price: ${machine.price.toLocaleString()} ETB. Verified Listing via TM.`,
    openGraph: {
      title: englishTitle,
      description: amharicTitle,
      images: [`/api/og?id=${params.id}`], // Optional: Dynamic OG Image
    }
  };
}

export default async function MachineDetailPage({ params }: Props) {
  const { data: machine } = await supabaseAdmin
    .from('machinery')
    .select('*, profiles(full_name, trust_score, verified)')
    .eq('id', params.id)
    .single();

  if (!machine) notFound();

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": machine.title,
    "image": machine.image_url,
    "description": machine.description,
    "brand": { "@type": "Brand", "name": machine.brand },
    "offers": {
      "@type": "Offer",
      "price": machine.price,
      "priceCurrency": "ETB",
      "availability": "https://schema.org/InStock",
      "areaServed": machine.city
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <MachineryHero machine={machine} />
          {/* Machine details components go here */}
        </div>
        
        <div className="lg:col-span-1">
          <InquiryForm 
            machineryId={machine.id} 
            ownerId={machine.user_id} 
            machineTitle={machine.title} 
          />
        </div>
      </div>
    </div>
  );
}