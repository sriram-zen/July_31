import { createClient } from '@/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();

  return (
    <div className="flex flex-grow flex-col items-center justify-center p-24 text-white">
      <h1>Instruments Page - Coming Soon</h1>
      <pre>{JSON.stringify(instruments, null, 2)}</pre>
    </div>
  );
}