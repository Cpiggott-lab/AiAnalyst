export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto mb-0">
      <div className="flex justify-center space-x-6 text-sm">
        <a
          href="https://github.com/Cpiggott-lab"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/christopher-piggott-3bbb54351/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400"
        >
          LinkedIn
        </a>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2 mb-0">
        © {new Date().getFullYear()} AiAnalyst. All rights reserved.
      </p>
    </footer>
  );
}
