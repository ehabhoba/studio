"use client";

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Wrench, Download, Users, Phone, MapPin, Edit, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from 'jspdf';
import { useRef } from 'react';
import Image from 'next/image';

const mockRequests = [
  { id: 'REQ001', date: '2024-05-20', client: 'أحمد محمود', phone: '01234567890', location: 'القاهرة', problem: 'تسريب مياه في المطبخ', status: 'جديد', aiResult: 'water leak, pipe damage', image: 'https://placehold.co/400x300.png' },
  { id: 'REQ002', date: '2024-05-19', client: 'فاطمة علي', phone: '01098765432', location: 'الجيزة', problem: 'انقطاع التيار الكهربائي', status: 'تم التعيين', aiResult: 'power outage, fuse box issue', image: 'https://placehold.co/400x300.png' },
  { id: 'REQ003', date: '2024-05-18', client: 'خالد سعيد', phone: '01122334455', location: 'الإسكندرية', problem: 'باب الغرفة لا يغلق', status: 'مكتمل', aiResult: 'door alignment, lock broken', image: 'https://placehold.co/400x300.png' },
];

const mockWorkers = [
  { id: 'WKR01', name: 'سيد إبراهيم', phone: '01555667788', specialty: 'سباك', city: 'القاهرة', verified: true },
  { id: 'WKR02', name: 'محمود المصري', phone: '01211223344', specialty: 'كهربائي', city: 'الجيزة', verified: false },
  { id: 'WKR03', name: 'حسن الشاذلي', phone: '01000111222', specialty: 'نجار', city: 'القاهرة', verified: true },
];

type Request = typeof mockRequests[0];

export function AdminDashboard() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);

  const assignWorker = () => {
    toast({ title: "تم التعيين", description: "تم تعيين الفني للطلب بنجاح (وظيفة تجريبية)." });
  };
  
  const downloadPdf = async (request: Request) => {
    const { jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const pdfContent = document.getElementById(`pdf-content-${request.id}`);
    if (pdfContent) {
        const canvas = await html2canvas(pdfContent, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`request-${request.id}.pdf`);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10 justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()}>
            <LogOut className="me-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="requests">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests"><Wrench className="me-2 h-4 w-4" /> طلبات الصيانة</TabsTrigger>
            <TabsTrigger value="workers"><Users className="me-2 h-4 w-4" /> الصنايعية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>طلبات العملاء</CardTitle>
                <CardDescription>عرض وإدارة جميع طلبات الصيانة الواردة.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العميل</TableHead>
                      <TableHead>المشكلة</TableHead>
                      <TableHead className="hidden md:table-cell">نتائج AI</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="font-medium">{request.client}</div>
                          <div className="text-sm text-muted-foreground flex items-center"><Phone className="h-3 w-3 me-1.5"/> {request.phone}</div>
                          <div className="text-sm text-muted-foreground flex items-center"><MapPin className="h-3 w-3 me-1.5"/> {request.location}</div>
                        </TableCell>
                        <TableCell>{request.problem}</TableCell>
                        <TableCell className="hidden md:table-cell">{request.aiResult}</TableCell>
                        <TableCell><Badge>{request.status}</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">...</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onSelect={assignWorker}>تعيين فني</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => downloadPdf(request)}><Download className="me-2 h-4 w-4"/> تحميل كـ PDF</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workers">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الصنايعية</CardTitle>
                <CardDescription>إدارة بيانات الفنيين المسجلين في المنصة.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>التخصص</TableHead>
                      <TableHead className="hidden md:table-cell">المدينة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">{worker.phone}</div>
                        </TableCell>
                        <TableCell>{worker.specialty}</TableCell>
                        <TableCell className="hidden md:table-cell">{worker.city}</TableCell>
                        <TableCell>
                          <Badge variant={worker.verified ? "default" : "secondary"}>
                            {worker.verified ? <CheckCircle className="h-3 w-3 me-1.5" /> : <Clock className="h-3 w-3 me-1.5" />}
                            {worker.verified ? 'موثق' : 'قيد المراجعة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm"><Edit className="me-2 h-4 w-4" /> تعديل</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Hidden divs for PDF generation */}
      <div className="absolute -z-10 -left-[9999px] top-0" aria-hidden="true">
        {mockRequests.map(req => (
            <div key={`pdf-${req.id}`} id={`pdf-content-${req.id}`} className="p-10 bg-white text-black w-[210mm] font-body" dir="rtl">
                <div className="text-right">
                    <h1 className="text-2xl font-bold mb-2">تقرير طلب صيانة - أستاذ صيانة</h1>
                    <p><strong>رقم الطلب:</strong> {req.id}</p>
                    <p><strong>التاريخ:</strong> {req.date}</p>
                    <hr className="my-4"/>
                    <h2 className="text-xl font-bold mb-2">بيانات العميل</h2>
                    <p><strong>الاسم:</strong> {req.client}</p>
                    <p><strong>الهاتف:</strong> {req.phone}</p>
                    <p><strong>الموقع:</strong> {req.location}</p>
                     <hr className="my-4"/>
                    <h2 className="text-xl font-bold mb-2">تفاصيل المشكلة</h2>
                    <p><strong>الوصف:</strong> {req.problem}</p>
                    <p><strong>تحليل AI:</strong> {req.aiResult}</p>
                    <div className="mt-4 border p-2">
                        <p className="mb-2">صورة المشكلة:</p>
                        <img src={req.image} alt="Problem" className="max-w-full" />
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
