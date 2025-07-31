import Link from "next/link";

export default function MainNav() {
  return (
    <nav className="bg-[#043933] text-white p-4">
      <ul className="flex justify-around">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/gallery" className="hover:underline">
            Gallery
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/events" className="hover:underline">
            Events
          </Link>
        </li>
      </ul>
    </nav>
  );
}
