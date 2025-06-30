export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          صُنع بكل حب بواسطة فريق أستاذ صيانة. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
