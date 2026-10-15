import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { revalidateQuerySchema, triggerSourceSchema } from '@/schemas/revalidation.schema';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');
  const expectedSecret = process.env.REVALIDATION_SECRET;

  // 1. Verificação de Autenticação via Secret Header
  if (!secret || !expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { message: 'Não autorizado. Header x-revalidate-secret inválido ou ausente.' },
      { status: 401 }
    );
  }

  // 2. Validação da Tag com Zod
  const tagParam = req.nextUrl.searchParams.get('tag');
  const parsed = revalidateQuerySchema.safeParse({ tag: tagParam });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Parâmetro tag ausente ou inválido.',
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const tag = parsed.data.tag;

  // 3. Purga da Tag no Next.js Data Cache
  try {
    revalidateTag(tag, { expire: 0 });

    // 4. Registro no log de auditoria do Prisma (resiliente, não bloqueia a resposta se o banco estiver fora)
    try {
      const parsedTrigger = triggerSourceSchema.safeParse(req.headers.get('x-triggered-by'));
      const triggeredBy = parsedTrigger.success ? parsedTrigger.data : 'manual';

      await prisma.cacheRevalidationLog.create({
        data: {
          tag,
          triggeredBy,
          status: 'SUCCESS',
        },
      });
    } catch {
      // Ignora falha de conexão do banco no log de auditoria
    }

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error) {
    console.error(`[Revalidate Error] Falha ao revalidar tag ${tag}:`, error);
    return NextResponse.json(
      { message: 'Erro interno ao processar revalidação.', error: String(error) },
      { status: 500 }
    );
  }
}
