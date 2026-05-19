import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { roles, Roles } from '../lib/access';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviews: ReviewsRepository) {}

  create(
    rollerCoasterId: string,
    dto: CreateReviewDto,
    currentUser: AuthenticatedUser,
  ) {
    return this.reviews.create({
      rating: dto.rating,
      comment: dto.comment,
      user: { connect: { id: currentUser.id } },
      rollerCoaster: { connect: { id: rollerCoasterId } },
    });
  }

  async findAllByCoaster(rollerCoasterId: string) {
    const [reviews, aggregate] = await Promise.all([
      this.reviews.findAllByCoaster(rollerCoasterId),
      this.reviews.aggregateByCoaster(rollerCoasterId),
    ]);
    return {
      averageRating: aggregate._avg.rating,
      total: aggregate._count.id,
      data: reviews,
    };
  }

  async update(
    id: string,
    dto: UpdateReviewDto,
    currentUser: AuthenticatedUser,
  ) {
    const review = await this.reviews.findById(id);
    if (!review) throw new NotFoundException(`Review ${id} not found`);

    this.assertOwnerOrCanActOnAny(review.userId, currentUser, 'update');

    return this.reviews.update(id, dto);
  }

  async delete(id: string, currentUser: AuthenticatedUser) {
    const review = await this.reviews.findById(id);
    if (!review) throw new NotFoundException(`Review ${id} not found`);

    this.assertOwnerOrCanActOnAny(review.userId, currentUser, 'delete');

    return this.reviews.delete(id);
  }

  private assertOwnerOrCanActOnAny(
    ownerId: string,
    user: AuthenticatedUser,
    action: 'update' | 'delete',
  ) {
    if (user.id === ownerId) return;

    const roleName: Roles = user.role ?? Roles.User;
    const { success } = roles[roleName].authorize({
      review: [`${action}:any`],
    });

    if (!success) throw new ForbiddenException();
  }
}
