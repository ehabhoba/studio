"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'طلب خدمة' },
  { href: '/worker-register', label: 'تسجيل كصنايعي' },
  { href: '/track-requests', label: 'تتبع الطلب' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="me-4 hidden md:flex">
          <Link href="/" className="me-6 flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">أستاذ صيانة</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">فتح القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center mb-6">
                <Wrench className="h-6 w-6 text-primary me-2" />
                <span className="font-bold">أستاذ صيانة</span>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-2 py-1 text-lg"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <Link href="/admin/login">
            <Button variant="outline">لوحة التحكم</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
