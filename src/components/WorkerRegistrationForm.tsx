"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { registerWorker } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
  name: z.string().min(2, { message: "الاسم مطلوب." }),
  phone: z.string().min(9, { message: "رقم هاتف صحيح مطلوب." }),
  specialization: z.string().min(2, { message: "التخصص مطلوب." }),
  city: z.string().min(2, { message: "المدينة مطلوبة." }),
  experience: z.string().min(10, { message: "الرجاء كتابة نبذة لا تقل عن 10 أحرف." }),
});

export function WorkerRegistrationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      specialization: '',
      city: '',
      experience: ''
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    const result = await registerWorker(data);

    if (result.success) {
      toast({ title: 'تم بنجاح!', description: result.message });
      form.reset();
    } else {
      toast({ title: 'حدث خطأ!', description: result.error, variant: 'destructive' });
    }
    setIsSubmitting(false);
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">تسجيل صنايعي جديد</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              انضم إلى شبكتنا من الفنيين المهرة ووسع قاعدة عملائك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl><Input placeholder="مثال: محمد أحمد" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl><Input type="tel" placeholder="01xxxxxxxxx" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التخصص</FormLabel>
                        <FormControl><Input placeholder="سباك، كهربائي، نجار..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المدينة</FormLabel>
                        <FormControl><Input placeholder="القاهرة، الإسكندرية..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نبذة عنك وعن خبرتك</FormLabel>
                      <FormControl>
                        <Textarea placeholder="أعمل في مجال السباكة منذ 10 سنوات..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  تسجيل
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
