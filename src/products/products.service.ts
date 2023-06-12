import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateProductDto } from 'src/products/dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto/update-product.dto';
import { Kemasan } from './entities/kemasan.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { PRODUCT_BRANDS } from './products.constants';

@Injectable()
export class ProductService {
    constructor (
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Kemasan)
        private readonly kemasanRepository: Repository<Kemasan>,

        private readonly connection: Connection, 

        @Inject(PRODUCT_BRANDS)
        productBrands: string[],

    ) {
        console.log(productBrands);
    }

    findAll(paginationQuery: PaginationQueryDto) {
        const {limit, offset} = paginationQuery;

        return this.productRepository.find({
            relations: ['kemasans'],
            skip: offset,
            take: limit,
        });
    }

    async findOne(id: string) {
        const prod = await this.productRepository.find({
            relations: ['kemasans'],
            where: {
                id: +id, 
            }
        });

        if (!prod) {
            throw new NotFoundException(`Product with id #${id} is not found`);
        }
        return prod;
    }

    async create(createProductDto: CreateProductDto) {
        const kemasans = await Promise.all(
            createProductDto.kemasans.map(name => this.preloadKemasanByName(name)),
        );

        const product = this.productRepository.create({
            ...createProductDto,
            kemasans
        });

        return this.productRepository.save(product);
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const kemasans = updateProductDto.kemasans && (
            await Promise.all(updateProductDto.kemasans.map(name => this.preloadKemasanByName(name)))
        );
        
        const product = await this.productRepository.preload({
            id: +id,
            ...updateProductDto,
            kemasans,
        });

        if (!product) {
            throw new NotFoundException(`Product #${id} not found`);
        }

        return this.productRepository.save(product);
    }

    async remove(id: string) {
        const product = await this.findOne(id);
        
        return this.productRepository.remove(product);
    }

    async recommendKemasan(product: Product) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            product.recommendations++;
            
            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_product';
            recommendEvent.type = 'medicine';
            recommendEvent.payload = { productId: product.id };

            await queryRunner.manager.save(product);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadKemasanByName(name: string): Promise<Kemasan> {
        const existingKemasan = await this.kemasanRepository.findOneBy({
            name: name
        });

        if (existingKemasan) {
            return existingKemasan;
        }

        return this.kemasanRepository.create({ name });
    }
}
