export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">
          Created by the team at{" "}
          <a
            href="https://bismuth.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition-colors"
          >
            Bismuth
          </a>
        </p>
      </div>
    </footer>
  );
}
