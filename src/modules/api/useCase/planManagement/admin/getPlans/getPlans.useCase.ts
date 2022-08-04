// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
// import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
// import { PageDto } from 'src/common/dtos/page.dto';
// import { Billboard } from 'src/modules/api/billboards/billboard.entity';
// import { Plan } from 'src/modules/api/plans/plans.entity';
// import { Repository } from 'typeorm';

// @Injectable()
// export class GetAllPlansUseCase {
//   constructor(
//     @InjectRepository(Billboard)
//     private readonly plansRepo: Repository<Plan>,
//   ) {}

//   async getAll(
//     pageOptionsDto: PageOptionsDto,
//   ): Promise<PageDto<Plan>> {
//     const queryBuilder =
//       this.plansRepo.createQueryBuilder('plans');

//     queryBuilder
//       .orderBy('plans.createdAt', pageOptionsDto.order)
//       .skip(pageOptionsDto.skip)
//       .take(pageOptionsDto.take)
//       .addSelect('billboards.deletedAt')
//       .withDeleted();

//     const itemCount = await queryBuilder.getCount();
//     const { entities } = await queryBuilder.getRawAndEntities();

//     const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

//     return new PageDto(entities, pageMetaDto);
//   }
// }
