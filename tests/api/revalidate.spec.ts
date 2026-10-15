import { describe, it, expect, vi, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/revalidate/route';

// Mock de next/cache revalidateTag
vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

// Mock do prisma para não tocar no banco durante testes
vi.mock('@/lib/prisma', () => ({
  prisma: {
    cacheRevalidationLog: {
      create: vi.fn().mockResolvedValue({ id: 'test-log-id' }),
    },
  },
}));

describe('API Route Handler: POST /api/revalidate', () => {
  const validSecret = 'pulse_hub_revalidate_secure_token_2026';

  beforeAll(() => {
    process.env.REVALIDATION_SECRET = validSecret;
  });

  it('deve retornar 401 se o header x-revalidate-secret estiver ausente', async () => {
    const req = new NextRequest('http://localhost:3000/api/revalidate?tag=standings', {
      method: 'POST',
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.message).toContain('Não autorizado');
  });

  it('deve retornar 401 se o header x-revalidate-secret for inválido', async () => {
    const req = new NextRequest('http://localhost:3000/api/revalidate?tag=standings', {
      method: 'POST',
      headers: {
        'x-revalidate-secret': 'wrong_secret',
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('deve retornar 400 se o parâmetro tag for ausente', async () => {
    const req = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'x-revalidate-secret': validSecret,
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toContain('tag');
  });

  it('deve retornar 200 e revalidar com sucesso quando credenciais e tag forem válidas', async () => {
    const req = new NextRequest('http://localhost:3000/api/revalidate?tag=standings', {
      method: 'POST',
      headers: {
        'x-revalidate-secret': validSecret,
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tag).toBe('standings');
  });
});
