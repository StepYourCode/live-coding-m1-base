import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { DeleteRoute } from '../common/decorators/delete-route.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('roller-coasters/:rollerCoasterId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @UUIDParam('rollerCoasterId') rollerCoasterId: string,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const review = await this.reviewsService.create(rollerCoasterId, dto, user);
    return ReviewResponseDto.fromPrisma(review);
  }

  @Get()
  @AllowAnonymous()
  async findAll(@UUIDParam('rollerCoasterId') rollerCoasterId: string) {
    const { averageRating, total, data } =
      await this.reviewsService.findAllByCoaster(rollerCoasterId);
    return {
      averageRating,
      total,
      data: data.map((review) => ReviewResponseDto.fromPrisma(review)),
    };
  }

  @Patch(':id')
  async update(
    @UUIDParam('id') id: string,
    @Body() dto: UpdateReviewDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const review = await this.reviewsService.update(id, dto, user);
    return ReviewResponseDto.fromPrisma(review);
  }

  @DeleteRoute()
  delete(@UUIDParam('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.reviewsService.delete(id, user);
  }
}
