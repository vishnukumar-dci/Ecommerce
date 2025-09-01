export default function Footer() {
  return (
    <footer className="bg-slate-100 text-sm text-gray-600 py-4 text-center shadow-inner border-t">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} ShopEZ. All rights reserved.</div>
        <nav className="flex gap-4 justify-center md:justify-end">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
