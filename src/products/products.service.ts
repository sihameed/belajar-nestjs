import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from 'src/products/dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto/update-product.dto';
import { Kemasan } from './entities/kemasan.entity';

@Injectable()
export class ProductService {
    constructor (
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(Kemasan)
        private readonly kemasanRepository: Repository<Kemasan>,
    ) {}

    findAll() {
        return this.productRepository.find({
            relations: ['kemasans'],
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
