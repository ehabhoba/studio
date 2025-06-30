"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Info, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type RequestStatus = {
  id: string;
  date: string;
  description: string;
  status: 'قيد المراجعة' | 'تم إرسال فني' | 'مكتمل' | 'ملغي';
  worker?: {
    name: string;
    specialization: string;
  };
};

export function RequestTracker() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<RequestStatus | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      setError('الرجاء إدخال رقم هاتف صحيح.');
      return;
    }
    setError('');
    setLoading(true);
    setStatus(null);

    setTimeout(() => {
      const mockStatuses: RequestStatus[] = [
        { id: '12345', date: '2023-10-26', description: 'تسريب في حوض المطبخ', status: 'قيد المراجعة' },
        { id: '67890', date: '2023-10-25', description: 'مشكلة في كهرباء الشقة', status: 'تم إرسال فني', worker: { name: 'علي حسن', specialization: 'كهربائي' } },
        { id: '11223', date: '2023-10-22', description: 'تركيب باب جديد', status: 'مكتمل' },
      ];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      if (phone) {
        setStatus(randomStatus);
      }
      setLoading(false);
    }, 1500);
  };

  const statusIcons = {
    'قيد المراجعة': <Clock className="h-4 w-4 me-2 text-yellow-500" />,
    'تم إرسال فني': <Info className="h-4 w-4 me-2 text-blue-500" />,
    'مكتمل': <CheckCircle className="h-4 w-4 me-2 text-green-500" />,
    'ملغي': <Info className="h-4 w-4 me-2 text-red-500" />,
  };

  const statusColors = {
    'قيد المراجعة': 'default',
    'تم إرسال فني': 'secondary',
    'مكتمل': 'outline',
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">تتبع حالة طلبك</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              أدخل رقم هاتفك المسجل لعرض آخر تحديثات طلب الصيانة الخاص بك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="tel"
                placeholder="أدخل رقم الهاتف..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="me-2 sr-only md:not-sr-only">بحث</span>
              </Button>
            </form>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
          {loading && (
            <CardFooter>
              <div className="flex justify-center w-full p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </CardFooter>
          )}
          {status && (
            <CardFooter>
              <Alert>
                <AlertTitle className="flex items-center">
                  {statusIcons[status.status]}
                  حالة الطلب: <Badge variant={statusColors[status.status] as any} className="mx-2">{status.status}</Badge>
                </AlertTitle>
                <AlertDescription>
                  <p><strong>رقم الطلب:</strong> {status.id}</p>
                  <p><strong>تاريخ الطلب:</strong> {status.date}</p>
                  <p><strong>وصف المشكلة:</strong> {status.description}</p>
                  {status.worker && (
                     <p><strong>الفني المسؤول:</strong> {status.worker.name} ({status.worker.specialization})</p>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">هذه بيانات تجريبية. لتتبع الطلبات الفعلية، يجب ربط التطبيق بقاعدة بيانات حقيقية.</p>
                </AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      </div>
    </section>
  );
}
