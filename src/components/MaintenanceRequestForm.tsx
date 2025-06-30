"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { analyzeProblemImage, submitMaintenanceRequest } from '@/app/actions';
import { Upload, MapPin, Phone, Bot, Loader2, Wand2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';

const FormSchema = z.object({
  problemDescription: z.string().min(10, { message: 'الرجاء إدخال وصف لا يقل عن 10 أحرف.' }),
  phoneNumber: z.string().min(9, { message: 'الرجاء إدخال رقم هاتف صحيح.' }),
});

export function MaintenanceRequestForm() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { problemDescription: '', phoneNumber: '' },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
          setLocationError('');
        },
        () => {
          setLocationError('فشل الحصول على الموقع. الرجاء تمكين خدمات الموقع.');
        }
      );
    } else {
      setLocationError('المتصفح لا يدعم خدمة تحديد الموقع.');
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setImageDataUri(e.target?.result as string);
        setAiResults([]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAnalyzeImage = async () => {
    if (!imageDataUri) {
      toast({ title: 'خطأ', description: 'الرجاء رفع صورة أولاً.', variant: 'destructive' });
      return;
    }
    setIsAnalyzing(true);
    setAiResults([]);
    const result = await analyzeProblemImage(imageDataUri);
    if (result.success && result.problems) {
      setAiResults(result.problems);
      toast({ title: 'نجاح', description: 'تم تحليل الصورة بنجاح.' });
    } else {
      toast({ title: 'خطأ', description: result.error, variant: 'destructive' });
    }
    setIsAnalyzing(false);
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!imageDataUri) {
        toast({ title: 'خطأ', description: 'الرجاء رفع صورة للمشكلة.', variant: 'destructive' });
        return;
    }
    if (!location) {
        toast({ title: 'خطأ', description: 'الرجاء تمكين الوصول للموقع.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    const result = await submitMaintenanceRequest({
        ...data,
        geolocation: `${location.lat},${location.lon}`,
        problemPhotoDataUri: imageDataUri,
        aiAnalysisResults: aiResults.join(', ')
    });

    if (result.success) {
        toast({ title: 'تم بنجاح!', description: result.message });
        form.reset();
        setImagePreview(null);
        setImageDataUri('');
        setAiResults([]);
    } else {
        toast({ title: 'حدث خطأ!', description: result.error, variant: 'destructive' });
    }
    setIsSubmitting(false);
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">طلب خدمة صيانة</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              املأ النموذج وسيقوم فريقنا بالتواصل معك في أقرب وقت.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-2">
                  <FormLabel>صورة المشكلة</FormLabel>
                  <div className="w-full aspect-video rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center relative overflow-hidden bg-muted/20">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="معاينة الصورة" layout="fill" objectFit="contain" />
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
                        <ImageIcon className="mx-auto h-12 w-12" />
                        <p className="mt-2">اسحب وأفلت الصورة هنا، أو انقر للاختيار</p>
                      </div>
                    )}
                    <Input id="picture" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                  </div>
                </div>

                {imagePreview && (
                  <Card className="bg-muted/40">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center"><Bot className="me-2 h-5 w-5"/> تحليل الذكاء الاصطناعي</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="me-2 h-5 w-5 animate-spin" />
                          <span>جاري تحليل الصورة...</span>
                        </div>
                      ) : aiResults.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {aiResults.map((item, i) => <Badge key={i} variant="secondary">{item}</Badge>)}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">قم بتحليل الصورة لاكتشاف المشاكل المحتملة.</p>
                      )}
                    </CardContent>
                    <CardFooter>
                       <Button type="button" onClick={handleAnalyzeImage} disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Wand2 className="me-2 h-4 w-4" />}
                        تحليل الصورة
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                <FormField
                  control={form.control}
                  name="problemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف المشكلة</FormLabel>
                      <FormControl>
                        <Textarea placeholder="مثال: يوجد تسريب مياه أسفل حوض المطبخ..." {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="tel" placeholder="01xxxxxxxxx" {...field} className="ps-10" />
                        </FormControl>
                        <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>الموقع الجغرافي</FormLabel>
                   <div className="flex items-center p-3 rounded-md border bg-muted/40 text-sm">
                    <MapPin className="me-2 h-5 w-5 text-muted-foreground"/>
                    {location ? <span className="text-green-600">تم تحديد موقعك بنجاح.</span> : locationError ? <span className="text-red-600">{locationError}</span> : <span className="text-muted-foreground">جاري تحديد الموقع...</span>}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : null}
                  إرسال الطلب
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
