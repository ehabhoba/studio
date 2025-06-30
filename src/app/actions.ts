// @ts-nocheck
'use server';

import { z } from 'zod';
import { analyzeImage } from '@/ai/flows/analyze-image';
import { generateRequestSummary } from '@/ai/flows/generate-request-summary';

// Schemas
const MaintenanceRequestSchema = z.object({
  problemDescription: z.string().min(10, 'الرجاء إدخال وصف لا يقل عن 10 أحرف.'),
  phoneNumber: z.string().min(9, 'الرجاء إدخال رقم هاتف صحيح.'),
  geolocation: z.string().min(1, 'الرجاء السماح بالوصول لموقعك.'),
  problemPhotoDataUri: z.string().min(1, 'الرجاء رفع صورة للمشكلة.'),
  aiAnalysisResults: z.string().optional(),
});

const WorkerRegistrationSchema = z.object({
    name: z.string().min(2, "الاسم مطلوب"),
    phone: z.string().min(9, "رقم الهاتف مطلوب"),
    specialization: z.string().min(2, "التخصص مطلوب"),
    city: z.string().min(2, "المدينة مطلوبة"),
    experience: z.string().min(10, "نبذة عن الخبرة مطلوبة"),
});

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxOTeXdmO7YRTLl5jjAPqBmHa7ef4YglG2TSb4eORXRzLw0gefkN5bNWV5k1ww5dPFSPA/exec';

// AI Analysis Action
export async function analyzeProblemImage(photoDataUri: string) {
  try {
    const result = await analyzeImage({ photoDataUri });
    return { success: true, problems: result.problems };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return { success: false, error: 'فشل تحليل الصورة.' };
  }
}

// Maintenance Request Submission Action
export async function submitMaintenanceRequest(formData: z.infer<typeof MaintenanceRequestSchema>) {
  try {
    const validatedData = MaintenanceRequestSchema.parse(formData);

    const summaryResult = await generateRequestSummary({
        ...validatedData,
        aiAnalysisResults: validatedData.aiAnalysisResults || 'لم يتم إجراء تحليل.',
        clientPhoneNumber: validatedData.phoneNumber,
        clientGeolocation: validatedData.geolocation,
        problemPhotoDataUri: validatedData.problemPhotoDataUri,
    });
    
    const payload = {
        ...validatedData,
        summary: summaryResult.summary,
        timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'UTC' }),
        type: 'maintenanceRequest'
    };

    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
    });

    if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
    }

    return { success: true, message: 'تم إرسال طلبك بنجاح!' };
  } catch (error) {
    console.error('Submission failed:', error);
    if (error instanceof z.ZodError) {
        return { success: false, error: 'البيانات المدخلة غير صالحة.' };
    }
    return { success: false, error: 'حدث خطأ أثناء إرسال الطلب.' };
  }
}

// Worker Registration Action
export async function registerWorker(formData: z.infer<typeof WorkerRegistrationSchema>) {
    try {
        const validatedData = WorkerRegistrationSchema.parse(formData);
        const payload = {
            ...validatedData,
            timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'UTC' }),
            type: 'workerRegistration'
        };

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
             headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
        });

        if (!response.ok) {
            throw new Error(`Webhook request failed with status ${response.status}`);
        }
        
        return { success: true, message: 'تم تسجيلك بنجاح!' };

    } catch (error) {
        console.error('Registration failed:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: 'البيانات المدخلة غير صالحة.' };
        }
        return { success: false, error: 'حدث خطأ أثناء التسجيل.' };
    }
}
