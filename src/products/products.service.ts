import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from 'src/products/dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor (
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    findAll() {
        return this.productRepository.find();
    }

    async findOne(id: string) {
        const prod = await this.productRepository.findOneBy({
            id: +id
        });

        if (!prod) {
            throw new NotFoundException(`Product with id #${id} is not found`);
        }
        return prod;
    }

    create(createProductDto: CreateProductDto) {
        const product = this.productRepository.create(createProductDto);

        return ;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.productRepository.preload({
            id: +id,
            ...updateProductDto
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
}
