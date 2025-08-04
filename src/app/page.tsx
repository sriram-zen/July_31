import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <section className="flex-grow w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary-brand text-white flex flex-col items-center justify-center">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-6 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">SEETHA RAMA VIVAHA TRUST BHAVANI</h1>
            <img src="https://images.pexels.com/photos/15902534/pexels-photo-15902534.jpeg" alt="Seetha Rama Vivaha Trust Bhavani Logo" className="mx-auto h-24 w-24 max-w-full flex items-center justify-center bg-white rounded-lg text-primary-brand font-bold text-2xl shadow-lg" />
            <p className="max-w-[700px] mx-auto text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Seetha Rama Vivaha Trust (SRVT) is a registered charitable trust to organise Seetha Rama Vivaha Mahotsavam in Bhajanai Sampradhaya Paddathi at Bhavani every year during the month of July by engaging eminent Bagavathas group.
            </p>
            <div className="flex justify-center">
              <Button className="inline-flex h-10 items-center justify-center rounded-md bg-green-700 px-8 text-sm font-medium text-primary-brand shadow transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-950 disabled:pointer-events-none disabled:opacity-50" href="#">
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      </section>
  );
}
