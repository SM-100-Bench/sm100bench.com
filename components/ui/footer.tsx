export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Created by the team at{" "}
          <a
            href="https://bismuth.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            Bismuth
          </a>
        </p>
      </div>
    </footer>
  );
}
