import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ReviewCreateInput) {
    return this.prisma.review.create({ data, include: { user: true } });
  }

  findAllByCoaster(rollerCoasterId: string) {
    return this.prisma.review.findMany({
      where: { rollerCoasterId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  aggregateByCoaster(rollerCoasterId: string) {
    return this.prisma.review.aggregate({
      where: { rollerCoasterId },
      _avg: { rating: true },
      _count: { id: true },
    });
  }

  findById(id: string) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.ReviewUpdateInput) {
    return this.prisma.review.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  delete(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
