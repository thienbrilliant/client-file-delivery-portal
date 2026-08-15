import { z } from 'zod';
import { requireAdmin } from '@/server/require-auth';
import { projectService } from '@/server/services/project-service';
import { errorResponse, AppError } from '@/server/errors';
const schema=z.object({name:z.string().trim().min(2).max(160).optional(),description:z.string().trim().max(4000).nullable().optional(),status:z.enum(['DRAFT','IN_PROGRESS','READY','ARCHIVED']).optional(),customerUploadEnabled:z.boolean().optional()});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){try{const actor=await requireAdmin();const {id}=await params;const parsed=schema.safeParse(await request.json());if(!parsed.success)throw new AppError('INVALID_FILE',parsed.error.issues[0]?.message??'Dữ liệu không hợp lệ.');if(!parsed.data.name && parsed.data.description === undefined && parsed.data.status === undefined && parsed.data.customerUploadEnabled === undefined)throw new AppError('INVALID_FILE','Không có thay đổi hợp lệ.');const item=await projectService.update(actor,id,parsed.data);return Response.json({data:item,error:null});}catch(error){return errorResponse(error);}}
