"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wrench, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().email({ message: "الرجاء إدخال بريد إلكتروني صالح." }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

const ADMIN_EMAIL = 'ehabgm@ehabgm.com';
const ADMIN_PASSWORD = 'P@ssw0rd';

export function AdminLoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      toast({ title: 'نجاح', description: 'تم تسجيل الدخول بنجاح.' });
      login();
    } else {
      toast({
        title: 'فشل تسجيل الدخول',
        description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Wrench className="mx-auto h-10 w-10 text-primary" />
        <CardTitle className="text-2xl font-bold mt-2">لوحة تحكم أستاذ صيانة</CardTitle>
        <CardDescription>الرجاء تسجيل الدخول للمتابعة</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              دخول
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
